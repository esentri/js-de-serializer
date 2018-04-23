import { SimpleDeserialize } from '../src/Deserialize'
import { SimpleSerialize } from '../src/Serialize'

class NestedTestClass {
   private test: string = 'defaultNested'

   constructor(test: string) {
      this.test = test
   }

   public testFunction(): string {
      return this.test
   }
}

class TestClass {
   private test: string = 'default'
   private nestedTestClass: NestedTestClass

   constructor(test: string, testNested: string) {
      this.test = test
      this.nestedTestClass = new NestedTestClass(testNested)
   }

   public testFunction(): string {
      return this.test + '|' + this.nestedTestClass.testFunction()
   }
}

class ObjectWithDeserialize {
   public value: string

   constructor(value: string) {
      this.value = value
   }

   static deserialize(dataStructure: any) {
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
})
