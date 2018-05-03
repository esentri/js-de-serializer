import {isPrimitive} from 'util'
import {SerializedType} from './SerializedType'
import DeSerializeParameter from './DeSerializeParameter'
import {MethodStringToLambdaString} from './transformer/MethodLambdaString'
import {MethodStringToFunctionString, MethodToFunctionString} from './transformer/MethodFunctionString'

export interface Serialize {
   (element: any,
    parameters?: Array<DeSerializeParameter>,
    serializedType?: SerializedType<any>): any
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

export const SimpleSerialize: Serialize =
   (element: any,
    parameters: Array<DeSerializeParameter> = [DeSerializeParameter.WITH_FUNCTIONS],
    serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE): any => {
      if (element['serialize']) return serializedType.finalSerialize(element.serialize())
      if (isPrimitive(element)) return serializedType.finalSerialize(element)
      let serialized: any = {}
      Object.keys(element).forEach(property => {
         serialized[property] = SimpleSerialize(element[property], parameters)
      })
      if (DeSerializeParameter.listContains(parameters, DeSerializeParameter.WITH_FUNCTIONS)) {
         addSerializedMethods(element, serialized)
      }
      return serializedType.finalSerialize(serialized)
   }
