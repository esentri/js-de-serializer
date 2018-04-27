import {ArrayBufferEqual} from '../../src/transformer/ArrayBufferFunctions'

describe('test ArrayBufferFunctions', () => {
   it('array buffer equal true', () => {
      const arrayBuffer1 = new Uint8Array([1, 2, 3, 4]).buffer as ArrayBuffer
      const arrayBuffer2 = new Uint8Array([1, 2, 3, 4]).buffer as ArrayBuffer
      expect(ArrayBufferEqual(arrayBuffer1, arrayBuffer2)).toBeTruthy()
   })
   it('array buffer equal false (different length)', () => {
      const arrayBuffer1 = new Uint8Array([1, 2, 3, 4]).buffer as ArrayBuffer
      const arrayBuffer2 = new Uint8Array([1, 2, 3]).buffer as ArrayBuffer
      expect(ArrayBufferEqual(arrayBuffer1, arrayBuffer2)).toBeFalsy()
   })
   it('array buffer equal false (different content)', () => {
      const arrayBuffer1 = new Uint8Array([1, 2, 3, 4]).buffer as ArrayBuffer
      const arrayBuffer2 = new Uint8Array([1, 1, 1, 1]).buffer as ArrayBuffer
      expect(ArrayBufferEqual(arrayBuffer1, arrayBuffer2)).toBeFalsy()
   })
})
