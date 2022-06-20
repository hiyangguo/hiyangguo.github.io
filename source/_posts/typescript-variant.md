---
title: TypeScript 的协变、逆变、双向协变、不变
date: 2022-06-20 21:09:12
tags:
  - TypeScript
---

`TypeScript` 给 `JavaScript` 添加了一套静态类型系统，是为了保证类型安全的，也就是保证变量只能赋同类型的值，对象只能访问它有的属性、方法。
但是这种类型安全的限制也不能太死板，有的时候需要一些变通，比如子类型是可以赋值给父类型的变量的，可以完全当成父类型来使用，也就是“**型变（variant）**”（**类型改变**）。
这种“型变”分为两种，一种是子类型可以赋值给父类型，叫做**协变（covariant）**，一种是父类型可以赋值给子类型，叫做**逆变（contravariant）**。

<!-- more -->

### 协变

子类型可以赋值给父类型的情况就叫做**协变（covariant）**。

```typescript
interface Person {
  name: string;
}

interface Student {
  name: string;
  subjects: string[];
}

let person: Person = {
  name: 'xaioming',
};
let zhangsan: Student = {
  name: 'zhangsan',
  subjects: ['HTML', 'JavaScript'],
};

person = zhangsan; // 这里发生了协变
```

[试一下](https://www.typescriptlang.org/play?strictFunctionTypes=false&ts=4.5.0-beta#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyxyIcAthAFzIZhSgDmA3AQL7IEGiSyIoBlMAFcAJhHD4iJMpRp0GIFtOIZhAIwBWEBGAzz6TANoBddlwA2EMMgAOmHDXRRsuALxSSpCtWQByAA84YCxyJj8AGnZWKxsALwALOCUMZJohMQkbD0IvWV8-ROTGVJBIlVoNbV19ZCM-AAkAFQBZABlI-wApOAA3OAEEBlswPzM2VgJ7FxxkDyKU5OZkAHoV5EBN+MAZxMBF5UB8V0AwuUB5ZUAN5SA)

### 逆变

函数的参数有**逆变（contravariant）**的性质，即拥有父类型参数的函数可以赋值给子类型的函数。而返回值是**协变**的，也就是子类型可以赋值给父类型。

```typescript
interface Person {
  name: string;
}

interface Student {
  name: string;
  subjects: string[];
}

let printSubjects = (student: Student) => {
  console.log(student.subjects);
};

let printName = (person: Person) => {
  console.log(person.name);
};

printSubjects = printName; // 这里由于参数的逆变性质 可以进行赋值
printName = printSubjects; // Type '(student: Student) => void' is not assignable to type '(person: Person) => void'.
// Types of parameters 'student' and 'person' are incompatible.
// Property 'subjects' is missing in type 'Person' but required in type 'Student'.(2322)

let person: Person = {
  name: 'xaioming',
};
let zhangsan: Student = {
  name: 'zhangsan',
  subjects: ['HTML', 'JavaScript'],
};

let getStudent = (): Student => zhangsan;
let getPerson = (): Person => person;

getPerson = getStudent; //这里由于函数返回值是协变的 可以进行赋值
```

[试一下](https://www.typescriptlang.org/play?ts=4.5.0-beta#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyxyIcAthAFzIZhSgDmA3AQL7IEGiSyIoBlMAFcAJhHD4iJMpRp0GIFtOIZhAIwBWEBGAzz6TANoBddlwA2EMMgAOisAI3bd+5AAo6YiWBpDv4ACUyAC8AHzIAG5YwKKsBPY8Tlo6eqEeXuJBoRGEJMgIONhWAHQWWIyeIllgJWoproGsbJbWdg4AchTUHraYODToUNggweFRMXFcieBdlOnufcM4Y7kqBUVYpeWVSyMlshBN5gkOyS5pIe08cxDMyAD0D8iAm-GAM4mAjK6AcXKAQ8qADqaAELdAGAJgA3lQDkBoAKWOQgHvlQCncoBt+MAMhGAaVjADwKpxu3XSM0czlSGHurRsewGaH6uCueRk3RoAHIAB5wYBYchMWkAGnYrCsNgAXgALOBKDBCvzVHzpKnEQ50gVCxgikAc9b1C5uIy0gASABUALIAGQ5yFpACk4JE4AIEAxbGBaWY2PEechGNZ-DUFoEqO6JeM5cKhdy2q6wEMRsQru4vWGcDk7OT4iGYxSXW7xeBWEA)

### 双向协变

在 **ts2.x** 之前支持有父类型参数的函数可以赋值给子类型的函数**（协变）**，同时有子类型参数的函数可以赋值给父类型的函数**（逆变）**。这种特性成为“**双向协变**”。

但是这明显是**有问题的**，不能保证类型安全，所以之后 ts 加了一个编译选项 [`strictFunctionTypes`](https://www.typescriptlang.org/tsconfig#strictFunctionTypes)，设置为 `true` 就只支持函数参数的逆变，设置为 `false` 则支持双向协变。

![strictFunctionTypes](/uploads/typescript-variant/strictFunctionTypes.png)

```typescript
printName = printSubjects; // 将 strictFunctionTypes 设为 false 后，支持函数参数的双向协变，类型检查不会报错，但不能严格保证类型安全。
```

[试一下](https://www.typescriptlang.org/play?strictFunctionTypes=false&ts=4.5.0-beta#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyxyIcAthAFzIZhSgDmA3AQL7IEGiSyIoBlMAFcAJhHD4iJMpRp0GIFtOIZhAIwBWEBGAzz6TANoBddlwA2EMMgAOisAI3bd+5AAo6YiWBpDv4ACUyAC8AHzIAG5YwKKsBPY8Tlo6eqEeXuJBoRGEJMgIONhWAHQWWIyeIllgJWoproGsbJbWdg4AchTUHraYODToUNggweFRMXFcieBdlOnufcM4Y7kqBUVYpeWVSyMlshBN5gkOyS5pIe08cxDMyAD0D8iAm-GAM4mAjK6AcXKAQ8qADqaAELdAGAJgA3lQDkBoAKWOQgHvlQCncoBt+MAMhGAaVjADwKpxu3XSM0czlSGHuT2QgDAdWiGXQAMWEIF0wBwABUAJ59DDIQB90YAuOWQ8AsGBQgDgVQAw-99ADPKgEQVUGCuFowBhckA)

### 不变

型变都是针对父子类型来说的，非父子类型就不会型变也就是**不变（invariant）**。

### 参考

- [TypeScript 类型体操通关秘籍](https://juejin.cn/book/7047524421182947366)
