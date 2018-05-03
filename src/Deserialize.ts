import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'
import {FunctionFromString} from './transformer/MethodFunctionString'

export interface Deserialize<T> {
   (dataStructure: any, Class: T, serializedType?: SerializedType<any>): T
}

export const SimpleDeserialize: Deserialize<any> =
   (dataStructure: any,
    Class: any,
    serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE): any => {
      dataStructure = serializedType.toDataStructure(dataStructure)
      if (Class['deserialize']) return Class.deserialize(dataStructure)
      let deserialized = new Class()
      Object.keys(dataStructure).forEach(property => {
         if (property === '__functions__') {
            dataStructure[property].forEach((serializedMethod: any) => {
               console.log('lll: ', serializedMethod.lambda)
               deserialized['__proto__'][serializedMethod.name] = FunctionFromString(serializedMethod.lambda)
            })
            return
         }
         if (isPrimitive(deserialized[property])
            && isPrimitive(dataStructure[property])) {
            deserialized[property] = dataStructure[property]
            return
         }
         let constructor = deserialized[property] ? deserialized[property].constructor :
            dataStructure[property].constructor
         deserialized[property] = SimpleDeserialize(
            dataStructure[property],
            constructor
         )
      })
      return deserialized
   }
