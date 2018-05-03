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

   serialize (): any {
      return {a: 'custom serialize'}
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
   it('with simple object', () => {
      let serialized = SimpleSerialize(new TestClass('first', new NestedClass('nested')))
      expect(serialized.a).toEqual('first')
      expect(serialized.b.c).toEqual('nested')
   })

   it('with serialize function', () => {
      let serialized = SimpleSerialize(new TestClassWithSerialize('test'))
      expect(serialized.a).toEqual('custom serialize')
   })

   it('with nested serialize function', () => {
      let serialized = SimpleSerialize(new TestClassWithNestedCustomSerialize('first',
         new TestClassWithSerialize('will be overwritten')))
      expect(serialized.a).toEqual('first')
      expect(serialized.nestedClass.a).toEqual('custom serialize')
   })

   it('test with simple string', () => {
      let stringForSerialization = 'hello world'
      let serialized = SimpleSerialize(stringForSerialization)
      expect(serialized).toEqual(stringForSerialization)
   })

   it('serialize object to data structure string', () => {
      const testClass = new TestClass('hello', new NestedClass('world'))
      const serialized = SimpleSerialize(testClass,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.STRING)
      expect(typeof serialized).toEqual('string')
      expect(serialized).toEqual(JSON.stringify(testClass))
   })

   it('string to ArrayBuffer', () => {
      const testString = 'hello world'
      const serialized = SimpleSerialize(testString,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.ARRAY_BUFFER) as ArrayBuffer
      expect(typeof serialized).not.toBe('string')
      expect(typeof serialized).not.toBe('String')
      expect(serialized.byteLength).toBe(11)
   })

})
