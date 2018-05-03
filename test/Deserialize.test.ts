import {SimpleDeserialize} from '../src/Deserialize'
import {SimpleSerialize} from '../src/Serialize'
import {SerializedType} from '../src/SerializedType'
import {SimpleNestedTestClass, SimpleTestClassNested} from './testClasses/SimpleTestClassNested'
import {DeSerializeParameter} from '../src/DeSerializeParameter'

class NestedTestClass {
   private test: string = 'defaultNested'

   constructor (test: string) {
      this.test = test
   }

   public testFunction (): string {
      return this.test
   }
}

class TestClass {
   private test: string = 'default'
   private nestedTestClass: NestedTestClass

   constructor (test: string, testNested: string) {
      this.test = test
      this.nestedTestClass = new NestedTestClass(testNested)
   }

   public testFunction (): string {
      return this.test + '|' + this.nestedTestClass.testFunction()
   }
}

class ObjectWithDeserialize {
   public value: string

   constructor (value: string) {
      this.value = value
   }

   static deserialize (dataStructure: any) {
      return new ObjectWithDeserialize('overwritten')
   }
}

describe('deserialize test', () => {
   it('with simple object', () => {
      let serialized = SimpleSerialize(new TestClass('test', 'nested'),
         [DeSerializeParameter.WITHOUT_FUNCTIONS])
      let deserialized = SimpleDeserialize(serialized, TestClass) as TestClass
      expect(deserialized.testFunction()).toEqual('test|nested')
   })

   it('with object with deserialize', () => {
      let serialized = SimpleSerialize(new ObjectWithDeserialize('testValue'),
         [DeSerializeParameter.WITHOUT_FUNCTIONS])
      let deserialized = SimpleDeserialize(
         serialized,
         ObjectWithDeserialize
      ) as ObjectWithDeserialize
      expect(deserialized.value).toEqual('overwritten')
   })

   it('deserialize simple object from string', () => {
      let testClass = new TestClass('hello', 'world')
      let serialized = SimpleSerialize(testClass,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.STRING)
      let deserialized =
         SimpleDeserialize(serialized, TestClass, SerializedType.STRING) as TestClass
      expect(deserialized.testFunction()).toBe('hello|world')
   })

   it('deserialize object with deserialize from string', () => {
      let testObject = new ObjectWithDeserialize('hello')
      let serialized = SimpleSerialize(testObject,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.STRING)
      let deserialized = SimpleDeserialize(serialized,
         ObjectWithDeserialize, SerializedType.STRING) as ObjectWithDeserialize
      expect(deserialized.value).toBe('overwritten')
   })

   it('deserialize simple object from ArrayBuffer', () => {
      let testClass = new TestClass('hello', 'world')
      let serialized = SimpleSerialize(testClass,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.ARRAY_BUFFER)
      let deserialized =
         SimpleDeserialize(serialized, TestClass, SerializedType.ARRAY_BUFFER) as TestClass
      expect(deserialized.testFunction()).toBe('hello|world')
   })

   it('deserialize SimpleTestClassNested from ArrayBuffer', () => {
      let testClass = new SimpleTestClassNested(new SimpleNestedTestClass('hello world'))
      let serialized = SimpleSerialize(testClass,
         [DeSerializeParameter.WITH_FUNCTIONS], SerializedType.ARRAY_BUFFER)
      let deserialized =
         SimpleDeserialize(serialized, SimpleTestClassNested, SerializedType.ARRAY_BUFFER) as SimpleTestClassNested
      expect(deserialized['nestedTestClass']['field']).toBe('hello world')
      expect(deserialized.getField()).toBe('hello world')
   })

   it('deserialize number from ArrayBuffer', () => {
      const num = 12345678
      const serialized = SimpleSerialize(num, [DeSerializeParameter.WITHOUT_FUNCTIONS],
         SerializedType.ARRAY_BUFFER)
      const deserialized = SimpleDeserialize(serialized, {}, SerializedType.ARRAY_BUFFER)
      expect(deserialized).toEqual(num)
   })

   it('deserialize simple string from ArrayBuffer', () => {
      const helloWorldString = 'hello world'
      const serialized = SimpleSerialize(helloWorldString,
         [DeSerializeParameter.WITHOUT_FUNCTIONS], SerializedType.ARRAY_BUFFER)
      const deserialized = SimpleDeserialize(serialized, {}, SerializedType.ARRAY_BUFFER)
      expect(deserialized).toEqual(helloWorldString)
   })

})
