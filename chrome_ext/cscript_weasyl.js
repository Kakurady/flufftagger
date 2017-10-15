"use strict";
var box = document.getElementById("submitfile");

async function fileChanged(){
    var files = [...box.files];
    
    // substitute with actual metadata gathering
    var filenames = files.map( x=> x.name );
    var description = filenames.join("\n");
    
    var descbox = document.getElementById("submissiondesc")
    descbox.value = description;
    descbox.dispatchEvent(new Event("input")); // keeping markdown converter happy
    descbox.dispatchEvent(new Event("change")); // not useful here, but the tag list builder needs it.
}


box.addEventListener("change", fileChanged);
