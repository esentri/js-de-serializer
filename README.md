# De-Serializer

[![Build Status](https://travis-ci.org/esentri/js-de-serializer.svg?branch=master)](https://travis-ci.org/esentri/js-de-serializer)
[![Coverage Status](https://coveralls.io/repos/github/esentri/js-de-serializer/badge.svg?branch=master)](https://coveralls.io/github/esentri/js-de-serializer?branch=master)
[![npm version](https://badge.fury.io/js/%40esentri%2Fde-serializer.svg)](https://badge.fury.io/js/%40esentri%2Fde-serializer)

_De-Serializer_ will support you in various serializing and deserializing tasks in JavaScript.

Currently, the following features are implemented:
* serialize **JS object to data structure**
* deserialize **data structure to JS object**
* serialize **JS object to string**
* deserialize **string to JS object**
* serialize **JS object to ArrayBuffer**
* deserialize **ArrayBuffer to JS object**

The basic idea is that you can truly deserialize data to a fully working object. If you use
`JSON.stringify` / `JSON.parse` for example you only get a data structure (i.e. an object with
fields only - no functions / etc.). Or you have to provide for every object a custom _receiver_
function inside `JSON.parse`.

_De-Serializer_ provides common functionality for de/serializing basic objects. Furthermore,
see section _Custom de/serialization_ if you need to adapt the logic for specific objects.
      

## Install

```
npm install @esentri/de-serializer
```

## Usage

### JS object to data structure

**Functional:** 
```
import {SimpleSerialize} from '@esentri/de-serializer'

let myObject = new MyObject()
let dataStructure = SimpleSerialize(myObject)
```
* _myObject_ is the object you want to serialize


### JS object to string

**Functional:** 
```
import {SimpleSerialize, SerializedType} from '@esentri/de-serializer'

let myObject = new MyObject()
let string = SimpleSerialize(myObject, SerializedType.STRING)
```
* _myObject_ is the object you want to serialize


### Data structure to JS object

**Functional:** 
```
import {SimpleDeserialize} from '@esentri/de-serializer'

let myDataStructure = { field1: 'test' }
let obj = SimpleDeserialize(myDataStructure, MyObject)
```
* _myDataStructure_ is the data structure for deserializing
* _MyObject_ is the class you want to create

**Object oriented:**
```
import {Deserializer} from '@esentri/de-serializer'

let myDeserializer = Deserializer.simple(MyObject)
let myObject = myDeserializer.deserialize(myDataStructure)
```
* _myDataStructure_ is the data structure for deserializing
* _MyObject_ is the class you want to create


### String to JS object

**Functional:** 
```
import {SimpleDeserialize, SerializedType} from '@esentri/de-serializer'

let myString = "{ field1: 'test' }"
let obj = SimpleDeserialize(myString, MyObject, SerializedType.STRING)
```
* _myString_ is the string for deserializing
* _MyObject_ is the class you want to create

**Object oriented:**
```
import {Deserializer, SerializedType} from '@esentri/de-serializer'

let myDeserializer = Deserializer.simple(MyObject, SerializedType.STRING)
let myObject = myDeserializer.deserialize(myString)
```
* _myString_ is the data structure for deserializing
* _MyObject_ is the class you want to create

### Custom de/serializing

#### Custom serialization

* add the method _serialize()_ to your class
  * in _TypeScript_ you _can_ (but don't need to) implement the interface _Serializable_
* this method needs to return a data structure

Keep in mind that you need to do the serializations for the fields as well (or use the built-in
_SimpleSerialize_).

**E.g.:**
```
class MyClass {
   
   constructor(fieldA) {
      this.fieldA = fieldA
   }
   
   serialize() {
      return { fieldA: 'overwritten during serialization' }
   }
}

let myObject = new MyClass('Hello world')
let myDataStrucutre = SimpleSerialize(myObject)
```
* the data structure will look like this `{ fieldA: 'overwritten during serialization' }`

#### Custom deserialization

* add a static method _deserialize(dataStructure)_ to your class
* implement all the logic inside and return a new object

**E.g.:**
```
class MyClass {
   
   constructor(fieldA) {
      this.fieldA = fieldA
   }
   
   static deserialize(dataStructure) {
      return new MyClass(dataStructure.fieldA + ' some stuff')
   }
}

let myDataStructure = { fieldA: 'hello' }
let myObject = SimpleDeserialize(myDataStructure, MyClass)
```
* _myObject_ will look like this: `{ fieldA: 'hello some stuff' }`


## Algorithm

### SimpleSerialize
1. check if object has a _serialize()_ method
   1. **true:** call _serialize()_ on object and return the result
   1. **false:** continue to next step
1. check if object is a primitive
   1. **true:** return primitive
   1. **false:** continue to next step
1. create an empty data structure
1. iterate over all properties that are not functions
1. for each property create a property in the new data structure and assign the value
you get by repeating this algorithm for the property

### SimpleDeserialize
1. check if the Class has a static _deserialize(dataStructure)_ method
   1. **true:** call _deserialize_ and return the result
   1. **false:** continue to next step
1. instantiate a new object of the wanted class
1. iterate over each property in _dataStructure_
1. for each property
   1. check if property is primitive
      1. **true:** assign primitive as the property to new created object
      2. **false:** call this algorithm on the property and assign the value to the new created object
1. return new created object

# Projects used

* [Typescript Library Starter](https://github.com/alexjoverm/typescript-library-starter)
  * License: MIT
  * as a template for the setup

<details>
   <summary>Typescript Library Starter dependencies</summary>

  * [JEST](https://facebook.github.io/jest/)
    * License: MIT
  * [Colors](https://github.com/Marak/colors.js)
    * License: MIT
  * [Commitizen](https://github.com/commitizen/cz-cli)
    * License: MIT
  * [Definitley Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)
    * License: MIT
  * [Coveralls](https://github.com/nickmerwin/node-coveralls)
    * License: BSD-2-Clause
  * [Cross-env](https://github.com/kentcdodds/cross-env)
    * License: MIT
  * [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)
    * License: MIT
  * [Husky](https://github.com/typicode/husky)
    * License: MIT
  * [lint-staged](https://github.com/okonet/lint-staged)
    * License: MIT
  * [lodash.camelcase](https://github.com/lodash/lodash)
    * License: MIT
  * [Prompt](https://github.com/flatiron/prompt)
    * License: MIT
  * [replace-in-file](https://github.com/adamreisnz/replace-in-file)
    * License: MIT
  * [rimraf](https://github.com/isaacs/rimraf)
    * License: ISC
  * [rollup](https://github.com/rollup/rollup)
    * License: MIT
  * [semantic-release](https://github.com/semantic-release/semantic-release)
    * License: MIT
  * [tslint](https://github.com/palantir/tslint)
    * License: Apache-2.0
  * [typedoc](http://typedoc.org/)
    * License: Apache-2.0
  * [typescript](http://typescriptlang.org/)
    * License: Apache-2.0 
  * [validate-commit-msg](https://github.com/conventional-changelog/validate-commit-msg)
    * License: MIT
</details>


# License

MIT License

Copyright (c) 2018 esentri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
