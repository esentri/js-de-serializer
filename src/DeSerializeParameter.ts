import {SerializedType} from './de-serializer'

export class DeSerializeParameter {

   public serializedType: SerializedType<any>
   public withFunctions: boolean

   constructor (serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE,
                withFunctions: boolean = true) {
      this.serializedType = serializedType
      this.withFunctions = withFunctions
   }

   public clone (): DeSerializeParameter {
      const parameters = new DeSerializeParameter()
      Object.assign(parameters, this)
      return parameters
   }

}

export class DeSerializeParameterBuilder {
   private _serializedType: SerializedType<any> = SerializedType.DATA_STRUCTURE
   private _withFunctions: boolean = true

   public serializedType (value: SerializedType<any>): DeSerializeParameterBuilder {
      this._serializedType = value
      return this
   }

   public withFunctions (value: boolean): DeSerializeParameterBuilder {
      this._withFunctions = value
      return this
   }

   public build (): DeSerializeParameter {
      return new DeSerializeParameter(this._serializedType, this._withFunctions)
   }
}
