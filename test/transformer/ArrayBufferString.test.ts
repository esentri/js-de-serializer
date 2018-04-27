import {arrayBufferToString, stringToArrayBuffer} from '../../src/transformer/ArrayBufferString'
import {ArrayBufferEqual} from '../../src/transformer/ArrayBufferFunctions'

describe('test transformation of ArrayBuffer <-> String', () => {

   const arrayBufferHelloWorld =
      new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]).buffer as ArrayBuffer

   it('ArrayBuffer to string', () => {
      const str = arrayBufferToString(arrayBufferHelloWorld)
      expect(str).toBe('hello world')
   })

   it('string to ArrayBuffer', () => {
      const str = 'hello world'
      const arrayBuffer = stringToArrayBuffer(str)
      expect(ArrayBufferEqual(arrayBufferHelloWorld, arrayBuffer)).toBeTruthy()
   })
})
