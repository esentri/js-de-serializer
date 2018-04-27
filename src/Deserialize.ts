import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'

export interface Deserialize<T> {
   (dataStructure: any, Class: T, serializedType?: string): T
}

export const SimpleDeserialize: Deserialize<any> =
   (dataStructure: any,
    Class: any,
    serializedType: string = SerializedType.DATA_STRUCTURE): any => {
      if(serializedType === SerializedType.STRING) dataStructure = JSON.parse(dataStructure)
      if (Class['deserialize']) return Class.deserialize(dataStructure)
      let deserialized = new Class()
      Object.keys(dataStructure).forEach(property => {
         if (isPrimitive(deserialized[property])) {
            deserialized[property] = dataStructure[property]
            return
         }
         deserialized[property] = SimpleDeserialize(
            dataStructure[property],
            deserialized[property].constructor
         )
      })
      return deserialized
   }
