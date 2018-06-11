import {SerializedType} from './de-serializer'

export class DeSerializeParameter {

   private static OUTPUT = "output"
   private static WITH_FUNCTIONS = "withFunctions"

   public output: SerializedType<any>
   public withFunctions: boolean

   constructor(output: SerializedType<any> = SerializedType.DATA_STRUCTURE, withFunctions: boolean = true) {
      this.output = output
      this.withFunctions = withFunctions
   }

   static fromDataStructure(dataStructure: object): DeSerializeParameter {
      let deSerializeParameter = new DeSerializeParameter()
      if (dataStructure.hasOwnProperty(this.OUTPUT)) {
         deSerializeParameter.output = (<any> dataStructure)[this.OUTPUT]
      }
      if (dataStructure.hasOwnProperty(this.WITH_FUNCTIONS)) {
         deSerializeParameter.withFunctions = (<any> dataStructure)[this.WITH_FUNCTIONS]
      }
      return deSerializeParameter
   }

}
