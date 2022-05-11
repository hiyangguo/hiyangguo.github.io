---
title: TypeScript 指南
date: 2022-05-09 16:50:53
tags:
  - TypeScript
---

### 什么是 TypeScript

> ### TypeScript is JavaScript with syntax for types.
>
> TypeScript is a strongly typed programming language which builds on JavaScript giving you better tooling at any scale.
>
> @typescriptlang 官网

~~TypeScript 是 JavaScript 的超集~~

TypeScript 是具有类型语法的 JavaScript。

TypeScript 是一种建立在 JavaScript 之上的强类型编程语言，可为您提供任何规模的更好工具。

<!-- more -->

#### Typescript 提供什么类型能力？

- 在开发过程中，配合 IDE，TS 能实时检查类型的合法性，还能基于类型给出更精准的自动补全等特征提升码字效率。
- 在编译过程中，TS 仍然能做类型检查，再把 TS 代码编译成 JS 代码。

####　 TypeScript 与 JavaScript 的区别

| TypeScript                                            | JavaScript                               |
| ----------------------------------------------------- | ---------------------------------------- |
| 具有类型语法的 JavaScript，用于解决大型项目代码复杂性 | 一种脚本语言，用于创建动态网页           |
| 可以在编译期间发现并纠正错误                          | 作为一种解释性语言，只能在运行时发现错误 |
| 强类型，支持静态和动态类型                            | 弱类型，没有静态类型选项                 |
| 最终被编译成 JavaScript 代码，使浏览器可以理解        | 可以直接在浏览器中使用                   |
| 支持模块、接口和泛型                                  | 有限支持模块、不支持泛型和接口           |
| 支持 ES3、ES3、ES5 及 ES2015+、 ESNext                | 不支持编译 ES3、ES3、ES5 及 ESNext       |

### 基础类型

#### 原始类型

```typescript
// Boolean
const isDone: boolean = false;

// Number
const cout: number = 666;

// String
const name: string = 'Godfery';

// BigInt
const theBiggestInt: BigInt = 9007199254740991n;

// Symbole
const privateKey: Symbol = Symbol('_key');
```

> 当使用 `const`、`let`、`var`声明变量时，可以选择添加「类型注解」指定变量的类型。

#### 数组/元祖

```typescript
// Array
const Fruits: string[] = ['apple', 'banana'];
const UserNames: Array<string> = ['Tom', 'Jerry'];

// Tuple
const entry: [string, number] = ['Tom', 27];
```

#### Any

在 TypeScript 中，任何类型都可以被归为 `any ` 类型。当你不想写类型声明的时候可以使用它。

```typescript
let obj: any = { x: 0 };
// 下面的代码不会抛出编译错误
// 使用 `any` 禁用所有的类型检查功能，并且假设您比 TypeScript 更了解环境
obj.foo();
obj();
obj.bar = 100;
obj = 'hello';
const n: number = obj;
```

##### noImplicitAny

当你不指定类型，并且 TypeScript 不能从上下文推断出类型，编译器通常将默认为 `any`。你通常希望避免这种情况，因为`any` 不会类型检查。使用`noImplicitAny`可以配置隐式`any`类型抛出异常。

```typescript
function fn(s) {
  // 当 noImplicitAny 开启时会报错
  console.log(s.subtr(3));
}
fn(42);
```

> 当 [strict](https://www.typescriptlang.org/tsconfig#strict) 时，默认为 `true`，否则默认为 `false`

#### `null` 和 `undefined`

JavaScript 有两个原始值用于标明不存在或未初始化的值：`null`和`undefined`。TypeScript 也有两个对应同名类型：`null`和`undefined`。这些类型的行为如何取决于您是否具有 [strictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks) 选项。

##### `strictNullChecks` on （默认）

当一个值为`null`或`undefined` ，你需要在使用属性或方法前检查这些值。

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // 什么都不做
  } else {
    console.log('Hello, ' + x.toUpperCase());
  }
}
```

##### `strictNullChecks` off

值为`null`或`undefined`仍然可以正常的访问。且可以将 `null`和`undefined`赋值给任意类型。

##### 非空断言运算符（`！`后缀）

```typescript
function liveDangerously(x?: number | null) {
  // 没有错误
  console.log(x!.toFixed());
}
```

> 注意：就像其他类型断言一样，这并不会改变代码运时的行为。所以请只在你确定值不会是`null` 或`undefined`的时候使用`!`

#### 对象类型

```typescript
// 参数的类型注解对象类型
function printCoord(pt: { x: number; y: number; z }) {
  console.log('坐标的 X 值是' + pt.x);
  console.log('坐标的 Y 值是' + pt.y);
}

