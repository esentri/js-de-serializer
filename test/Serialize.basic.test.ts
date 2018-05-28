import {SimpleSerialize} from '../src/Serialize'
import {Serializable} from '../src/Serializable'
import {SerializedType} from '../src/SerializedType'
import {DeSerializeParameter} from '../src/DeSerializeParameter'

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

   it('serialize object to data structure string', done => {
      const testClass = new TestClass('hello', new NestedClass('world'))
      SimpleSerialize(testClass,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.STRING)
         .then(serialized => {
            expect(typeof serialized).toEqual('string')
            expect(serialized).toEqual(JSON.stringify(testClass))
            done()
         })
   })

   it('string to ArrayBuffer', done => {
      const testString = 'hello world'
      SimpleSerialize(testString,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.ARRAY_BUFFER)
         .then(serialized => {
            expect(typeof serialized).not.toBe('string')
            expect(typeof serialized).not.toBe('String')
            expect(serialized.byteLength).toBe(11)
            done()
         })
   })

   it('Uint8Array to ArrayBuffer', done => {
      const uintArray = new Uint8Array([12, 13, 14])
      SimpleSerialize(uintArray, [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.ARRAY_BUFFER).then(serialized => {
         expect(new Uint8Array(serialized)).toEqual(uintArray)
         done()
      })
   })

})
