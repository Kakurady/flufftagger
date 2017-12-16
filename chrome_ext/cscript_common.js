"use strict;"
// TODO use rollup instead!

// FIXME: this does not work in Firefox :(
function readFileAsArrayBufferAsync(file){
    let reader = new FileReader();

    let p = new Promise((resolve,reject)=> {
            reader.onload = x=>resolve(reader.result);
        }
    );
    reader.readAsArrayBuffer(file);
    return p;
}

async function readMetadataFromFile(file){
    let arrayBuffer = await readFileAsArrayBufferAsync(file);

    let nodeBuffer = buffer.Buffer.from(arrayBuffer);
    let meta = IptcParser.IptcParser.parse(nodeBuffer);
    
    return meta;
}