// 可选属性
function printName(obj: { first: string; last?: string }) {
  // 错误 当 `obj.last` 没有提供可能会崩溃
  console.log(obj.last.toUpperCase());

  // 处理 `obj.last` 为 undefined 的情况
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // 使用现代 JavaScript 语法的一种安全的替代写法
  console.log(obj.last?.toUpperCase());
}

// 全都是对的
printName({ first: 'Bob' });
printName({ first: 'Alice', last: 'Alisson' });
```

> 你可以用使用`;`或者`,`来分割属性，并且最后一个分隔符通常是可一省略的。

##### `readonly`属性

TypeScript 中可以标记属性为 `readonly`。

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // 我们可以读取 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // 但是为 'prop' 不能重新赋值 因为它是只读属性
  obj.prop = 'hello';
  // Error: Cannot assign to 'prop' because it is a read-only property.
}
```

##### 索引签名

有些时候你一开始并不知道所有类型属性的`names`，但是你知道 `values` 的类型。这时你可以使用索引签名来描述可能的值的类型。例如：

```typescript
interface StringArray {
  [index: number]: string;
}
const myArray: StringArray = ['hello', 'world'];
const secondItem = myArray[1];
```

#### 函数

| TypeScript     | JavaScript          |
| -------------- | ------------------- |
| 有函数类型     | 无函数类型          |
| 含有类型检查   | 无类型              |
| 箭头函数       | 箭头函数（ES2015+） |
| 必填和可选参数 | 所有参数都是可选的  |
| 默认参数       | 默认参数            |
| 剩余参数       | 剩余参数            |
| 有函数重载     | 无函数重载          |

> 在 JavaScript 中，函数是**头等(**first-class**)**对象，因为它们可以像任何其他**对象**一样具有属性和方法。它们与其他对象的区别在于函数可以被调用。简而言之，它们是`Function`对象。
>
> [MDN 关于函数的定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions)

##### 参数类型注解和返回类型注解

```typescript
// 参数类型注解
function greet(name: string) {
  console.log('Hello, ' + name.toUpperCase() + '!!');
}

// 返回类型注解
function getFavoriteNumber(): number {
  return 26;
}
```

##### 示例

```typescript
type Sum1 = (a: number, b: number) => number;

interface Sum2 {
  (a: number, b: number): number;
}

type Sum3 = {
  (a: number, b: number): number;
};

function sum(a: number, b: number): number {
  return a + b;
}

const sum2: Sum2 = (a, b) => a + b;
const sum3: (a: number, b: number) => number;
```

##### 可选参数及默认参数

在声明函数时，可以通过 `?` 号来定义可选参数，比如 `age?: number` 这种形式。在实际使用时，需要注意的**可选参数必须放在普通参数的后面**。

```typescript
// 可选参数
function createUserId(name: string, id: number, age?: number): string {
  return name + id;
}

// 默认参数
function createUserId(name: string = 'Semlinker', id: number, age?: number): string {
  return name + id;
}
```

##### 剩余参数

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' 的返回值 [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

#####函数重载

函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: string | number, b: string | number) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
```

##### void 和 undefined

void 表示不返回值的函数的返回值。

```typescript
// 这里推断返回类型为 void
function noop() {
  return;
}
```

在 JavaScript 中，一个放回没有返回任何值时，他的返回值就是 undefined。

> 需要注意的是，声明一个 void 类型的变量没有什么作用，因为它的值只能为 `undefined` 或 `null`：

##### never

`never` 类型表示的是那些永不存在的值的类型。

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### 类型声明

#### interface 和 type

##### interface

![interface](https://tva1.sinaimg.cn/large/e6c9d24egy1h0gibz8tyij210y0q4wh4.jpg)

##### type

![type](https://tva1.sinaimg.cn/large/e6c9d24egy1h0gicedxunj210y0q4gp4.jpg)

##### type 和 interface 的区别

###### type 可以而 interface 不行

```typescript
// 基本类型别名
type Name = string;

