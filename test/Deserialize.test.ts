import {SimpleDeserialize} from '../src/Deserialize'
import {SimpleSerialize} from '../src/Serialize'
import {SerializedType} from '../src/SerializedType'

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
      let serialized = SimpleSerialize(new TestClass('test', 'nested'))
      let deserialized = SimpleDeserialize(serialized, TestClass) as TestClass
      expect(deserialized.testFunction()).toEqual('test|nested')
   })

   it('with object with deserialize', () => {
      let serialized = SimpleSerialize(new ObjectWithDeserialize('testValue'))
      let deserialized = SimpleDeserialize(
         serialized,
         ObjectWithDeserialize
      ) as ObjectWithDeserialize
      expect(deserialized.value).toEqual('overwritten')
   })

   it('deserialize simple object from string', () => {
      let testClass = new TestClass('hello', 'world')
      let serialized = SimpleSerialize(testClass, SerializedType.STRING)
      let deserialized =
         SimpleDeserialize(serialized, TestClass, SerializedType.STRING) as TestClass
      expect(deserialized.testFunction()).toBe('hello|world')
   })

   it('deserialize object with deserialize from string', () => {
      let testObject = new ObjectWithDeserialize('hello')
      let serialized = SimpleSerialize(testObject, SerializedType.STRING)
      let deserialized = SimpleDeserialize(serialized,
         ObjectWithDeserialize, SerializedType.STRING) as ObjectWithDeserialize
      expect(deserialized.value).toBe('overwritten')
   })
})
