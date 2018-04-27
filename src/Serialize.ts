import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'

export interface Serialize {
   (element: any, serializedType?: SerializedType<any>): any
}

export const SimpleSerialize: Serialize =
   (element: any, serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE): any => {
      if (element['serialize']) return element.serialize()
      if (isPrimitive(element)) return element
      let serialized: any = {}
      Object.keys(element).forEach(property => {
         serialized[property] = SimpleSerialize(element[property])
      })
      return serializedType.finalSerialize(serialized)
   }
