export function MethodStringToLambdaString (methodString: string): string {
   const lambdaParts = SplitMethodParametersAndBody(RemoveNameFromMethodString(methodString))
   return lambdaParts[0] + ' => ' + lambdaParts[1]
}

export function RemoveNameFromMethodString (methodString: string): string {
   return methodString.slice(methodString.indexOf('('))
}

export function SplitMethodParametersAndBody (methodString: string): string[] {
   let parts = methodString.split(/\)\s*\{/)
   parts[0] += ')'
   parts[1] = '{' + parts[1]
   return parts
}
