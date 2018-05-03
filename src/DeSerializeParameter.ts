export default class DeSerializeParameter {

   public static readonly WITH_FUNCTIONS = new DeSerializeParameter('with_functions')
   public static readonly WITHOUT_FUNCTIONS = new DeSerializeParameter('without_functions')

   private readonly value: string

   constructor (value: string) {
      this.value = value
   }

   public static listContains (parameters: Array<DeSerializeParameter>,
                               parameter: DeSerializeParameter) {
      for (let index = 0; index < parameters.length; index++) {
         if (parameters[index].value === parameter.value) return true
      }
      return false
   }
}
