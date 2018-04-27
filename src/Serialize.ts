import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'

export interface Serialize {
   (element: any, serializedType?: string): any
}

export const SimpleSerialize: Serialize =
   (element: any, serializedType: string = SerializedType.DATA_STRUCTURE): any => {
      if (element['serialize']) return element.serialize()
      if (isPrimitive(element)) return element
      let serialized: any = {}
      Object.keys(element).forEach(property => {
         serialized[property] = SimpleSerialize(element[property])
      })
      if (serializedType === SerializedType.DATA_STRUCTURE) return serialized
      return JSON.stringify(serialized)
   }
