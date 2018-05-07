import {SimpleSerialize} from '../src/Serialize'
import TestClassWithGet from './testClasses/TestClassWithGet'
import TestClassWithSet from './testClasses/TestClassWithSet'
import TestClassWithGetSet from './testClasses/TestClassWithGetSet'

describe('serialize test get/set', () => {
   it('object with get', done => {
      SimpleSerialize(new TestClassWithGet('first')).then(serialized => {
         expect(serialized._a).toEqual('first')
         expect(serialized.a).toBeUndefined()
         done()
      })
   })

   it('object with set', done => {
      SimpleSerialize(new TestClassWithSet('first')).then(serialized => {
         expect(serialized._a).toEqual('first')
         expect(serialized.a).toBeUndefined()
         done()
      })
   })

   it('object with get/set', done => {
      SimpleSerialize(new TestClassWithGetSet('first')).then(serialized => {
         expect(serialized._a).toEqual('first')
         expect(serialized.a).toBeUndefined()
         done()
      })
   })

})
