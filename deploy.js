#!/usr/bin/env node

var argv = require('optimist')
      .usage('Deploy shinydemos to production (www) or staging (dev) environments. Defaults to dev.\n\nExample usage: ./deploy.js --env=dev')
      .demand('env')
      .alias('e', 'env')
      .describe('env', 'The deployment environment. Values are either "prod" or "dev".')
      .argv,
    exec = require('child_process').exec,
    prompt = require('prompt'),
    colors = require('colors'),
    verify = {
      message: 'Confirm that you want to deploy to production'.magenta +' '+'[yes, no]'.inverse.magenta,
      name: 'verify',
      validator: /^(y(?:es)?)|no*$/i,
      warning: 'Possible answers: "yes", "y", "no", "n"',
      empty: false
    },
    child;
  
if (argv.env == "dev") {
  
  console.log('Deploying to dev.shinydemos.com. Hold on to your pants.'.green);
  
  child = exec('cd deploy && rsync -e ssh -av . devrelbot@homes.oslo.osa:/home/devrelbot/public_html/dev.shinydemos.com',
    function (error, stdout, stderr) {
      console.log(stdout);
      process.exit();
      if (stderr) {
        console.log('stderr: ' + stderr);
      }
      
      if (error) {
        console.log('exec error: ' + error);
      }
  });
}

if (argv.env == "prod") {
  
  prompt.message = "";
  prompt.delimiter = " => ".white;
  prompt.start();
  prompt.get(verify, function(err, result){
    if (/^y(?:es)*$/i.test(result.verify)) {
      console.log('Deploying to shinydemos.com. Hold on to your pants.'.green);
      
   /* THIS STAYS UNCOMMENTED UNTIL WE'RE READY TO DEPLOY. NO ACCIDENTS. KTHX.  
      child = exec('cd deploy && rsync -e ssh -av . shinydemos@shinydemos.com:/home/shinydemos/shinydemos.com',
        function (error, stdout, stderr) {
          console.log(stdout);
          process.exit();
          if (stderr) {
            console.log('stderr: ' + stderr);
          }
          
          if (error) {
            console.log('exec error: ' + error);
          }
      });
    */
    } else if (/^no*$/i.test(result.verify)) {
      console.log('OK, you probably need to use','"--env=dev"'.underline);
    }  
  });
}
