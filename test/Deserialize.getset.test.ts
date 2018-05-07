import {SimpleDeserialize} from '../src/Deserialize'
import {SimpleSerialize} from '../src/Serialize'
import TestClassWithGet from './testClasses/TestClassWithGet'
import TestClassWithSet from './testClasses/TestClassWithSet'
import TestClassWithGetSet from './testClasses/TestClassWithGetSet'

describe('deserialize test with get/set', () => {
   it('with get', done => {
      SimpleSerialize(new TestClassWithGet('test')).then(serialized => {
         SimpleDeserialize(serialized, TestClassWithGet).then(deserialized => {
            expect(deserialized['_a']).toEqual('test')
            expect(deserialized.a).toEqual('test')
            done()
         })
      })
   })

   it('with set', done => {
      SimpleSerialize(new TestClassWithSet('test')).then(serialized => {
         SimpleDeserialize(serialized, TestClassWithSet).then(deserialized => {
            expect(deserialized['_a']).toEqual('test')
            deserialized.a = 'new value'
            expect(deserialized['_a']).toEqual('new value')
            done()
         })
      })
   })

   it('with get/set', done => {
      SimpleSerialize(new TestClassWithGetSet('test')).then(serialized => {
         SimpleDeserialize(serialized, TestClassWithGetSet).then(deserialized => {
            expect(deserialized['_a']).toEqual('test')
            expect(deserialized.a).toEqual('test')
            deserialized.a = 'new value'
            expect(deserialized['_a']).toEqual('new value')
            expect(deserialized.a).toEqual('new value')
            done()
         })
      })
   })
})
