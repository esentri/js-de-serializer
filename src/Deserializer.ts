import {SimpleDeserialize} from './Deserialize'

export default abstract class Deserializer<TYPE> {
   public static simple<T>(prototype: any): Deserializer<T> {
      return new SimpleDeserializer(prototype)
   }

   public abstract do(dataStructure: any): TYPE
}

export class SimpleDeserializer implements Deserializer<any> {

   private readonly prototype: any

   constructor(prototype: any) {
      this.prototype = prototype
   }

   do(dataStructure: any): any {
      return SimpleDeserialize(dataStructure, this.prototype)
   }
}
