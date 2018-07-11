import {SimpleSerialize} from '../src/Serialize'
import {Serializable} from '../src/Serializable'
import {ParametersArrayBufferWithoutFunction, ParametersBase64WithoutFunctions, ParametersStringWithoutFunction} from './Parameters'
import {DeSerializeParameterBuilder} from '../src/DeSerializeParameter'
import {ArrayBufferEqual} from './helper/ArrayBufferFunctions'
import fs from 'fs'

class TestClass {
   private a: string
   private b: NestedClass

   constructor (a: string, b: NestedClass) {
      this.a = a
      this.b = b
   }

   public nested (): string {
      return this.b.value()
   }
}

class NestedClass {
   private readonly c: string

   constructor (c: string) {
      this.c = c
   }

   public value (): string {
      return this.c
   }
}

class TestClassWithSerialize implements Serializable {
   private a: string

   constructor (a: string) {
      this.a = a
   }

   serialize (): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         resolve({a: 'custom serialize'})
      })
   }

}

class TestClassWithNestedCustomSerialize {
   private a: string
   private nestedClass: TestClassWithSerialize

   constructor (a: string, b: TestClassWithSerialize) {
      this.a = a
      this.nestedClass = b
   }

}

describe('serialize test', () => {
   it('with simple object', done => {
      SimpleSerialize(new TestClass('first', new NestedClass('nested'))).then(serialized => {
         expect(serialized.a).toEqual('first')
         expect(serialized.b.c).toEqual('nested')
         done()
      })
   })

   it('with serialize function', done => {
      SimpleSerialize(new TestClassWithSerialize('test')).then(serialized => {
         expect(serialized.a).toEqual('custom serialize')
         done()
      })
   })

   it('with nested serialize function', done => {
      SimpleSerialize(new TestClassWithNestedCustomSerialize('first',
         new TestClassWithSerialize('will be overwritten')))
         .then(serialized => {
            expect(serialized.a).toEqual('first')
            expect(serialized.nestedClass.a).toEqual('custom serialize')
            done()
         })
   })

   it('test with simple string', done => {
      let stringForSerialization = 'hello world'
      SimpleSerialize(stringForSerialization).then(serialized => {
         expect(serialized).toEqual(stringForSerialization)
         done()
      })
   })

   it('test with simple number', done => {
      let numberForSerialization = 13
      SimpleSerialize(numberForSerialization).then(serialized => {
         expect(serialized).toEqual(numberForSerialization)
         done()
      })
   })

   it('test with simple UInt8Array', done => {
      let uint8Array = new Uint8Array([46, 83, 91])
      SimpleSerialize(uint8Array).then(serialized => {
         expect(serialized).toEqual(uint8Array)
         done()
      })
   })

   it('test with simple Int8Array', done => {
      let int8Array = new Int8Array([15, 1, 22])
      SimpleSerialize(int8Array).then(serialized => {
         expect(serialized).toEqual(int8Array)
         done()
      })
   })

   it('serialize object to data structure string', done => {
      const testClass = new TestClass('hello', new NestedClass('world'))
      SimpleSerialize(testClass,ParametersStringWithoutFunction)
         .then(serialized => {
            expect(typeof serialized).toEqual('string')
            expect(serialized).toEqual(JSON.stringify(testClass))
            done()
         })
   })

   it('string to ArrayBuffer', done => {
      const testString = 'hello world'
      SimpleSerialize(testString, ParametersArrayBufferWithoutFunction)
         .then(serialized => {
            expect(typeof serialized).not.toBe('string')
            expect(typeof serialized).not.toBe('String')
            expect(serialized.byteLength).toBe(11)
            done()
         })
   })

   it('ArrayBuffer to ArrayBuffer', done => {
      let file = fs.readFileSync(__dirname + '/testData/text.txt')
      let arrayBuffer = new Uint8Array(file).buffer
      SimpleSerialize(arrayBuffer, ParametersArrayBufferWithoutFunction).then(serialized => {
         expect(ArrayBufferEqual(serialized['__arrayBuffer__'], arrayBuffer)).toBeTruthy()
         done()
      })
   })

   it('Uint8Array to ArrayBuffer', done => {
      const uintArray = new Uint8Array([12, 13, 14])
      SimpleSerialize(uintArray, ParametersArrayBufferWithoutFunction).then(serialized => {
         expect(new Uint8Array(serialized)).toEqual(uintArray)
         done()
      })
   })

   it('string to base64', done => {
      const helloWorld = 'hello world'
      const helloWorldBase64 = 'aGVsbG8gd29ybGQ='
      SimpleSerialize(helloWorld, ParametersBase64WithoutFunctions).then(serialized => {
         expect(serialized).toEqual(helloWorldBase64)
         done()
      })
   })

})
