export class SimpleNestedTestClass {
   private field: string

   constructor (field: string) {
      this.field = field
   }

   public getField (): string {
      return this.field
   }
}

export class SimpleTestClassNested {
   private nestedTestClass: SimpleNestedTestClass

   constructor (nestedTestClass: SimpleNestedTestClass) {
      this.nestedTestClass = nestedTestClass
   }

   public getField (): string {
      return this.nestedTestClass.getField()
   }
}
