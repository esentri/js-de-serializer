import {SimpleSerialize} from '../src/Serialize'
import TestClassWithGet from './testClasses/TestClassWithGet'
import TestClassWithSet from './testClasses/TestClassWithSet'
import TestClassWithGetSet from './testClasses/TestClassWithGetSet'


describe('serialize test get/set', () => {
   it('with get', () => {
      let serialized = SimpleSerialize(new TestClassWithGet('first'))
      expect(serialized._a).toEqual('first')
      expect(serialized.a).toBeUndefined()
   })

   it('with set', () => {
      let serialized = SimpleSerialize(new TestClassWithSet('first'))
      expect(serialized._a).toEqual('first')
      expect(serialized.a).toBeUndefined()
   })

   it('with get/set', () => {
      let serialized = SimpleSerialize(new TestClassWithGetSet('first'))
      expect(serialized._a).toEqual('first')
      expect(serialized.a).toBeUndefined()
   })

})
