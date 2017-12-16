/*   Copyright 2017 Kakurady
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
*/

"use strict;"
// TODO use rollup instead!

// FIXME: this does not work in Firefox :(
function readFileAsArrayBufferAsync(file){
    let reader = new FileReader();

    return new Promise((resolve,reject)=> {
                reader.onload = x=>resolve(reader.result);
                reader.readAsArrayBuffer(file);
        }
    );
}

async function readMetadataFromFile(file){
    let arrayBuffer = await readFileAsArrayBufferAsync(file);

    let nodeBuffer = buffer.Buffer.from(arrayBuffer);
    let meta = IptcParser.IptcParser.parse(nodeBuffer);
    
    return meta;
}

