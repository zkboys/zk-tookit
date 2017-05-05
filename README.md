# 前端项目

> 基于 react redux antd webpack es6

## 项目特点
- 前后端分离，前端dev-server反向代理请求
- 单页面应用，组件化，模块化
- redux 封装
- route 封装
- ajax请求封装，自动提示、mock数据

## 文件命名规范
- jax文件名驼峰命名法
- js文件名小写英文+连字符（减号）
- pages actions reducers 通过同名文件夹进行对应，方便后期维护，layouts要严格按照url结构对应，actions reducers services对应到大的模块即可

## 代码规范
- 尽量使用es6
- 项目中使用eslint结合webpack进行强制规范，编码过程中，可能会经常出现eslint相关的错误。
- 浏览器console中尽量不要出现任何输出，包括调试性信息，warning等。

## 系统事件

```
import * as PubSubMsg from 'path/to/pubsubmsg';
PubSubMsg.publish(message, options);
PubSubMsg.subscribe('message', function(options){...});

message // error success 等提示信息
start-fetching-component // 开始加载异步组件
end-fetching-component // 结束加载异步组件
```

## React ES6+写法
```javascript
class App extends React.Component{
    // 构造函数，一般不用写
    constructor(props){
        super(props);
    }
    // 初始化state,替代原getInitialState, 注意前面没有static
    state = {
        showMenu:false
    };
    // 替代原propTypes 属性,注意前面有static,属于静态方法.
    static propTypes = {
        autoPlay: PropTypes.bool.isRequired
    }
    // 默认defaultProps,替代原getDefaultProps方法, 注意前面有static
    static defaultProps = {
        loading:false
    };
    //事件的写法,这里要使用箭头函数,箭头函数不会改变this的指向,否这函数内,this指的就不是当前对象了,React.CreatClass方式React会自动绑定this,ES6写法不会.详见下一小节说明.
    handleClick = (e)=>{
        this.setState();//这里的this指的还是App
    };
    componentDidMount() {
        // do something yourself...
    }
}
```

## React ES6 事件绑定
老写法的官方原话:
Autobinding: When creating callbacks in JavaScript, you usually need to explicitly bind a method to its instance such that the value of this is correct. With React, every method is automatically bound to its component instance. React caches the bound method such that it's extremely CPU and memory efficient. It's also less typing!

新的ES6写法如果要实现this还指向当前对象,有三种写法:个人感觉箭头函数写法最优雅.
```es6
// 第一种:this.handleClick.bind(this)

handleClick(e) {
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this.handleClick.bind(this)}>点击</h1>
        </div>
    );
}


// 第二种:this.handleClick = this.handleClick.bind(this)

constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
}
handleClick(e) {
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this.handleClick}>点击</h1>
        </div>
    );
}


// 第三种:handleClick = (e) => {}

handleClick = (e) => {
    // 使用箭头函数(arrow function)
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this.handleClick}>点击</h1>
        </div>
    );
}

```
## React 组件函数命名
- 事件处理统一使用`handleXxxClick` `handleXxxChange`方式命名，Xxx指操作对象，Click/Change指事件类型，如果组件比较简单，Xxx可以省略，直接写成`handleClick即可`,示例如下：
    ```js
    handleSubmit = () => {}

    handleModalOk = () => {}

    handleNameChange =　() => {}

    handleCloseClick = () => {}

    ```

- 构造渲染内容，统一使用`renderXxx`方式命名，示例如下：
    ```js
    renderUserList = () => {} // 渲染用户列表

    renderJobOptions = () => {} // 渲染工作下拉option
    ```

## React propTypes
记录一下propTypes，方便查阅
```js
import PropTypes from 'prop-types';

static propTypes =  {
   // 可以声明 prop 为指定的 JS 基本类型。默认
   // 情况下，这些 prop 都是可传可不传的。
   optionalArray: PropTypes.array,
   optionalBool: PropTypes.bool,
   optionalFunc: PropTypes.func,
   optionalNumber: PropTypes.number,
   optionalObject: PropTypes.object,
   optionalString: PropTypes.string,

   // 所有可以被渲染的对象：数字，
   // 字符串，DOM 元素或包含这些类型的数组。
   optionalNode: PropTypes.node,

   // React 元素
   optionalElement: PropTypes.element,

   // 用 JS 的 instanceof 操作符声明 prop 为类的实例。
   optionalMessage: PropTypes.instanceOf(Message),

   // 用 enum 来限制 prop 只接受指定的值。
   optionalEnum: PropTypes.oneOf(['News', 'Photos']),

   // 指定的多个对象类型中的一个
   optionalUnion: PropTypes.oneOfType([
     PropTypes.string,
     PropTypes.number,
     PropTypes.instanceOf(Message)
   ]),

   // 指定类型组成的数组
   optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

   // 指定类型的属性构成的对象
   optionalObjectOf: PropTypes.objectOf(PropTypes.number),

   // 特定形状参数的对象
   optionalObjectWithShape: PropTypes.shape({
     color: PropTypes.string,
     fontSize: PropTypes.number
   }),

   // 以后任意类型加上 `isRequired` 来使 prop 不可空。
   requiredFunc: PropTypes.func.isRequired,

   // 不可空的任意类型
   requiredAny: PropTypes.any.isRequired,

   // 自定义验证器。如果验证失败需要返回一个 Error 对象。不要直接
   // 使用 `console.warn` 或抛异常，因为这样 `oneOfType` 会失效。
   customProp: function(props, propName, componentName) {
     if (!/matchme/.test(props[propName])) {
       return new Error('Validation failed!');
     }
   }
 },
```




