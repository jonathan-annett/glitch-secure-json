const lib = (module.exports = {});

const { env_vars,setEnvVar } = require("glitch-env");
const secureJSON_ = require("secure-json");
let secureJSON;

const pk_str = env_vars.JSON_PRIV_KEY;
const { exec } = require('child_process');

const saveKeysAndRefresh = function(msg) {
  setEnvVar("JSON_PRIV_KEY",secureJSON.exportedKeys.keys,function(){
     console.log(msg); 
     exec('refresh', (error, stdout, stderr) => {
        setTimeout(process.exit,1000);
     });
  });
}



if (pk_str === 'reset') {
  secureJSON = secureJSON_();
  saveKeysAndRefresh('secureJSON updated (created new keys - refreshing)');
  
} else {
  if (typeof pk_str==='string' && pk_str.length>1024) {
      secureJSON = secureJSON_(pk_str);
      if (secureJSON) {
         console.log('secureJSON is ready (loaded previous keys)');  
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
       console.log ("not expecting JSON_PRIV_KEY to be",typeof pk_str);
     }
  }
}


lib.stringify=secureJSON.stringify;
lib.parse=secureJSON.parse;
if (secureJSON && secureJSON.lockdown) 
   lib.secureJSON=secureJSON;

