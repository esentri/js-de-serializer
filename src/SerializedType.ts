import {StringToArrayBuffer, ArrayBufferToString} from '@esentri/transformer-functions'

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
         (dataStructure: any) => {
            if (typeof dataStructure === 'string') return StringToArrayBuffer(dataStructure)
            return StringToArrayBuffer(JSON.stringify(dataStructure))
         }, (obj: ArrayBuffer) => {
            const stringObj = ArrayBufferToString(obj)
            try {
               return JSON.parse(stringObj)
            } catch (error) {
               return stringObj
            }
         })

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
