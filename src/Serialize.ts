import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'
import {DeSerializeParameter} from './DeSerializeParameter'
import {MethodStringToFunctionString} from './transformer/MethodFunctionString'

export interface Serialize {
   (element: any,
    parameters?: Array<DeSerializeParameter>,
    serializedType?: SerializedType<any>): Promise<any>
}

function addSerializedMethods (element: any, serialized: any) {
   const methodNames: Array<string> = []
   Object.getOwnPropertyNames(Object.getPrototypeOf(element)).forEach(property => {
      if (typeof element[property] === 'function' && property !== 'constructor') {
         methodNames.push(property)
      }
   })
   if (methodNames.length === 0) return
   serialized['__functions__'] = []
   methodNames.forEach(methodName => {
      serialized['__functions__'].push({
         name: methodName,
         lambda: MethodStringToFunctionString(element[methodName].toString())
      })
   })
}

export function isTypedArray (element: any): boolean {
   switch (element.constructor) {
      case Int8Array:
      case Uint8Array:
      case Uint8ClampedArray:
      case Int16Array:
      case Uint16Array:
      case Int32Array:
      case Uint32Array:
      case Float32Array:
      case Float64Array:
         return true
   }
   return false
}

export const SimpleSerialize: Serialize =
   (element: any,
    parameters: Array<DeSerializeParameter> = [DeSerializeParameter.WITH_FUNCTIONS],
    serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE): Promise<any> => {
      return new Promise((resolve, reject) => {
         if (element['serialize']) {
            element.serialize()
               .then((serialized: any) => resolve(serializedType.finalSerialize(serialized)))
            return
         }
         if (isPrimitive(element) || isTypedArray(element)) {
            resolve(serializedType.finalSerialize(element))
            return
         }
         let propertyPromises: Array<Promise<any>> = []
         let serialized: any = {}
         Object.keys(element).forEach(property => {
            let promise = SimpleSerialize(element[property], parameters).then(serializedProperty => {
               serialized[property] = serializedProperty
            })
            propertyPromises.push(promise)
         })
         Promise.all(propertyPromises).then(_ => {
            if (DeSerializeParameter.listContains(parameters, DeSerializeParameter.WITH_FUNCTIONS)) {
               addSerializedMethods(element, serialized)
            }
            resolve(serializedType.finalSerialize(serialized))
         })
      })
   }
