export default class TestClassWithSet {
   private _a: string

   constructor(a: string) {
      this._a = a
   }

   set a(value: string) {
      this._a = value
   }
}

class TestClassWithGetSet {
   private _a: string

   constructor(a: string) {
      this._a = a
   }

   set a(value: string) {
      this._a = value
   }

   get a(): string {
      return this._a
   }
}