// 联合类型
interface Dog {
  wong();
}
interface Cat {
  miao();
}

type Pet = Dog | Cat;

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet];
```

type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```typescript
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div;
```

其他骚操作

```typescript
type StringOrNumber = string | number;
type Text = string | { text: string };
type NameLookup = Dictionary<string, Person>;
type Callback<T> = (data: T) => void;
type Pair<T> = [T, T];
type Coordinates = Pair<number>;
type Tree<T> = T | { left: Tree<T>; right: Tree<T> };
```

###### interface 可以而 type 不行

类型合并

```typescript
interface User {
  name: string;
  age: number;
}

interface User {
  sex: string;
}

/*
User 接口为 {
  name: string
  age: number
  sex: string
}
*/
```

#### class

##### 类的属性和方法

在面向对象语言中，类是一种面向对象计算机编程语言的构造，是创建对象的蓝图，描述了所创建的对象共同的属性和方法。
在 TypeScript 中，我们可以通过 Class 关键字来定义一个类：

```typescript
class Greeter {
  // 静态属性
  static cname: string = 'Greeter';
  // 成员属性
  greeting: string;

  // 构造函数 - 执行初始化操作
  constructor(message: string) {
    this.greeting = message;
  }

  // 静态方法
  static getClassName() {
    return 'Class name is Greeter';
  }

  // 成员方法
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

let greeter = new Greeter('world');
```

那么成员属性与静态属性，成员方法与静态方法有什么区别呢？这里无需过多解释，我们直接看一下以下编译生成的 ES5 代码：

```typescript
'use strict';
var Greeter = /** @class */ (function () {
  // 构造函数 - 执行初始化操作
  function Greeter(message) {
    this.greeting = message;
  }
  // 静态方法
  Greeter.getClassName = function () {
    return 'Class name is Greeter';
  };
  // 成员方法
  Greeter.prototype.greet = function () {
    return 'Hello, ' + this.greeting;
  };
  // 静态属性
  Greeter.cname = 'Greeter';
  return Greeter;
})();
var greeter = new Greeter('world');
```

###### 访问器

我们可以通过 `getter` 和 `setter` 方法来实现数据的封装和有效性校验，防止出现异常数据。

```typescript
let passcode = 'Hello TypeScript';

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (passcode && passcode == 'Hello TypeScript') {
      this._fullName = newName;
    } else {
      console.log('Error: Unauthorized update of employee!');
    }
  }
}

let employee = new Employee();
employee.fullName = 'Semlinker';
if (employee.fullName) {
  console.log(employee.fullName);
}
```

##### 类的继承

继承 (Inheritance) 是一种联结类与类的层次模型。
指的是一个类（称为子类、子接口）继承另外的一个类（称为父类、父接口）的功能，并可以增加它自己的新功能的能力，继承是类与类或者接口与接口之间最常见的关系。

继承是一种 [is-a](https://zh.wikipedia.org/wiki/Is-a) 关系：
![is-a](https://static001.geekbang.org/infoq/66/667e49e2bb0f13ace5645025ae09185e.jpeg?x-oss-process=image/resize,p_80/auto-orient,1)

在 TypeScript 中，可以通过 extends 关键字来实现继承：

```typesript
class Animal {
  name: string;

  constructor(theName: string) {
    this.name = theName;
  }

  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }

  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
