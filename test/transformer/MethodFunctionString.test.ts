import {FunctionFromString, MethodStringToFunctionString} from '../../src/transformer/MethodFunctionString'

describe('method string / function string transformation', () => {

   const methodString = 'helloWorld() { return "hello world" }'
   const methodAsFunctionString = 'function() { return "hello world" };'

   it('transform method string to function string', () => {
      expect(MethodStringToFunctionString(methodString))
         .toEqual(methodAsFunctionString)
   })

   it('function from string', () => {
      const func = FunctionFromString(methodAsFunctionString)
      expect(func()).toEqual('hello world')
   })
})
