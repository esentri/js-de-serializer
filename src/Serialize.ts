import {isPrimitive} from 'util'
import {DeSerializeParameter} from './DeSerializeParameter'
import {MethodStringToFunctionString} from './transformer/MethodFunctionString'
import {SerializedType} from './SerializedType'
import {ArrayBufferToString} from "@esentri/transformer-functions";

export interface Serialize {
   (element: any,
    parameters?: DeSerializeParameter): Promise<any>
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
    parameters: DeSerializeParameter = new DeSerializeParameter()): Promise<any> => {
      return new Promise((resolve, reject) => {
         if (element['serialize']) {
            element.serialize()
               .then((serialized: any) => resolve(parameters.serializedType.finalSerialize(serialized)))
            return
         }
         if (isPrimitive(element) || isTypedArray(element)) {
            resolve(parameters.serializedType.finalSerialize(element))
            return
         }
         if (element instanceof ArrayBuffer) {
            resolve(parameters.serializedType.finalSerialize({__arrayBuffer__: ArrayBufferToString(element)}))
            return
         }
         let propertyPromises: Array<Promise<any>> = []
         let serialized: any = {}
         Object.keys(element).forEach(property => {
            const propertyParameters = parameters.clone()
            propertyParameters.serializedType = SerializedType.DATA_STRUCTURE
            let promise = SimpleSerialize(element[property], propertyParameters).then(serializedProperty => {
               serialized[property] = serializedProperty
            })
            propertyPromises.push(promise)
         })
         Promise.all(propertyPromises).then(_ => {
            if (parameters.withFunctions) {
               addSerializedMethods(element, serialized)
            }
            resolve(parameters.serializedType.finalSerialize(serialized))
         })
      })
   }
