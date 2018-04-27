> 本文的demo仓库在https://github.com/qiqingjin/blog/tree/master/React_Redux/demos，喜欢请star哟~

# 为什么要重写React

## React16 以前
React16 以前，对virtural dom的更新和渲染是同步的。就是当一次更新或者一次加载开始以后，diff virtual dom并且渲染的过程是一口气完成的。如果组件层级比较深，相应的堆栈也会很深，长时间占用浏览器主线程，一些类似用户输入、鼠标滚动等操作得不到响应。借Lin的两张图，视频 [A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs)。

![Before React16](./images/reactBefore.jpg)

## React16 Fiber Reconciler
React16 用了分片的方式解决上面的问题。
就是把一个任务分成很多小片，当分配给这个小片的时间用尽的时候，就检查任务列表中有没有新的、优先级更高的任务，有就做这个新任务，没有就继续做原来的任务。这种方式被叫做异步渲染(Async Rendering)。

![With React16](./images/reactAfter.jpg)

# Fiber 对开发者有什么影响

目前看有以下：

* `componentWillMount ` `componentWillReceiveProps`  `componentWillUpdate` 几个生命周期方法不再安全，由于任务执行过程可以被打断，这几个生命周期可能会执行多次，如果它们包含副作用（比如AJax），会有意想不到的bug。React团队提供了[替换的生命周期方法](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)。建议如果使用以上方法，尽量用纯函数，避免以后采坑。
* 需要关注下react为任务片设置的优先级，特别是页面用动画的情况

# 如何试用Fiber异步渲染
默认情况下，异步渲染没有打开，如果你想试用，可以：
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

const AsyncMode = React.unstable_AsyncMode;
const createApp = (store) => (
      <AsyncMode>
        <App store={store} />
      </AsyncMode>
);

export default createApp;
```

代码将开启严格模式和异步模式，React16不建议试用的API会在控制台有错误提示，比如`componentWillMount`。

# Fiber如何工作

## 一些原理

懂了原理看代码就简单点。

首先，Fiber是什么：
> A Fiber is work on a Component that needs to be done or was done. There can be more than one per component.

Fiber就是通过对象记录组件上需要做或者已经完成的更新，一个组件可以对应多个Fiber。

在render函数中创建的React Element树在第一次渲染的时候会创建一颗结构一模一样的Fiber节点树。不同的React Element类型对应不同的Fiber节点类型。一个React Element的工作就由它对应的Fiber节点来负责。

一个React Element可以对应不止一个Fiber，因为Fiber在update的时候，会从原来的Fiber（我们称为current）clone出一个新的Fiber（我们称为alternate）。两个Fiber diff出的变化（side effect）记录在alternate上。所以一个组件在更新时最多会有两个Fiber与其对应，在更新结束后alternate会取代之前的current的成为新的current节点。

其次，Fiber的基本规则：
更新任务分成两个阶段，Reconciliation Phase和Commit Phase。Reconciliation Phase的任务干的事情是，找出要做的更新工作（Diff Fiber Tree），就是一个计算阶段，计算结果可以被缓存，也就可以被打断；Commmit Phase 需要提交所有更新并渲染，为了防止页面抖动，被设置为不能被打断。

PS: `componentWillMount ` `componentWillReceiveProps`  `componentWillUpdate` 几个生命周期方法，在Reconciliation Phase被调用，有被打断的可能（时间用尽等情况），所以可能被多次调用。其实 `shouldComponentUpdate` 也可能被多次调用，只是它只返回`true`或者`false`，没有副作用，可以暂时忽略。

## 一些数据结构
* fiber是个对象，有`child`和`sibing`属性，指向第一个子节点和相邻的兄弟节点，从而构成fiber tree。
* 更新队列，`qudateQueue`，是一个对象，有`first`和`last`两个属性，指向第一个和最后一个`update`对象。
* 每个fiber有一个属性`updateQueue`指向其对应的更新队列。
* 每个fiber（当前fiber可以称为`current`）有一个属性`alternate`，开始时指向一个自己的clone体，`update`的变化会先更新到`alternate`上，当更新完毕，`alternate`替换`current`。
* 每个fiber有一个`return`属性，指向其父节点。

fiber tree的结构如下图：

![Fiber Tree](./images/fiberTree.png)

## 走进源码

**敲黑板，本文重点**

不要去github看源码，目录结构是真的复杂。可以自己写个React16的demo或者直接clone[我的demo](https://github.com/qiqingjin/blog/tree/master/React_Redux/demos)，使用webpack develop mode，来debug `node_modules`中的`react.development.js`和`react-dom.development.js`。

更新入口肯定是setState方法，下面是我画的Fiber的调用关系图，比较简化，没有画判断条件。请注意，该图**基于 React v16.3.2** ，后面源码可能改动，注意时效性。

![Fiber](./images/fiberStructure.png)

1. 用户操作引起`setState`被调用以后，先调用`enqueueSetState`方法，我把该方法划分成两个阶段，第一阶段Data Preparation，是初始化一些数据结构，比如`fiber`,   `updateQueue`, `update`。
2. 新的`update`会通过`insertUpdateIntoQueue`方法，根据优先级插入到队列的对应位置，`ensureUpdateQueues`方法初始化两个更新队列，`queue1`和`current.updateQueue`对应，`queue2`和`current.alternate.updateQueue`对应。
3. 第二阶段，Fiber Reconciler，就开始进行任务分片调度，`scheduleWork`首先更新每个fiber的优先级，这里并没有`updatePriority`这个方法，但是干了这件事，我用虚线框表示。当`fiber.return === null`，找到父节点，把所有diff出的变化（side effect）归结到`root`上。
4. `requestWork`，首先把当前的更新添加到schedule list中（`addRootToSchedule`），然后根据当前是否为异步渲染（`isAsync`参数），异步渲染调用。`scheduleCallbackWithExpriation` 方法，下一步**高能**
5. `scheduleCallbackWithExpriation`这个方法在不同环境，实现不一样，chrome等览器中使用`requestIdleCallback` API，没有这个API的浏览器中，通过`requestAnimationFrame`模拟一个`requestIdleCallback`，来在浏览器空闲时，完成下一个分片的工作，注意，这个函数会传入一个`expirationTime`，超过这个时间活没干完，就放弃了。
6. 执行到`performWorkOnRoot`，就是fiber文档中提到的Commit Phase和Reconciliation Phase两阶段。
7. 第一阶段Reconciliation Phase，在`workLoop`中，通过一个`while`循环，完成每个分片任务。
8. `performUnitOfWork`也可以分成两阶段，蓝色框表示。`beginWork`是一个入口函数，根据`workInProgress`的类型去实例化不同的react element class。`workInProgress`是通过`alternate`挂载一些新属性获得的。
9. 实例化不同的react element class时候会调用和will有关的生命周期方法。
10. `completeUnitOfWork`是进行一些收尾工作，diff完一个节点以后，更新props和调用生命周期方法等。
11. 然后进入Commit Phase阶段，这个阶段不能被打断，不再赘述。

现在有关React Fiber，在v16.3.2版本下的运行，相关博客比较少，v16.0.0源码与v16.3.2有一些差异。个人能力有限，如果我上述内容有错误，欢迎评论。