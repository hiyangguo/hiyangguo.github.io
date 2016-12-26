---
title: Redux入门
categories: react学习
tags:
  - javascript
  - react
---

## 核心概念

- `Action` 是一个用来描述应用的 `state` 的普通 `JavaScript` 对象。（可以理解为处理前的状态）
- `Reducer` 是为了把 `action` 和 `state `串起来（即通过处理 `action` 返回一个 `state`），而开发的一些函数。它只是一个接收 `state` 和 一个`action`，并返回新的 state 的函数

<!-- more -->

## 三大原则

### 1. 单一数据源

**整个应用的 `state` 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 `store` 中。**

```javascript
console.log(store.getState())

/* 输出
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

### 2.State 是只读的
**惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。**

```javascript
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```


### 3.使用纯函数来执行修改
**为了描述 action 如何改变 state tree ，你需要编写 reducers。**
```javascript

function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```
## Action
**Action** 是把数据从应用（译者注：这里之所以不叫 view 是因为这些数据有可能是服务器响应，用户输入或其它非 view 的数据 ）传到 store 的有效载荷。它是 store 数据的**唯一**来源。
### Action 创建函数
**Action 创建函数** 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。
在 Redux 中的 action 创建函数只是简单的返回一个 action:
```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
## Reucer
Action 只是描述了有事情发生了这一事实，而 Reducer 要做的事情是指明应用如何更新 state。
### 设计 State 结构
在 Redux 应用中，所有的 state 都被保存在一个单一对象中。如何才能以最简的形式把应用的 state 用对象描述出来？
以 todo 应用为例，需要保存两种不同的数据：
- 当前选中的任务过滤条件
- 完整的任务列表
通常，这个 state 树还需要存放其它一些数据，以及一些 UI 相关的 state。应该尽量把这些数据与 UI 相关的 state 分开。
```javascript
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

### Action 处理
我们已经确定了 state 对象的结构，就可以开始开发 reducer。reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。
```javascript
(previousState, action) => newState
```
之所以称作 reducer 是因为它将被传递给 Array.prototype.reduce(reducer, ?initialValue) 方法。保持 reducer 纯净非常重要。
**永远不要** 在 reducer 里做这些操作：
- 修改传入参数
- 执行有副作用的操作，如 API 请求和路由跳转
- 调用非纯函数，如 `Date.now()` 或 `Math.random()`

**只要传入的参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用、没有 API 请求、没有变量修改，单纯执行计算。**
现在可以开始编写 reducer，并让它来处理之前定义过的 action。
我们将以指定 state 的初始状态作为开始。Redux 首次执行时，state 为 undefined，此时我们可借机设置并返回应用的初始 state。
```javascript
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

## Store
Store 就是把`reducers `、`action`、`state `联系到一起的对象。Store 有以下职责：
- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。
** Redux 应用只有一个单一的 store。** 当需要拆分数据处理逻辑时，应该使用 reducer 组合 而不是创建多个 store。

我们使用 combineReducers() 将多个 reducer 合并成为一个。现在我们将其导入，并传递 createStore()。
```javascript
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```
createStore() 的第二个参数是可选的, 用于设置 state 初始状态。

## 数据流
**严格的单向数据流**是 Redux 架构的设计核心。Redux 应用中数据的生命周期遵循下面 4 个步骤：
1. 调用 store.dispatch(action)。
Action 就是一个描述“发生了什么”的普通对象。比如：
```javascript
 { type: 'LIKE_ARTICLE', articleId: 42 };
 { type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } };
 { type: 'ADD_TODO', text: 'Read the Redux docs.'};
```
你可以在任何地方调用 store.dispatch(action)，包括组件中、XHR 回调中、甚至定时器中。
2. Redux store 调用传入的 reducer 函数。
Store 会把两个参数传入 reducer： 当前的 state 树和 action。例如，在这个 todo 应用中，根 reducer 可能接收这样的数据：
```javascript
// 当前应用的 state（todos 列表和选中的过滤器）
 let previousState = {
   visibleTodoFilter: 'SHOW_ALL',
   todos: [
     {
       text: 'Read the docs.',
       complete: false
     }
   ]
 }

 // 将要执行的 action（添加一个 todo）
 let action = {
   type: 'ADD_TODO',
   text: 'Understand the flow.'
 }

 // render 返回处理后的应用状态
 let nextState = todoApp(previousState, action);
```
3.根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。
4.Redux store 保存了根 reducer 返回的完整 state 树。[TOC]

