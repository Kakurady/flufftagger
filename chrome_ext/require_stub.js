"use strict";
function require(name, b){
  //console.log("Require called", name, b)
  switch (name){
    case "buffer":
      return {
        Buffer:{
          isBuffer: ()=>true
        }
      };
    case "fs":
      return {};
    default:
      return null;
  }
}
