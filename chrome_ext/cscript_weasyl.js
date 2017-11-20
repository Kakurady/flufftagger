"use strict";
var box = document.getElementById("submitfile");

box.addEventListener("change", fileChanged);

async function fileChanged(){
    // read files
    var files = [...box.files];
    
    let meta = await readMetadataFromFile(files[0]);
    console.log(meta);
    
    // interpret
    var title = meta.headline;
    var description = meta.caption;
    var tags = [...buildWeasylTags(meta)];
    
    // fill
    var titlebox = document.getElementById("submissiontitle");
    titlebox.value = title.slice(0, 200);
    
    var descbox = document.getElementById("submissiondesc")
    descbox.value = description;
    descbox.dispatchEvent(new Event("input")); // keeping markdown converter happy
    descbox.dispatchEvent(new Event("change")); // not useful here, but the tag list builder needs it.
    
    var tagbuilder =  document.querySelector("[name=tags]+.listbuilder input");
    tagbuilder.value=tags.join(" ");
    tagbuilder.dispatchEvent(new KeyboardEvent("keyup"));
}

function* buildWeasylTags(meta){
    const underlined=/[ -]/gi;
    const removed = /'/gi;
    for(const keyword of meta.keywords){
        // TODO process "Pokémon"
        var kw = keyword;
        kw = kw.replace(underlined, "_");
        kw = kw.replace(removed, "");
        yield kw;
    }
    // Need to also format these.
    //if (meta.city) yield meta.city;
    //if (meta.province_or_state) yield meta.province_or_state;
    //if (meta.country_or_primary_location_name) yield meta.country_or_primary_location_name;
    
}
