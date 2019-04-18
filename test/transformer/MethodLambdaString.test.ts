import {
   MethodStringToLambdaString,
   RemoveNameFromMethodString,
   SplitMethodParametersAndBody
} from '../../src/transformer/MethodLambdaString'

describe('method string / lambda string transformation', () => {

   /* tslint:disable */
   const simpleClass = {
      simpleMethod: function helloWorld () { return "hello world" },
      methodWithLineBreak: function lineBreak () {
         return "hello world"
      }
   }

   const simpleMethodString = simpleClass.simpleMethod.toString()
   const lineBreakMethodString = simpleClass.methodWithLineBreak.toString()
   const expectedSimpleMethodWithoutName = '() { return "hello world"; }'
   const expectedLineBreakMethodWithoutName = '() {\n' +
         '            return \"hello world\";\n        }'

   it('remove name from simple method string', () => {
      expect(RemoveNameFromMethodString(simpleMethodString))
         .toEqual(expectedSimpleMethodWithoutName)
   })

   it('split simple method parameters and body', () => {
      const parts = SplitMethodParametersAndBody(expectedSimpleMethodWithoutName)
      expect(parts[0]).toEqual('()')
      expect(parts[1]).toEqual('{ return "hello world"; }')
   })

   it('remove name from method with line break', () => {
      expect(RemoveNameFromMethodString(lineBreakMethodString))
         .toEqual(expectedLineBreakMethodWithoutName)
   })

   it('split line break method parameters and body', () => {
      const parts = SplitMethodParametersAndBody(expectedLineBreakMethodWithoutName)
      expect(parts[0]).toEqual('()')
      expect(parts[1]).toEqual('{\n            return \"hello world\";\n        }')
   })

   it('method string to lambda string', () => {
      const lambdaString = MethodStringToLambdaString(simpleMethodString)
      expect(lambdaString).toEqual('() => { return "hello world"; }')
   })

   it('line break method string to lambda string', ()=> {
      const lambdaString = MethodStringToLambdaString(lineBreakMethodString)
      expect(lambdaString).toEqual('() => {\n            return \"hello world\";\n' +
         '        }')
   })
})
