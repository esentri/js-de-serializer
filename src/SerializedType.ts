import {arrayBufferToString, stringToArrayBuffer} from './transformer/ArrayBufferString'

export class SerializedType<TYPE> {
   public static readonly DATA_STRUCTURE: SerializedType<object> =
      new SerializedType('standard',
         (dataStructure: any) => dataStructure,
         (obj: object) => obj)
   public static readonly STRING: SerializedType<string> =
      new SerializedType(
         'string',
         (dataStructure: any) => JSON.stringify(dataStructure),
         (obj: string) => JSON.parse(obj))
   public static readonly ARRAY_BUFFER: SerializedType<ArrayBuffer> =
      new SerializedType('array_buffer',
      (dataStructure: any) => stringToArrayBuffer(JSON.stringify(dataStructure)),
         (obj: ArrayBuffer) => JSON.parse(arrayBufferToString(obj)))

   public readonly finalSerialize: (dataStructure: object) => TYPE
   public readonly toDataStructure: (obj: TYPE) => any
   private readonly identifier: string

   constructor (identifier: string,
                finalSerialize: (dataStructure: object) => TYPE,
                toDataStructure: (obj: TYPE) => any) {
      this.identifier = identifier
      this.finalSerialize = finalSerialize
      this.toDataStructure = toDataStructure
   }

}