sam.move();
```

#### enum

使用枚举我们可以定义一些带名字的常量。 TypeScript 支持数字的和基于字符串的枚举。

##### 数字枚举值

```typescript
enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH;
```

看一下编译结果

```typescript
'use strict';
var Direction;
(function (Direction) {
  Direction[(Direction['NORTH'] = 0)] = 'NORTH';
  Direction[(Direction['SOUTH'] = 1)] = 'SOUTH';
  Direction[(Direction['EAST'] = 2)] = 'EAST';
  Direction[(Direction['WEST'] = 3)] = 'WEST';
})(Direction || (Direction = {}));
```

默认情况下，NORTH 的初始值为 0，其余的成员会从 1 开始自动增长，也可以手动设置枚举值的初始值。enum 会为数字类型的枚举设置“反向映射”，也就是为对应的值，设置他们的 key。所以数字类型的枚举值，可以用其对应的值，取到 key。

##### 字符串枚举值

```typescript
enum Direction {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}
```

看一下编译代码

```typescript
'use strict';
var Direction;
(function (Direction) {
  Direction['NORTH'] = 'NORTH';
  Direction['SOUTH'] = 'SOUTH';
  Direction['EAST'] = 'EAST';
  Direction['WEST'] = 'WEST';
})(Direction || (Direction = {}));
```

如果使用字符串枚举值，则需要为每个枚举赋值，否则其值为 `undefined`

##### 异构枚举

异构枚举的成员值是数字和字符串的混合：

```typescript
enum Enum {
  A,
  B,
  C = 'C',
  D = 'D',
  E = 8,
  F,
}
```

### 类型运算和派生

#### 字面量类型

字符串字面量

```typescript
type Fruits = 'apple' | 'banana' | 'orange';
```

其他字面量类型

```typescript
// 其他字面量类型
type OneToFive = 1 | 2 | 3 | 4 | 5;
type Bools = true | false;
```

#### 模板字面量类型

模板字面量类型建立在字符串文字类型之上，并且能够通过联合扩展成许多字符串。

```typescript
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
```

##### 内部字符串操作类型

```typescript
// Uppercase<StringType>
type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<'my_app'>;

// Lowercase<StringType>
type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<'MY_APP'>;

// Capitalize<StringType>
type LowercaseGreeting = 'hello, world';
type Greeting = Capitalize<LowercaseGreeting>;

// Uncapitalize<StringType>
type UppercaseGreeting = 'HELLO WORLD';
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
```

#### 联合类型

```typescript
type A = {
  a: string;
};

type B = {
  b: string;
};
type Union = A | B | null;
```

##### 联合类型和守卫

TypeScript 可辨识联合（Discriminated Unions）类型，也称为代数数据类型或标签联合类型。它包含 3 个要点：可辨识、联合类型和类型守卫。

###### 可辨识

可辨识要求联合类型中的每个元素都含有一个单例类型属性，比如：

```typescript
enum CarTransmission {
  Automatic = 200,
  Manual = 300,
}

interface Motorcycle {
  type: 'motorcycle'; // discriminant
  make: number; // year
}

interface Car {
  type: 'car'; // discriminant
  transmission: CarTransmission;
}

interface Truck {
  type: 'truck'; // discriminant
  capacity: number; // in tons
}
```

我们分别定义了 `Motorcycle`、 `Motorcycle`和 `Truck` 三个接口，在这些接口中都包含一个 `type` 属性，该属性被称为可辨识的属性，而其它的属性只跟特性的接口相关。

###### 联合类型

基于前面定义了三个接口，我们可以创建一个 `Vehicle` 联合类型：
现在我们就可以开始使用 `Vehicle` 联合类型，对于 `Vehicle` 类型的变量，它可以表示不同类型的车辆。

```typescript
type Vehicle = Motorcycle | Car | Truck;
```

###### 类型守卫

```typescript
function evaluatePrice(vehicle: Vehicle) {
  switch (vehicle.type) {
    case 'car':
      return vehicle.transmission * EVALUATION_FACTOR;
    case 'truck':
      return vehicle.capacity * EVALUATION_FACTOR;
    case 'motorcycle':
      return vehicle.make * EVALUATION_FACTOR;
  }
}

const myTruck: Truck = { vType: 'truck', capacity: 9.5 };
evaluatePrice(myTruck);
```

在以上代码中，我们使用 `switch` 和 `case` 运算符来实现类型守卫，从而确保在 `evaluatePrice` 方法中，我们可以安全地访问 `vehicle` 对象中的所包含的属性，来正确的计算该车辆类型所对应的价格。

#### 交叉类型

```typescript
interface IPerson {
  id: string;
  age: number;
}

