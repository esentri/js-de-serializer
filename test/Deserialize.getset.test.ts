import { SimpleDeserialize } from '../src/Deserialize'
import { SimpleSerialize } from '../src/Serialize'
import TestClassWithGet from './testClasses/TestClassWithGet'
import TestClassWithSet from './testClasses/TestClassWithSet'
import TestClassWithGetSet from './testClasses/TestClassWithGetSet'

describe('deserialize test with get/set', () => {
   it('with get', () => {
      let serialized = SimpleSerialize(new TestClassWithGet('test'))
      let deserialized = SimpleDeserialize(serialized, TestClassWithGet) as TestClassWithGet
      expect(deserialized['_a']).toEqual('test')
      expect(deserialized.a).toEqual('test')
   })

   it('with set', () => {
      let serialized = SimpleSerialize(new TestClassWithSet('test'))
      let deserialized = SimpleDeserialize(serialized, TestClassWithSet) as TestClassWithSet
      expect(deserialized['_a']).toEqual('test')
      deserialized.a = 'new value'
      expect(deserialized['_a']).toEqual('new value')
   })

   it('with get/set', () => {
      let serialized = SimpleSerialize(new TestClassWithGetSet('test'))
      let deserialized = SimpleDeserialize(serialized, TestClassWithGetSet) as TestClassWithGetSet
      expect(deserialized['_a']).toEqual('test')
      expect(deserialized.a).toEqual('test')
      deserialized.a = 'new value'
      expect(deserialized['_a']).toEqual('new value')
      expect(deserialized.a).toEqual('new value')
   })
})
