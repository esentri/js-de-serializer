import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'
import {FunctionFromString} from './transformer/MethodFunctionString'

export interface Deserialize<T> {
   (dataStructure: any, Class?: T): Promise<T>
}

export const SimpleDeserialize: Deserialize<any> =
   (dataStructure: any,
    Class: any): Promise<any> => {
      dataStructure = SerializedType.toDataStructure(dataStructure)
      if (Class && Class['deserialize']) return Class.deserialize(dataStructure)
      return new Promise((resolve, reject) => {
         if (isPrimitive(dataStructure)) {
            resolve(dataStructure)
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
