/* Hungry Kittens
Author: Luz Caballero (@gerbille)*/

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime");

// set up the options to run the server
var optimist = require("optimist")
	.usage("Run the kitten server.\nUsage: $0 [options]")
	.options("port", {
		alias: "p",
		default: 8080,
		describe: "Port the server should run at."
	})
	.options("ip", {
		alias: "i",
		default: "0.0.0.0",
		string: true,
		describe: "IP of the server."
	})
	.options("origins-allowed", {
		alias: "o",
		string: true,
		describe: "Origins allowed to connect to this server (you can use -o multiple times to allow multiple origins)."
	})
	.options("cats-per-room", {
		alias: "n",
		default: 10,
		describe: "Max number of kittens per room."
	})
	.options("help", {
		alias: "h",
		describe: "Show this help."
	})

// argv is an object that has the options passed from the command line when starting the server
var argv = optimist.argv;

// if the user asked for help, use console.log to show the server.js help
if (argv.help) {
	optimist.showHelp(console.log);
	return;
}

var server = http.createServer(handler);

// handling http requests to serve files
function handler(request, response) {
	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd(), uri);

	if (uri === "/")
		filename += "index.html";

	fs.exists(filename, function(exists) {
		if(!exists) {
			response.writeHeader(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		fs.readFile(filename, "binary", function (err, file) {
			if (err) {
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.write(err + "\n");
				response.end();
				return;
			}

			var type = mime.lookup(filename);
			response.writeHead(200, { "Content-Type": type });
			response.write(file, "binary");
			response.end();
		});
	});
}

// maps the cats to their rooms: room is an object that contains all the cats in a room, room.id is the room number
var Room = function (id) {
	Object.defineProperties(this, {
		id: { value: id }
	});
}

// RoomManager is an object that contains the rooms
var RoomManager = function (catsPerRoom) {
	Object.defineProperties(this, {
		cats: { value: {} },
		connections: { value: {} },
		lastCatId: { value: 0, writable: true },
		catsPerRoom: { value: catsPerRoom, writable: true },

		// finds a room with an available slot
		getAvailableRoom: { value: function () {
			var room;
			for (var r in this) {
				// is there any room that has a slot?
				if (Object.keys(this[r]).length < this.catsPerRoom) {
					room = this[r];
					break;
				}
			}
			// if no room has available slots, create a new room with the first available id
			if (!room) {
				var id = 0;
				for (id=0; id in this; id++) {}
				this[id] = room = new Room(id);
			}
			return room;
		}},

		// assigns an id to a cat a puts it in a room
		addCat: { value: function (cat, connection) {
			var room = this.getAvailableRoom();
			cat.id = this.lastCatId++;
			cat.roomId = room.id;
			room[cat.id] = this.cats[cat.id] = cat;
			this.connections[cat.id] = connection;
		}},

		removeCat: { value: function (cat) {
      //weird but happens sometimes
      if (!this.cats) {
        this.cats = {};
      }

			if (!this.cats[cat.id]) {
				return;
			}
			// remove from existing cats
			delete this.cats[cat.id];
			// remove from the room
			delete this[cat.roomId][cat.id];
			// remove its connection
			delete this.connections[cat.id];
			// if this leaves no more cats in its room, then remove the room
			if (Object.keys(this[cat.roomId]).length == 0){
				delete this[cat.roomId];
			} else {
				// update peers
				broadcast("unload", cat.roomId, cat.id);
			}
		}},
	})
}

function send(connection, type, data) {
	connection.sendUTF(JSON.stringify({ type: type, data: data }));
}

function broadcast(type, roomId, data) {
	var s = JSON.stringify({ type: type, data: data});
	for (var id in rooms[roomId]) {
		rooms.connections[id].sendUTF(s);
	}
}

// used by Opera to remove cats when the user closes the window
setInterval(function () {
	if (!Object.keys(rooms.cats).length){
		return;
	}

	var toKill = [];
	// if the peer hasn't replied to the last server ping, remove the cat
	for (var id in rooms.cats) {
		if (!rooms.cats[id].ack){
			toKill.push(rooms.cats[id]);
		}
		rooms.cats[id].ack = false;
	}
	toKill.forEach(rooms.removeCat);
	// check on all the peers
	ws.broadcastUTF(JSON.stringify({ type: "ping" }));
}, 10000)

var WebSocketServer = require("websocket").server;

var ws = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

// who's allowed to set up web socket connections
function originIsAllowed(origin) {
	var u = url.parse(origin);
	var origins = argv["origins-allowed"];
	if (origins && !Array.isArray(origins)){
		argv["origins-allowed"] = origins = [origins];
	}
	return !origins || u.host in origins;
}

var rooms = new RoomManager(argv["cats-per-room"]);

ws.on("request", function(request) {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		return;
	}

	var connection = request.accept();

	var cat = {
		id: -1,
		name: url.parse(request.httpRequest.url, true).query.name || "",
		x: 0, y: 0,
		w: 32, h: 32,
		looking: "left",
		frames: 3,
		dir: 1,
		ack: true,
	};

	// create a cat
	rooms.addCat(cat, connection);

	// send cat information to its peer
	send(connection, "connected", {
		cats: rooms[cat.roomId],
		id: cat.id,
		roomId: cat.roomId
	});

	// tell other peers about the new cat
	broadcast("new-cat", cat.roomId, cat);

	var handlers = {
		// if someone has moved, broadcast to others
		"move": function (data) {
			var cat = rooms.cats[data.id];
			if (!cat)
				return;
			cat.x = data.x;
			cat.y = data.y;
			cat.looking = data.looking;
			broadcast("moved", cat.roomId, rooms[cat.roomId]);
		},

		// mark peers who replied to server as still alive :)
		"pong": function (id) {
			if (rooms.cats[id]){
				rooms.cats[id].ack = true;
			}
		},

		// if someone meowed, broadcast to others
		"meow": function (id) {
			if (rooms.cats[id]){
				broadcast("meow", rooms.cats[id].roomId, id);
			}
		}
	}

	connection.on("message", function(message) {
		if (message.type === "utf8") {
			try { var o = JSON.parse(message.utf8Data); } catch (e) { return; }
			if (!(o.type in handlers)){
				return;
			}
			handlers[o.type](o.data);
		}
	});

	// remove cat for browsers that fire "unload"
	connection.on("close", function () {
		rooms.removeCat(cat);
	})
});

server.listen(argv.port, argv.ip, function () {
	console.log("Server running on " + argv.ip + ":" + argv.port);
});

