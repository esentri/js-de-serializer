import {Deserializer, SimpleDeserializer} from '../src/Deserializer'
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

describe('deserializer test', () => {

   it('with simple object', () => {
      let serialized = SimpleSerialize(new TestClass('test', 'nested'))
      let deserialized = Deserializer.simple(TestClass).deserialize(serialized) as TestClass
      expect(deserialized.testFunction()).toEqual('test|nested')
   })

   it('with object with deserialize', () => {
      let serialized = SimpleSerialize(new ObjectWithDeserialize('testValue'))
      let deserialized = Deserializer.simple(ObjectWithDeserialize)
         .deserialize(serialized) as ObjectWithDeserialize
      expect(deserialized.value).toEqual('overwritten')
   })

   it('from string with simple object', () => {
      let serialized = SimpleSerialize(new TestClass('test', 'nested'),
         SerializedType.STRING)
      let deserialized = Deserializer.simple(TestClass, SerializedType.STRING)
         .deserialize(serialized) as TestClass
      expect(deserialized.testFunction()).toEqual('test|nested')
   })

   it('from string with object with deserialize', () => {
      let serialized = SimpleSerialize(new ObjectWithDeserialize('testValue'),
         SerializedType.STRING)
      let deserialized = Deserializer.simple(ObjectWithDeserialize, SerializedType.STRING)
         .deserialize(serialized) as ObjectWithDeserialize
      expect(deserialized.value).toEqual('overwritten')
   })

   it('with default SimpleDeserializer', () => {
      let serialized = SimpleSerialize(new ObjectWithDeserialize('testValue'),
         SerializedType.STRING)
      let deserialized = new SimpleDeserializer(ObjectWithDeserialize)
         .deserialize(serialized) as ObjectWithDeserialize
      expect(deserialized.value).toEqual('overwritten')
   })
})
