import {DeSerializeParameter, DeSerializeParameterBuilder, SerializedType} from '../src/de-serializer'

export const ParametersDataStructureWithoutFunction: DeSerializeParameter = new DeSerializeParameterBuilder()
   .serializedType(SerializedType.DATA_STRUCTURE)
   .withFunctions(false)
   .build()

export const ParametersStringWithoutFunction: DeSerializeParameter = new DeSerializeParameterBuilder()
   .serializedType(SerializedType.STRING)
   .withFunctions(false)
   .build()

export const ParametersArrayBufferWithoutFunction: DeSerializeParameter = new DeSerializeParameterBuilder()
   .serializedType(SerializedType.ARRAY_BUFFER)
   .withFunctions(false)
   .build()

export const ParametersArrayBufferWithFunction: DeSerializeParameter = new DeSerializeParameterBuilder()
   .serializedType(SerializedType.ARRAY_BUFFER)
   .withFunctions(true)
   .build()

export const ParametersBase64WithoutFunctions: DeSerializeParameter = new DeSerializeParameterBuilder()
   .serializedType(SerializedType.BASE64)
   .withFunctions(false)
   .build()