## 核心概念

- `Action` 是一个用来描述应用的 `state` 的普通 `JavaScript` 对象。（可以理解为处理前的状态）
- `Reducer` 是为了把 `action` 和 `state `串起来（即通过处理 `action` 返回一个 `state`），而开发的一些函数。它只是一个接收 `state` 和 一个`action`，并返回新的 state 的函数

## 三大原则

### 1. 单一数据源

**整个应用的 `state` 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 `store` 中。**

```javascript
console.log(store.getState())

/* 输出
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

### 2.State 是只读的
**惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。**

```javascript
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```


### 3.使用纯函数来执行修改
**为了描述 action 如何改变 state tree ，你需要编写 reducers。**
```javascript

function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```
## Action
**Action** 是把数据从应用（译者注：这里之所以不叫 view 是因为这些数据有可能是服务器响应，用户输入或其它非 view 的数据 ）传到 store 的有效载荷。它是 store 数据的**唯一**来源。
### Action 创建函数
**Action 创建函数** 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。
在 Redux 中的 action 创建函数只是简单的返回一个 action:
```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
## Reucer
Action 只是描述了有事情发生了这一事实，而 Reducer 要做的事情是指明应用如何更新 state。
### 设计 State 结构
在 Redux 应用中，所有的 state 都被保存在一个单一对象中。如何才能以最简的形式把应用的 state 用对象描述出来？
以 todo 应用为例，需要保存两种不同的数据：
- 当前选中的任务过滤条件
- 完整的任务列表
通常，这个 state 树还需要存放其它一些数据，以及一些 UI 相关的 state。应该尽量把这些数据与 UI 相关的 state 分开。
```javascript
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

### Action 处理
我们已经确定了 state 对象的结构，就可以开始开发 reducer。reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。
```javascript
(previousState, action) => newState
```
之所以称作 reducer 是因为它将被传递给 Array.prototype.reduce(reducer, ?initialValue) 方法。保持 reducer 纯净非常重要。
**永远不要** 在 reducer 里做这些操作：
- 修改传入参数
- 执行有副作用的操作，如 API 请求和路由跳转
- 调用非纯函数，如 `Date.now()` 或 `Math.random()`

**只要传入的参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用、没有 API 请求、没有变量修改，单纯执行计算。**
现在可以开始编写 reducer，并让它来处理之前定义过的 action。
我们将以指定 state 的初始状态作为开始。Redux 首次执行时，state 为 undefined，此时我们可借机设置并返回应用的初始 state。
```javascript
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

## Store
Store 就是把`reducers `、`action`、`state `联系到一起的对象。Store 有以下职责：
- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。
** Redux 应用只有一个单一的 store。** 当需要拆分数据处理逻辑时，应该使用 reducer 组合 而不是创建多个 store。

我们使用 combineReducers() 将多个 reducer 合并成为一个。现在我们将其导入，并传递 createStore()。
```javascript
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```
createStore() 的第二个参数是可选的, 用于设置 state 初始状态。

## 数据流
**严格的单向数据流**是 Redux 架构的设计核心。Redux 应用中数据的生命周期遵循下面 4 个步骤：
1. 调用 store.dispatch(action)。
Action 就是一个描述“发生了什么”的普通对象。比如：
```javascript
 { type: 'LIKE_ARTICLE', articleId: 42 };
 { type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } };
 { type: 'ADD_TODO', text: 'Read the Redux docs.'};
```
你可以在任何地方调用 store.dispatch(action)，包括组件中、XHR 回调中、甚至定时器中。
2. Redux store 调用传入的 reducer 函数。
Store 会把两个参数传入 reducer： 当前的 state 树和 action。例如，在这个 todo 应用中，根 reducer 可能接收这样的数据：
```javascript
// 当前应用的 state（todos 列表和选中的过滤器）
 let previousState = {
   visibleTodoFilter: 'SHOW_ALL',
   todos: [
     {
       text: 'Read the docs.',
       complete: false
     }
   ]
 }

 // 将要执行的 action（添加一个 todo）
 let action = {
   type: 'ADD_TODO',
   text: 'Understand the flow.'
 }

 // render 返回处理后的应用状态
 let nextState = todoApp(previousState, action);
```
3.根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。
4.Redux store 保存了根 reducer 返回的完整 state 树。
