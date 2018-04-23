import { SimpleSerialize } from '../src/Serialize'
import { Serializable } from '../src/Serializable'

class TestClass {
   private a: string
   private b: NestedClass

   constructor(a: string, b: NestedClass) {
      this.a = a;
      this.b = b;
   }
}

class NestedClass {
   private c: string

   constructor(c: string) {
      this.c = c
   }
}

class TestClassWithSerialize implements Serializable {
   private a: string

   constructor(a: string) {
      this.a = a
   }

   serialize(): any {
      return {a: 'custom serialize'}
   }

}

class TestClassWithNestedCustomSerialize {
   private a: string
   private nestedClass: TestClassWithSerialize

   constructor(a: string, b: TestClassWithSerialize) {
      this.a = a
      this.nestedClass = b
   }

}


describe('serialize test', () => {
   it('with simple object', () => {
      let serialized = SimpleSerialize(new TestClass('first', new NestedClass('nested')))
      expect(serialized.a).toEqual('first')
      expect(serialized.b.c).toEqual('nested')
   })

   it('with serialize function', () => {
      let serialized = SimpleSerialize(new TestClassWithSerialize('test'))
      expect(serialized.a).toEqual('custom serialize')
   })

   it('with nested serialize function', () => {
      let serialized = SimpleSerialize(new TestClassWithNestedCustomSerialize('first',
         new TestClassWithSerialize('will be overwritten')))
      expect(serialized.a).toEqual('first')
      expect(serialized.nestedClass.a).toEqual('custom serialize')
   })
})
