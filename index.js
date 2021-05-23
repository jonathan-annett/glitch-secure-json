const lib = (module.exports = {});

const secureJSON_ = require("secure-json");
let secureJSON;
const { env_vars,addEnvVar } = require("glitch-env");
const pk_str = env_vars.JSON_PRIV_KEY;
const is_glitch = require("glitch-detect");
const saveKeysAndRefresh = function(msg) {
  console.log(msg);
  addEnvVar("JSON_PRIV_KEY",secureJSON.exportedKeys.keys);
  refresh () ;
}



if (pk_str === 'reset') {
  secureJSON = secureJSON_();
  saveKeysAndRefresh('secureJSON updated (created new keys - refreshing)');
  
} else {
  if (typeof pk_str==='string' && pk_str.length>1024) {
      secureJSON = secureJSON_(pk_str);
      if (secureJSON) {
         //console.log('secureJSON is ready (loaded previous keys)');  
      } else {
        secureJSON = secureJSON_();
        saveKeysAndRefresh('something went wrong (keys were corrupt?,created new keys - refreshing)');  
      }    
  
  } else {
     secureJSON = secureJSON_();
     if (typeof pk_str!=='string' || pk_str.length<1024) {
        console.log('invalid JSON_PRIV_KEY in env');
     } 
     if (typeof pk_str==='string') {
        
       saveKeysAndRefresh('secureJSON is ready (keys were corrupt,created new keys - refreshing)');  
       
        
     } else {
       saveKeysAndRefresh ("not expecting JSON_PRIV_KEY to be "+typeof pk_str+" - refreshing");
     }
  }
}

function refresh () {
  
if (!is_glitch) {  
   return; 
}
const { exec } = require('child_process');
  
  exec('refresh', (error, stdout, stderr) => {
        process.exit();
     });

}

lib.stringify=secureJSON.stringify;
lib.parse=secureJSON.parse;
lib.refresh = refresh;
if (secureJSON && secureJSON.lockdown) 
   lib.secureJSON=secureJSON;

