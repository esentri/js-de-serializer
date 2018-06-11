import {isPrimitive} from 'util'
import {DeSerializeParameter} from './DeSerializeParameter'
import {MethodStringToFunctionString} from './transformer/MethodFunctionString'
import {SerializedType} from "./SerializedType";

export interface Serialize {
   (element: any,
    parameters?: object): Promise<any>
}

function addSerializedMethods(element: any, serialized: any) {
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

export function isTypedArray(element: any): boolean {
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
    parameters: object = new DeSerializeParameter()): Promise<any> => {
      return new Promise((resolve, reject) => {
         let deSerializeParameters = DeSerializeParameter.fromDataStructure(parameters)
         if (element['serialize']) {
            element.serialize()
               .then((serialized: any) => resolve(deSerializeParameters.output.finalSerialize(serialized)))
            return
         }
         if (isPrimitive(element) || isTypedArray(element)) {
            resolve(deSerializeParameters.output.finalSerialize(element))
            return
         }
         let propertyPromises: Array<Promise<any>> = []
         let serialized: any = {}
         Object.keys(element).forEach(property => {
            let propertyParameters = new DeSerializeParameter()
            Object.assign(propertyParameters, deSerializeParameters)
            propertyParameters.output = SerializedType.DATA_STRUCTURE
            let promise = SimpleSerialize(element[property], propertyParameters).then(serializedProperty => {
               serialized[property] = serializedProperty
            })
            propertyPromises.push(promise)
         })
         Promise.all(propertyPromises).then(_ => {
            if (deSerializeParameters.withFunctions) {
               addSerializedMethods(element, serialized)
            }
            resolve(deSerializeParameters.output.finalSerialize(serialized))
         })
      })
   }