interface IWorker {
  companyId: string;
}

type IStaff = IPerson & IWorker;
```

#### 泛型

##### 泛型接口

```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}
```

##### 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

#### 操作符
##### typeof

在 TypeScript 中，`typeof` 操作符可以用来获取一个变量声明或对象的类型。

```typescript
function toArray(x: number): number[] {
  return [x];
}

type Func = typeof toArray;
```

##### keyof

`keyof` 操作符可以用来一个对象中的所有 `key` 值：

```typescript
interface Person {
  name: string;
  age: number;
}

type Keys = keyof Person;
```

##### in

`in` 用来遍历枚举类型

```typescript
type Keys = 'a' | 'b' | 'c';

type Obj = {
  [p in Keys]: any;
};
```

##### extends

有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```typescript
interface ILengthwise {
  length: number;
}

function loggingIdentity<T extends ILengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

#### 索引访问类型

我们可以使用索引访问类型查找另一个类型的指定属性。

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person['age'];
```

#### 条件类型

我们可以借助 `extends` 关键字实现类似 `if` 的操作：

```typescript
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;

type Example1 = number;

type Example2 = RegExp extends Animal ? number : string;
```

来个有意思的小例子

```typescript
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw 'unimplemented';
}
```

然后，我们可以使用该条件类型将重载简化为单个函数，而不需要重载。

```typescript
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw 'unimplemented';
}

let a = createLabel('typescript');
let b = createLabel(2.8);
let c = createLabel(Math.random() ? 'hello' : 42);
```

另一个例子，我们也可以写一个叫 Flatten 的类型，它把数组类型平坦化为元素类型，但是不使用其他类型:

```typescript
type Flatten<T> = T extends any[] ? T[number] : T;
type Str = Flatten<string[]>;
type Num = Flatten<number>;
```

##### infer

条件类型为我们提供了一种使用 `infer` 关键字从真实分支中比较的类型推断出结果的方法。

```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

我们可以利用 `infer` 关键字编写一些有用的 helper 类型别名。

```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;

type Num = GetReturnType<() => number>;
type Str = GetReturnType<(x: string) => string>;
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
```

#### 映射类型

映射类型建立在索引签名的语法之上，索引签名用于声明未提前声明的属性类型

```typescript
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};
```

映射类型是一种泛型类型，它使用 PropertyKeys (通常通过 keyof 创建)的联合来迭代键以创建类型:

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

在本例中，OptionsFlags 将获取 Type 类型中的所有属性，并将其值更改为布尔值

```typescript
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
```

##### 映射修饰符

在映射过程中可以使用两个额外的修饰符: `readonly` 和 `?` ，它们分别影响可变性和可选性。
您可以通过使用 `-` 或 `+` 作为前缀来删除或添加这些修饰符。如果您没有添加前缀，则假定为 `+`。

```typescript
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;

// 使用 - 移除 可选性
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
```

在 TypeScript 4.1 及以后的版本中，您可以使用映射类型中的 as 子句重新映射映射类型中的键:

```typescript
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

可以利用一些特性，比如模板字面量类型，从以前的属性中创建新的属性名:

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
```

### 参考

- [了不起的 TypeScript 入门教程](https://xie.infoq.cn/article/fcac0b4cad47bb74c898b2b0d?y=qun0703)
- [从零成为 TypeScript 体操运动员，高级类型完全指南](https://mp.weixin.qq.com/s/lXB55Wl32lhRMhIcrBJJwg?utm_source=pocket_mylist)
- [TypeScript 入门教程](https://ts.xcatliu.com/introduction/index.html)
- [【第 2425 期】浅谈 Typescript（二）：基础类型和类型的声明、运算、派生](https://mp.weixin.qq.com/s/IIRlhUNCV-hh14FrFDnaTQ?utm_source=pocket_mylist)
- [TypeScript 的另一面：类型编程（2021 重制版）](https://juejin.cn/post/7000360236372459527)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Typescript 中的 interface 和 type 到底有什么区别](https://juejin.cn/post/6844903749501059085#heading-5)
