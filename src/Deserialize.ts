import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'
import {FunctionFromString} from './transformer/MethodFunctionString'
import {Base64WithBinaryDataToArrayBuffer} from '@esentri/transformer-functions'

export interface Deserialize<T> {
   (dataStructure: any, Class?: T): Promise<T>
}

export const SimpleDeserialize: Deserialize<any> =
   (serialized: any,
    Class: any): Promise<any> => {
      const dataStructure = SerializedType.toDataStructure(serialized)
      if (Class && Class['deserialize']) return Class.deserialize(dataStructure)
      return new Promise((resolve, reject) => {
         if (isPrimitive(dataStructure)) {
            resolve(dataStructure)
            return
         }
         if (Object.keys(dataStructure).includes('__arrayBuffer__')) {
            resolve(Base64WithBinaryDataToArrayBuffer(dataStructure['__arrayBuffer__']))
            return
         }
         let deserialized = new Class()
         let propertyPromises: Array<Promise<any>> = []
         Object.keys(dataStructure).forEach(property => {
            if (property === '__functions__') {
               dataStructure[property].forEach((serializedMethod: any) => {
                  if (deserialized['__proto__'][serializedMethod.name]) return
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
            let promise = SimpleDeserialize(dataStructure[property], constructor)
               .then(deserializedProperty => {
                  deserialized[property] = deserializedProperty
               })
            propertyPromises.push(promise)
         })
         Promise.all(propertyPromises).then(_ => {
            resolve(deserialized)
         })
      })
   }
