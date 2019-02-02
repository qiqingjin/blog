> 本文的demo仓库在https://github.com/qiqingjin/blog/tree/master/React_Redux/demos，喜欢请star哟~

你可能听过一句话，过早的优化是万恶之源。项目开始，我们当然会首先考虑功能的实现，当完成第一版功能以后，就应该尽早开始优化和重构了。

# 工具
如果我们不去测量项目目前运行的速度，就无法知道后续进行的优化是否有效、效果有多少。下面介绍几个常用的测量React性能的工具。

* [Why did you update](https://github.com/maicki/why-did-you-update)
* [Chrome Performance Tab](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab)
* [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

# 原则
每当组件state或者props更新时，react会对虚拟dom树进行一次“对比”，保留没有改变的节点，更新改变了的节点。这个过程被称为调和（Reconciliaton）。大致过程如下：

1. 节点类型不同（比如：div与span），直接执行更新
2. 节点类型相同，如果是DOM元素（div等），则对比属性和内容，不一致的地方进行更新
3. 节点类型相同，如果是React组件，更新虚拟dom，再进行子节点对比，原则重复1-3


## 使用key
当遍历一个数组，渲染一组数据时，应该为每个item增加key。如果不使用key，react控制台会给我们提示。增加key可以优化调和过程。

## 不要随意修改组件的容器html的类型
从上述调和过程可以看出，如果容器的html类型不同，react会跳过调和，直接进行重新渲染。如果没有必要，不要在render中根据state或者props的不同，修改容器的html类型。

## shouldComponentUpdate
有些特殊情况，调和过程是不必要的。例如一个TodoList组件有子组件TodoItem，TodoItem只有在`props.text`或者`props.completed`改变时，才需要渲染，那么其他`props` 的改变引起的调和过程就是不必要的。

为了避免这种情况，react提供了shouldComponentUpdate方法。在调和过程发生之前，react会先调用组件的该方法，如果该方法返回false，则此次调和终止，如果返回true则继续。默认这个方法返回true。官方介绍参考 https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action 。

如果我们明确知道，只有哪些state和props改变，才应该引起组件的更新时，我们应该实现这个生命周期函数，避免不必要的调和过程。对于object类型，建议试用浅比较进行对比，过深的比较与一次调和相比，可能反而更浪费时间。

## pureComponent
当组件更新时，如果props和state都没有变化，则不进行render。注意，这里说的没有变化，也是进行浅比较。通过减少调和和渲染，来提高性能。

当pureComponent有shouldComponentUpdate函数时，会先调用该函数，根据它的返回结果决定是否进行render。如果pureComponent没有shouldComponentUpdate方法，则如上述，直接进行props和state的浅比较来决定是否进行render。

## 使用不可变数据
### Immutable
Immutable数据，就是一旦创建就不可用再修改的数据，如果想“改变”，只能在原来值的基础上创建新值并作出相应修改。例如：
```js
const obj1 = Immutable({name: 'test'});
const obj2 = obj1.set(age, 11);
```
如果在state和props中使用Immutable的数据，`===`就可以对比object类型的数据是否完全相等。
例如：
```js
colors = {c1: 'right'};

changeColor = () ={
    this.colors.c1 = 'blue';
}

render(){
    return <ShowColors colors={this.colors}>
}
```
当`changeColor`被调用时候，并不会引起`ShowColors`重新渲染，因为`props.colors`的引用相同。
目前主流使用的库有Immutable.js和seamless-immutable。
### 避免使用props匿名函数和object
在props中传递函数是经常需要的逻辑，匿名函数相当于每次都创建了一个新函数，从而导致子组件一定会进行一次render、调和。
不好的做法：
```js
render(){
    return <TodoItem onClick={() => this.setState({isSelected: true}) />
}
```
我们应该：
```js
onItemSelect = () => {
    this.setState({isSelected: true};
}
render(){
    return <TodoItem onClick={this.onItemSelect) />
}
```
避免使用object的原因同理。

## 仅仅map你需要的数据
如果你使用Redux，那么应该熟悉`mapStateToProps`方法。这个方法的作用是从父组件的state中选择一部分作为子组件的props。这个函数render都会执行一次。但实际上，如果父组件的state中那些会影响子组件props的部分，没有改变，那么`mapStateToProps`也没有必要执行一次。

[reselect](https://github.com/reduxjs/reselect)就支持这个需求，如果相关状态没有改变，那就直接用上一次缓存的结果。reselect用来创造选择器，所谓选择器，就是接受一个state作为参数的函数，这个选择器函数返回的数据就是我们某个`mapStateToProps`需要的结果。[官方的例子](https://github.com/reduxjs/reselect#example) 。

## 范式化state
所谓范式化，就是遵照关系型数据库的设计原则，较少冗余数据。范式化的数据结构就是要让一份数据只存储一份，数据冗余的后果就是很难保证数据的一致性。
反范式化的设计：
```js
{
    id: 1,
    text: 'todo1',
    completed: false,
    type: {
        name: 'p1',
        color: 'red'
    }
}
```
反范式化的数据用冗余来换取读取容易，上面state的设计，只要获得了一个todo item的数据，就很容易获得其所有相关信息。但是，当需要修改type.name为p1的所有类型，color属性改为green，就需要逐条todo item进行修改。
范式化的设计：
```js
//todo item
{
    id: 1,
    text: 'todo1',
    type: 1
}
// type
{
    id: i,
    name: 'p1',
    color: 'red'
}
```
范式化的设计只要修改id为1的type的信息，todo item的type就会相应改变。但是范式化设计读取数据会相对难一些。


#不要过度优化

我们可以使用第一节中的工具来监测我们的重复渲染，然后进行优化。但也不必要求每个组件都没有一次重复渲染。有时候，为了避免重复渲染花费的计算时间，甚至比直接重新渲染花费的实际还要多。

多数 PureComponent 的用法都会导致多次执行 diff 检查，迫使开发人员不必要地维护处理程序的引用标识。
仔细想想，如果你有一个 Component ，会有多少次 diff 检查？如果你有一个 PureComponent ，又会有多少次 diff 检查？答案分别是“只有一次”和“至少一次，有时是两次”。如果一个组件经常在更新时发生变化，那么 PureComponent 将会执行两次 diff 检查而不是一次（props 和 state 在 shouldComponentUpdate 中进行的严格相等比较，以及常规的元素 diff 检查）。这意味着通常它会变慢，偶尔会变快。
