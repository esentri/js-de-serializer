import {SimpleDeserialize} from './Deserialize'

export abstract class Deserializer<TYPE> {
   public static simple<T> (prototype: any): Deserializer<T> {
      return new SimpleDeserializer(prototype)
   }

   public abstract deserialize (dataStructure: any): Promise<TYPE>
}

export class SimpleDeserializer implements Deserializer<any> {

   private readonly prototype: any

   constructor (prototype: any) {
      this.prototype = prototype
   }

   deserialize (dataStructure: any): Promise<any> {
      return SimpleDeserialize(dataStructure, this.prototype)
   }
}
