/**
 * Calculates an estimate of the position of the head of the user in relation to screen or camera
 *   based on input from facetrackrObject
 *
 * Usage:
 *	var hp = new headtrackr.headposition.Tracker(facetrackrObject, 640, 480);
 *	var currentPosition = hp.track(facetrackrObject);
 *
 * @author auduno / github.com/auduno
 */

headtrackr.headposition = {};

/**
 *
 * Parameters to Tracker() are:
 *	facetrackrObject : a generic object with attributes x, y, width, height, angle
 *		which describe the position of center of detected face
 *	camwidth : width of canvas where the face was detected
 *	camheight : height of canvas where the face was detected
 *
 * Optional parameters can be passed along like this:
 *	 headtrackr.headposition.Tracker(facetrackrObject, 640, 480, {fov : 60})
 *
 * Optional parameters:
 *	 fov {number} : horizontal field of view of camera (default is to detect via distance to screen, any fov overrides distance_to_screen)
 *	 distance_to_screen {number} : initial distance from face to camera, in cms (default is 60 cm)
 *	 edgecorrection {boolean} : whether to use heuristic for position of head when detection is on the edge of the screen (default is true)
 *	 distance_from_camera_to_screen : distance from camera to center of screen (default is 11.5 cm, typical for laptops)
 *
 * Returns a generic object with attributes x, y, z which is estimated headposition in cm in relation to center of screen
 *
 * @constructor
 */
headtrackr.headposition.Tracker = function(facetrackrObj, camwidth, camheight, params) {
	
	// some assumptions that are used when calculating distances and estimating horizontal fov
	//	 head width = 17 cm -> 16
	//	 head height = 21 cm -> 19
	//	 when initialized, user is approximately 60 cm from camera
	
	if (!params) params = {};
	
	if (params.edgecorrection === undefined) {
		var edgecorrection = true;
	} else {
		var edgecorrection = params.edgecorrection;
	}
	
	this.camheight_cam = camheight;
	this.camwidth_cam = camwidth;
	
	var head_width_cm = 16;
	var head_height_cm = 19;
	
	// angle between side of face and diagonal across
	var head_small_angle = Math.atan(head_width_cm/head_height_cm);
	
	var head_diag_cm = Math.sqrt((head_width_cm*head_width_cm)+(head_height_cm*head_height_cm)); // diagonal of face in real space
	
	var sin_hsa = Math.sin(head_small_angle); //precalculated sine
	var cos_hsa = Math.cos(head_small_angle); //precalculated cosine
	var tan_hsa = Math.tan(head_small_angle); //precalculated tan
	
	// estimate horizontal field of view of camera
	var init_width_cam = facetrackrObj.width;
	var init_height_cam = facetrackrObj.height;
	var head_diag_cam = Math.sqrt((init_width_cam*init_width_cam)+(init_height_cam*init_height_cam));
	if (params.fov === undefined) {
		// we use the diagonal of the faceobject to estimate field of view of the camera
		// we use the diagonal since this is less sensitive to errors in width or height
		var head_width_cam = sin_hsa * head_diag_cam;
		var camwidth_at_default_face_cm = (this.camwidth_cam/head_width_cam) * head_width_cm;
		// we assume user is sitting around 60 cm from camera (normal distance on a laptop)
		if (params.distance_to_screen === undefined) {
			var distance_to_screen = 60;
		} else {
			var distance_to_screen = params.distance_to_screen;
		}
		// calculate estimate of field of view
		var fov_width = Math.atan((camwidth_at_default_face_cm/2)/distance_to_screen) * 2;
	} else {
		var fov_width = params.fov * Math.PI/180;
	}
	
	// precalculate ratio between camwidth and distance
	var tan_fov_width = 2 * Math.tan(fov_width/2);
	
	var x, y, z; // holds current position of head (in cms from center of screen)
	
	this.track = function(facetrackrObj) {
		
		var w = facetrackrObj.width;
		var h = facetrackrObj.height;
		var fx = facetrackrObj.x; 
		var fy = facetrackrObj.y; 
		
		if (edgecorrection) {
			// recalculate head_diag_cam, fx, fy
			var onVerticalEdge = (fx-(w/2) == 0 || fx+(h/2) == this.camwidth_cam);
			var onHorizontalEdge = (fy-(h/2) == 0 || fy+(h/2) == this.camheight_cam);
			
			if (onHorizontalEdge) {
				if (onVerticalEdge) {
					// we are in a corner, use previous diagonal as estimate, i.e. don't change head_diag_cam
					var onLeftEdge = (fx-w < 0);
					var onTopEdge = (fy-w < 0);
					if (onLeftEdge) {
						fx = w-(head_diag_cam * sin_hsa/2);
					} else {
						fx = fx-(w/2)+(head_diag_cam * sin_hsa/2);
					}
					if (onTopEdge) {
						fy = h-(head_diag_cam * cos_hsa/2);
					} else {
						fy = fy-(h/2)+(head_diag_cam*cos_hsa/2);
					}
				} else {
					// we are on top or bottom edge of camera, use width instead of diagonal and correct y-position
					head_diag_cam = w/sin_hsa;
					// fix fy
					if (fy-(h/2) == 0) {
						// TODO : recalc_fy becomes negative here - does that affect calculations
						fy = h-((w/tan_hsa)/2);
					} else {
						fy = fy-(h/2)+((w/tan_hsa)/2);
					}
				}
			} else if (onVerticalEdge) {
				// we are on side edges of camera, use height and correct x-position
				head_diag_cam = h/cos_hsa;
				if (fx-(w/2) == 0) {
					fx = w-(h*tan_hsa/2);
				} else {
					fx = fx-(w/2)+(h*tan_hsa/2);
				}
			} else {
				head_diag_cam = Math.sqrt((w*w)+(h*h));
			}
		} else {
			head_diag_cam = Math.sqrt((w*w)+(h*h));
		}
		
		// calculate cm-distance from screen
		z = (head_diag_cm*this.camwidth_cam)/(tan_fov_width*head_diag_cam);
		// to transform to z_3ds : z_3ds = (head_diag_3ds/head_diag_cm)*z
		// i.e. just use ratio
		
		// calculate cm-position relative to center of screen
		x = -((fx/this.camwidth_cam) - 0.5) * z * tan_fov_width;
		y = -((fy/this.camheight_cam) - 0.5) * z * tan_fov_width * (this.camheight_cam/this.camwidth_cam);
		
		
		// Transformation from position relative to camera, to position relative to center of screen
		if (params.distance_from_camera_to_screen === undefined) {
			// default is 11.5 cm approximately
			y = y + 11.5;
		} else {
			y = y + params.distance_from_camera_to_screen;
		}
					
		// send off event
		var evt = document.createEvent("Event");
		evt.initEvent("headtrackingEvent", true, true);
		evt.x = x;
		evt.y = y;
		evt.z = z;
		document.dispatchEvent(evt);
		
		return new headtrackr.headposition.TrackObj(x,y,z);
	}
	
	
	this.getTrackerObj = function() {
		return new headtrackr.headposition.TrackObj(x,y,z);
	}
	
	this.getFOV = function() {
		return fov_width * 180/Math.PI;
	}
}; 

/**
 * @constructor
 */
headtrackr.headposition.TrackObj = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	
	this.clone = function() {
		var c = new headtrackr.headposition.TrackObj();
		c.x = this.x;
		c.y = this.y;
		c.z = this.z;
		return c;
	}
};