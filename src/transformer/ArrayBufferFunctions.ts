export function ArrayBufferEqual (buffer1: ArrayBuffer, buffer2: ArrayBuffer): boolean {
   if (buffer1.byteLength !== buffer2.byteLength) return false
   const array1 = new Uint8Array(buffer1)
   const array2 = new Uint8Array(buffer2)
   for (let index = 0; index < array1.byteLength; index++) {
      if (array1[index] !== array2[index]) return false
   }
   return true
}
