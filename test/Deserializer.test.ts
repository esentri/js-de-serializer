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

   static deserialize (dataStructure: any): Promise<ObjectWithDeserialize> {
      return new Promise<ObjectWithDeserialize>(resolve =>
         resolve(new ObjectWithDeserialize('overwritten')))
   }
}

describe('deserializer test', () => {

   it('with simple object', done => {
      SimpleSerialize(new TestClass('test', 'nested'),
         {withFunctions: false})
         .then(serialized => {
            Deserializer.simple<TestClass>(TestClass).deserialize(serialized)
               .then((deserialized: TestClass) => {
                  expect(deserialized.testFunction()).toEqual('test|nested')
                  done()
               })
         })
   })

   it('with object with deserialize', done => {
      SimpleSerialize(new ObjectWithDeserialize('testValue'),
         {withFunctions: false})
         .then(serialized => {
            Deserializer.simple<ObjectWithDeserialize>(ObjectWithDeserialize)
               .deserialize(serialized)
               .then((deserialized: ObjectWithDeserialize) => {
                  expect(deserialized.value).toEqual('overwritten')
                  done()
               })
         })
   })

   it('from string with simple object', done => {
      SimpleSerialize(new TestClass('test', 'nested'),
         {withFunctions: false, output: SerializedType.STRING})
         .then(serialized => {
            Deserializer.simple<TestClass>(TestClass)
               .deserialize(serialized)
               .then(deserialized => {
                  expect(deserialized.testFunction()).toEqual('test|nested')
                  done()
               })
         })
   })

   it('from string with object with deserialize', done => {
      SimpleSerialize(new ObjectWithDeserialize('testValue'),
         {withFunctions: false, output: SerializedType.STRING})
         .then(serialized => {
            Deserializer.simple<ObjectWithDeserialize>(ObjectWithDeserialize)
               .deserialize(serialized)
               .then(deserialized => {
                  expect(deserialized.value).toEqual('overwritten')
                  done()
               })
         })
   })

   it('with default SimpleDeserializer', done => {
      SimpleSerialize(new ObjectWithDeserialize('testValue'),
         {withFunctions: false, output: SerializedType.STRING})
         .then(serialized => {
            new SimpleDeserializer(ObjectWithDeserialize).deserialize(serialized)
               .then(deserialized => {
                  expect(deserialized.value).toEqual('overwritten')
                  done()
               })
         })
   })
})
