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

   static deserialize (dataStructure: any): Promise<ObjectWithDeserialize> {
      return new Promise(resolve => resolve(new ObjectWithDeserialize('overwritten')))
   }
}

describe('deserialize test', () => {
   it('with simple object', done => {
      SimpleSerialize(new TestClass('test', 'nested'),
         {withFunctions: false})
         .then(serialized => {
            SimpleDeserialize(serialized, TestClass).then(deserialized => {
               expect(deserialized.testFunction()).toEqual('test|nested')
               done()
            })
         })
   })

   it('with object with deserialize', done => {
      SimpleSerialize(new ObjectWithDeserialize('testValue'),
         {withFunctions: false})
         .then(serialized => {
            SimpleDeserialize(serialized, ObjectWithDeserialize).then(deserialized => {
               expect(deserialized.value).toEqual('overwritten')
               done()
            })
         })
   })

   it('deserialize simple object from string', done => {
      let testClass = new TestClass('hello', 'world')
      SimpleSerialize(testClass,
         {withFunctions: false, output: SerializedType.STRING})
         .then(serialized => {
            SimpleDeserialize(serialized, TestClass)
               .then(deserialized => {
                  expect(deserialized.testFunction()).toBe('hello|world')
                  done()
               })
         })
   })

   it('deserialize object with deserialize from string', done => {
      let testObject = new ObjectWithDeserialize('hello')
      SimpleSerialize(testObject,
         {withFunctions: false, output: SerializedType.STRING})
         .then(serialized => {
            SimpleDeserialize(serialized, ObjectWithDeserialize)
               .then(deserialized => {
                  expect(deserialized.value).toBe('overwritten')
                  done()
               })
         })
   })

   it('deserialize simple object from ArrayBuffer', done => {
      let testClass = new TestClass('hello', 'world')
      SimpleSerialize(testClass,
         {withFunctions: false, output: SerializedType.ARRAY_BUFFER})
         .then(serialized => {
            console.log(serialized, 'HIER')
            SimpleDeserialize(serialized, TestClass)
               .then(deserialized => {
                  expect(deserialized.testFunction()).toBe('hello|world')
                  done()
               })
         })
   })

   it('deserialize SimpleTestClassNested from ArrayBuffer', done => {
      let testClass = new SimpleTestClassNested(new SimpleNestedTestClass('hello world'))
      SimpleSerialize(testClass,
         {withFunctions: true, output: SerializedType.ARRAY_BUFFER})
         .then(serialized => {
            SimpleDeserialize(serialized, SimpleTestClassNested)
               .then(deserialized => {
                  expect(deserialized['nestedTestClass']['field']).toBe('hello world')
                  expect(deserialized.getField()).toBe('hello world')
                  done()
               })
         })
   })

   it('deserialize number from ArrayBuffer', done => {
      const num = 12345678
      SimpleSerialize(num, {withFunctions: false, output: SerializedType.ARRAY_BUFFER})
         .then(serialized => {
            SimpleDeserialize(serialized, {})
               .then(deserialized => {
                  expect(deserialized).toEqual(num)
                  done()
               })
         })
   })

   it('deserialize simple string from ArrayBuffer', done => {
      const helloWorldString = 'hello world'
      SimpleSerialize(helloWorldString,
         {withFunctions: false, output: SerializedType.ARRAY_BUFFER})
         .then(serialized => {
            SimpleDeserialize(serialized, {})
               .then(deserialized => {
                  expect(deserialized).toEqual(helloWorldString)
                  done()
               })
         })
   })

})
