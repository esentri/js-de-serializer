import {SimpleDeserialize} from '../src/Deserialize'
import {SimpleSerialize} from '../src/Serialize'
import {SimpleNestedTestClass, SimpleTestClassNested} from './testClasses/SimpleTestClassNested'
import {
   ParametersArrayBufferWithFunction,
   ParametersArrayBufferWithoutFunction, ParametersBase64WithoutFunctions,
   ParametersDataStructureWithoutFunction,
   ParametersStringWithoutFunction
} from './Parameters'
import {ArrayBufferEqual} from './helper/ArrayBufferFunctions'
import fs from 'fs'

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
         ParametersDataStructureWithoutFunction)
         .then(serialized => {
            SimpleDeserialize(serialized, TestClass).then(deserialized => {
               expect(deserialized.testFunction()).toEqual('test|nested')
               done()
            })
         })
   })

   it('with object with deserialize', done => {
      SimpleSerialize(new ObjectWithDeserialize('testValue'),
         ParametersDataStructureWithoutFunction)
         .then(serialized => {
            SimpleDeserialize(serialized, ObjectWithDeserialize).then(deserialized => {
               expect(deserialized.value).toEqual('overwritten')
               done()
            })
         })
   })

   it('deserialize simple object from string', done => {
      let testClass = new TestClass('hello', 'world')
      SimpleSerialize(testClass, ParametersStringWithoutFunction)
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
      SimpleSerialize(testObject, ParametersDataStructureWithoutFunction)
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
      SimpleSerialize(testClass, ParametersArrayBufferWithFunction)
         .then(serialized => {
            SimpleDeserialize(serialized, TestClass)
               .then(deserialized => {
                  expect(deserialized.testFunction()).toBe('hello|world')
                  done()
               })
         })
   })

   it('deserialize SimpleTestClassNested from ArrayBuffer', done => {
      let testClass = new SimpleTestClassNested(new SimpleNestedTestClass('hello world'))
      SimpleSerialize(testClass, ParametersArrayBufferWithFunction)
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
      SimpleSerialize(num, ParametersArrayBufferWithoutFunction)
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
      SimpleSerialize(helloWorldString, ParametersArrayBufferWithoutFunction)
         .then(serialized => {
            SimpleDeserialize(serialized, {})
               .then(deserialized => {
                  expect(deserialized).toEqual(helloWorldString)
                  done()
               })
         })
   })

   it('deserialize simple string from string', done => {
      const helloWorldString = 'hello world'
      SimpleSerialize(helloWorldString, ParametersStringWithoutFunction)
         .then(serialized => {
            SimpleDeserialize(serialized, {})
               .then(deserialized => {
                  expect(deserialized).toEqual(helloWorldString)
                  done()
               })
         })
   })

   it('string to base64 to string', done => {
      const helloWorld = 'hello world'
      SimpleSerialize(helloWorld, ParametersBase64WithoutFunctions).then(serialized => {
         SimpleDeserialize(serialized).then(deserialized => {
            expect(deserialized).toEqual(helloWorld)
            done()
         })
      })
   })

   it('deserialize ArrayBuffer from ArrayBuffer', done => {
      let file = fs.readFileSync(__dirname + '/testData/text.txt')
      let arrayBuffer = new Uint8Array(file).buffer
      SimpleSerialize(arrayBuffer, ParametersArrayBufferWithoutFunction).then(serialized => {
         SimpleDeserialize(serialized, ArrayBuffer).then(deserialized => {
            expect(ArrayBufferEqual(arrayBuffer, deserialized)).toBeTruthy()
            done()
         })
      })
   })
})
