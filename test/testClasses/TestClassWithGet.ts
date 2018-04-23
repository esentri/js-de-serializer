export default class TestClassWithGet {
   private _a: string

   constructor(a: string) {
      this._a = a
   }

   get a(): string {
      return this._a
   }
}
