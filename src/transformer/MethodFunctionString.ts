import {RemoveNameFromMethodString} from './MethodLambdaString'

export function MethodStringToFunctionString (methodString: string): string {
   return 'function' + RemoveNameFromMethodString(methodString) + ';'
}

export function FunctionFromString (value: string) {
   const args = value
      .replace(/\/\/.*$|\/\*[\s\S]*?\*\//mg, '') // strip comments
      .match(/\(.*?\)/m)![0] // find argument list
      .replace(/^\(|\)$/, '') // remove parens
      .match(/[^\s(),]+/g) || []  // find arguments
   const body = value.match(/\{(\s|.)+\}/)![0]
   return Function(...args, body)
}
