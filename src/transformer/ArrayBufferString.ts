export function arrayBufferToString (arrayBuffer: ArrayBuffer): string {
   return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
}

export function stringToArrayBuffer (str: string): ArrayBuffer {
   return (new Uint8Array([].map.call(str,
      (x: any) => {
         return x.charCodeAt(0)
      }))).buffer as ArrayBuffer
}
