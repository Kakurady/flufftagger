"use strict";
let decoder = new TextDecoder("utf-8");


function makeFacade(arrayBuffer){
// Firefox doesn't let us call slice on Uint8Array, which the "buffer" package
// wraps for us. so we need to make our own Node-compatible Buffer, just enough
// to work with IPTC parser.

// TODO: In case we still want to use the "buffer" package:
// Firefox doesn't let us call slice on Uint8Array, but will let us
// slice the ArrayBuffer.
// so when IPTC parser asks for a slice of Uint8Array, we can slice the
// underlying ArrayBuffer through proxy instead. Otherwise, pass along
// everything to the "buffer" package.
  let handler = {
    get: function(target, property){
      switch (property){
        case "readUInt16BE":
          return (offset) => (
              (target [offset] << 8)
            | target[offset+1]
          );
        case "readInt16BE":
          return (offset) => (
            (target[offset] & 0x80 ? 0xffff0000 : 0 )
            | (target[offset] << 8)
            | target[offset+1]
          );
        case "readInt32BE":
          return (offset) => (
            (target[offset] & 0x80 ? 0x80000000 : 0 )
            | (target [offset] << 24)
            | (target [offset+1] << 16)
            | (target [offset+2] << 8)
            | target[offset+3]
          );
        case "slice":
          return function slice (start, end){
            return {
              "src": Uint8Array.from({length: end-start}, (v, k)=> target[start+k]),
              "toString": function toString(encoding){
                return decoder.decode(this.src);
              }
            }
          }
        case "length":
        default:
          return target[property];
      }
    }
  }

  let arr = new Uint8Array(arrayBuffer);
  return new Proxy(arr, handler);
}
