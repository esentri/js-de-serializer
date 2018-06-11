import {StringToArrayBuffer, ArrayBufferToString, StringToBase64, Base64ToString} from '@esentri/transformer-functions'
import {isTypedArray} from './Serialize'

function isBase64 (str: string) {
   try {
      return btoa(atob(str)) === str
   } catch (err) {
      return false
   }
}

export class SerializedType<TYPE> {
   public static readonly DATA_STRUCTURE: SerializedType<object> =
      new SerializedType('standard',
         (dataStructure: any) => dataStructure,
         (obj: object) => obj)

   public static readonly STRING: SerializedType<string> =
      new SerializedType(
         'string',
         (dataStructure: any) => {
            if (typeof dataStructure === 'string') return dataStructure
            return JSON.stringify(dataStructure)
         },
         (obj: string) => {
            try {
               return JSON.parse(obj)
            } catch (e) {
               return obj
            }
         })

   public static readonly ARRAY_BUFFER: SerializedType<ArrayBuffer> =
      new SerializedType('array_buffer',
         (dataStructure: any) => {
            if (typeof dataStructure === 'string') return StringToArrayBuffer(dataStructure)
            if (isTypedArray(dataStructure)) return dataStructure.buffer
            return StringToArrayBuffer(JSON.stringify(dataStructure))
         }, (obj: ArrayBuffer) => {
            const stringObj = ArrayBufferToString(obj)
            try {
               return JSON.parse(stringObj)
            } catch (error) {
               return stringObj
            }
         })

   public static readonly BASE64: SerializedType<string> =
      new SerializedType(
         'base64',
         (dataStructure: any) => StringToBase64(SerializedType.STRING.finalSerialize(dataStructure)),
         (obj: string) => SerializedType.STRING.toDataStructure(Base64ToString(obj)))

   public static toDataStructure (obj: any) {
      if (obj instanceof ArrayBuffer) {
         return this.ARRAY_BUFFER.toDataStructure(obj)
      }
      if (typeof obj === 'string') {
         if (isBase64(obj)) return this.BASE64.toDataStructure(obj)
         return this.STRING.toDataStructure(obj)
      }
      return this.DATA_STRUCTURE.toDataStructure(obj)
   }

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
