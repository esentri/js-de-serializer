import {SerializedType} from './SerializedType'
import {SimpleDeserialize} from './Deserialize'

export abstract class Deserializer<TYPE> {
   public static simple<T> (prototype: any,
                            serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE): Deserializer<T> {
      return new SimpleDeserializer(prototype, serializedType)
   }

   public abstract deserialize (dataStructure: any): TYPE
}

export class SimpleDeserializer implements Deserializer<any> {

   private readonly prototype: any
   private readonly serializedType: SerializedType<any>

   constructor (prototype: any, serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE) {
      this.prototype = prototype
      this.serializedType = serializedType
   }

   deserialize (dataStructure: any): any {
      return SimpleDeserialize(dataStructure, this.prototype, this.serializedType)
   }
}
