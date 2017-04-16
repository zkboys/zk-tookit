# 前端项目

> 基于 react redux antd webpack es6

## Build Setup
使用[yarn](https://yarnpkg.com/zh-Hans/)
``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:6080
yarn run dev

# build for production with minification
yarn run build

```
## 项目特点
- 前后端分离，前端dev-server反向代理请求
- 单页面应用，组件化，模块化

## 文件命名规范
- jax文件名驼峰命名法
- js文件名小写英文+连字符（减号）
- layouts actions reducers services 通过同名文件夹进行对应，方便后期维护，layouts要严格按照url结构对应，actions reducers services对应到大的模块即可

## 代码规范
- 尽量使用es6
- 项目中使用eslint结合webpack进行强制规范，编码过程中，可能会经常出现eslint相关的错误。
- 浏览器console中尽量不要出现任何输出，包括调试性信息，warning等。


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
        autoPlay: React.PropTypes.bool.isRequired
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
```javascript
第一种:this.handleClick.bind(this)

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


第二种:this.handleClick = this.handleClick.bind(this)

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


第三种:handleClick = (e) => {}

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

## React context与props区别
[官网介绍context](https://facebook.github.io/react/docs/context.html)

- props，给直接子组件传递数据，如果多层，要一层一层显示的传递
- context， 给后代组件传递数据，子组件只要声明contextTypes，就可以获取组件树context中的数据,相当于整个组件树中的全局变量。
- 尽量不要使用context，会使组件结构变得复杂。

## React propTypes
记录一下propTypes，方便查阅
```js
static propTypes =  {
   // 可以声明 prop 为指定的 JS 基本类型。默认
   // 情况下，这些 prop 都是可传可不传的。
   optionalArray: React.PropTypes.array,
   optionalBool: React.PropTypes.bool,
   optionalFunc: React.PropTypes.func,
   optionalNumber: React.PropTypes.number,
   optionalObject: React.PropTypes.object,
   optionalString: React.PropTypes.string,

   // 所有可以被渲染的对象：数字，
   // 字符串，DOM 元素或包含这些类型的数组。
   optionalNode: React.PropTypes.node,

   // React 元素
   optionalElement: React.PropTypes.element,

   // 用 JS 的 instanceof 操作符声明 prop 为类的实例。
   optionalMessage: React.PropTypes.instanceOf(Message),

   // 用 enum 来限制 prop 只接受指定的值。
   optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

   // 指定的多个对象类型中的一个
   optionalUnion: React.PropTypes.oneOfType([
     React.PropTypes.string,
     React.PropTypes.number,
     React.PropTypes.instanceOf(Message)
   ]),

   // 指定类型组成的数组
   optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

   // 指定类型的属性构成的对象
   optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

   // 特定形状参数的对象
   optionalObjectWithShape: React.PropTypes.shape({
     color: React.PropTypes.string,
     fontSize: React.PropTypes.number
   }),

   // 以后任意类型加上 `isRequired` 来使 prop 不可空。
   requiredFunc: React.PropTypes.func.isRequired,

   // 不可空的任意类型
   requiredAny: React.PropTypes.any.isRequired,

   // 自定义验证器。如果验证失败需要返回一个 Error 对象。不要直接
   // 使用 `console.warn` 或抛异常，因为这样 `oneOfType` 会失效。
   customProp: function(props, propName, componentName) {
     if (!/matchme/.test(props[propName])) {
       return new Error('Validation failed!');
     }
   }
 },
```


## 关于redux
项目分了很多层次，可以提高代码复用，actions可以被各个页面组件和reducers复用，services可以被actions复用

- 各个页面（组件）通过`const {actions} = this.props`获取actions对象，然后调用`actions.xxx()` 触发action；
- 各个页面（组件）要export出两个变量`LayoutComponent`和`mapStateToProps`；使用`src/utils/connectComponent.js`使组件与redux做链接时会用到；
- `mapStateToProps` 用于指定redux的state中哪部分数据用于当前组件，由于reducer的`combineReducers`方法包装之后，将各个reducer的state存放在对应的key中，key指的是combineReducers包装时指定的key，比如：

    ```javascript
    // src/reducers/index.js
    export default combineReducers({
        home, // 这个home就是key，es6写法
        utils,
    });

    src/layout/home.js
    export function mapStateToProps(state) {
        return {
            ...state.home, // 这个home指的就是 combineReducers中的key
            ...state.app // 如果使用 ... home和app中如果有同名属性，app会覆盖home，可以通过调整...state.app，和...state.home得顺序，决定当前页面使用谁的属性。
        };
    }

    ```
- action负责准备数据，数据来源：
    - 调用action方法时传入的参数
    - action内部调用service异步请求获得的数据
    - storage/cookie中获取数据
- reducer为纯函数，负责处理数据，要对state做deepcopy，返回一个新的数据，不要直接操作state，不会涉及异步，不要调用services中方法，不操作Storage，单纯的获取action的数据之后，做进一步处理。
- store负责将数据以pros形式传递给component，以及通过中间件对数据统一处理。
- 组件，调用触发action，获取store处理过的数据，不发送ajax，不操作storage，单纯的展示数据。
- 适当的区分哪些数据需要redux处理，哪些数据直接使用state，不要为了redux而redux
    - 哪些数据适合使用redux处理？
        - 异步数据（包括ajax，websocket，异步状态loading等）
        - 来自cookie/localStorage等其他存储的数据
        - 多组件公用数据
        - 多组件间通信数据
    - 哪些数据直接使用组件内部state即可？
        - 不涉及组件外数据修改（比如ajax修改后端数据），不被其他任何外部组件使用的数据，比如：点击显示隐藏modal；点击展开收起div等控制内部状态的数据。

### action：
- action 使用的是`redux-actions`模块构建的 `Flux Standard Action`
    ```javascript
    createAction(type, payloadCreator = Identity, ?metaCreator)
    ```
- 各个action文件之间，不允许出现同名方法，`src/actions/index.js`中有检测。

### 回调处理
调用actions方法时，给actions方法传入一个回调参数，这个回调参数，最终是由 `createAction` 的 `metaCreator` 参数处理的，项目中做了封装。`metaCreator` 可以携带业务以外的数据，异步actions会触发两次reducer，第一次触发时`payloadCreator` 传递给reducer的是promise对象，无法携带其他数据了，这时候就可以通过`metaCreator`携带额外的数据。

```javascript
export const testAsync = createAction(
    types.TEXT_ASYNC_DEMO,
    async()=> {
        return await homeService.getMsg(); // 返回promise
    },
    (resolved, rejected)=> {
    	return {
    		resolved,
    		rejected,
    		sync: 'home'
    	}
    }
);

/* 解释

(resolved, rejected)=> {
    return {
        resolved,
        rejected,
        sync: 'home'
    }
}
就是 createAction 的第三个参数 metaCreator，是一个函数，这个函数返回的数据，最终存放在action的meta中。
返回数据 resolved 和 rejected 就是调用action方法时传入的回调函数，一个代表成功，一个代表失败，这两个数据最终会被 src/store/asyncActionCallbackMiddleware.js中间件使用
*/
```

### 异步写法
异步是使用`src/store/promise-middleware.js`中间件进行处理的
一本异步action其实是触发了两次reducer，第一次标记异步开始，reducer可以获取相应的标记，第二次异步完成，返回数据。具体可以参考`promise-middleware.js`源码

#### action异步写法
```javascript
import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as profileService from '../services/profile-service';

export const saveUserMessage = createAction(types.SAVE_USER_MESSAGE,
    async(userMessage) => await profileService.saveUserMessage(userMessage), // 返回一个promise实例
    (userMessage, resolved, rejected) => {
        return {
            userMessage, // 异步action将触发reducer两次，reducer第一次触发获取payload是promise对象，额外的数据就要metaCreator提供了。
            resolved, // 执行异步action成功回调，使页面可以获取异步成功
            rejected, // 执行异步action失败回调，使页面可以处理异步失败
            autoTipError: '保存失败', // 系统自动提示错误， 默认 ‘未知系统错误’ 传递false，不使用系统提示
            autoTipSuccess: '个人信息修改成功', // 默认 false，不显示成功提示信息，
        };
    }
);
```

#### reducer 异步写法：
有两种写法，第一种有机会获取所有action的数据，第二种，只能获取自己type的action数据，个人觉得获取所有action数据没有用，反而状态受干扰。推荐第二种写法
```javascript
import * as types from '../constants/actionTypes';

let initialState = {
    isSidebarCollapsed: false,
    fetching: false,
};

export default function (state = initialState, action) {
    const {payload, error, meta={}, type} = action;
    const {sequence = {}} = meta;
    const status = sequence.type === 'start';
    if (status || error) { // 出错，或者正在请求中，注意： 这种写法将捕获所有异步action，自己模块得status要在自己的case中写。
        return {
            ...state,
            fetching: status,
        };
    }
    switch (type) {
    case types.TOGGLE_SIDE_BAR: {
        const isSidebarCollapsed = !state.isSidebarCollapsed;
        return {
            ...state,
            isSidebarCollapsed,
        };
    }
    case types.GET_STATE_TO_STORAGE: {
        return {
            ...state,
            ...(payload.setting || initialState),
        };
    }
    default:
        return state;
    }
}

```
```javascript
import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    loading: false,
    orderState: '',
};

export default handleActions({
    [types.SAVE_USER_MESSAGE](state, action) {
        const {error, meta = {}} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';

        // loading 要反应到页面上，
        // error由middleware处理，全局message提示，或者各个页面添加回调处理
        if (loading || error) {
            return {
                ...state,
                loading,
            };
        }

        return {
            ...state,
            orderState: 'success',
            loading,
        };
    },
}, initialState);

```

### redux中的异常处理
- 基于`flux-standard-action` 规范，异常action返回结构为：`{..., payload: error, error: true, ...}`
- `utils-middleware.js`会统一截获处理异常（无论异步还是同步）， 会根据 `meta.autoTipError`来确定是否全局提示处理异常信息
- `async-action-callback-middleware.js` 会调用actions的回调函数，给具体页面处理异常的机会


#### 异步异常
异步操作统一使用的是promise，异常捕获在`src/store/promise-middleware.js`中间件中，一旦异步操作出现异常，action将传递给相应的reducer`{..., payload: error, error: true, ...}`

#### 同步异常
如果`action`返回的`payload`是一个`Error`对象，`redux-actions`，将自动设置`action.error`为`true`
自己可以在action中，使用`try-catch`处理？？？

### 将数据存储到localStorage中
开发过程中只需要在action中添加sync标记即可实现state存储到localStorage。
以及src/actions/utils.js 的 getStateFromStorage 方法中维护对应的sync，即可同步localStorage到state中。

action中通过 metaCreator 的 sync 属性来标记这个action相关的state是否存储到localStorage中。其中sync将会作为存储数据的key
```js
export const setSettings = createAction(types.SET_SETTING, data => data, () => ({sync: 'setting'}));
```

使用 sync-reducer-to-local-storage-middleware.js 中间件进行存储操作：
```js
import {isFSA} from 'flux-standard-action';
import * as types from '../constants/actionTypes';
import * as storage from '../utils/storage';

export default ({dispatch, getState}) => next => action => {
    if (!isFSA(action)) {
        return next(action);
    }

    const {meta = {}, sequence = {}, error, payload} = action;
    const {sync} = meta;

    if (action.type === types.SYNC_STATE_TO_STORAGE) {
        let state = getState();
        try {
            storage.setItem(payload, state[payload]);
        } catch (err) {
            /* eslint-disable */
            console.warn(err);
        }
    }

    if (!sync || sequence.type === 'start' || error) {
        return next(action);
    }

    next(action);

    setTimeout(() => {
        dispatch({
            type: types.SYNC_STATE_TO_STORAGE,
            payload: sync,
        });
    }, 16);
};

```

项目启动的时候，会在src/layouts/app-frame/AppFrame.jsx 中调用 actions.getStateFromStorage(); 方法，将localStorage中的数据同步到state中

actions.getStateFromStorage(); 在 src/actions/utils.js中实现：
```js
// 同步本地数据到state中
export const getStateFromStorage = createAction(types.GET_STATE_FROM_STORAGE, () => {
    return Storage.multiGet(['setting']); // action 中使用sync标记的同时，这里也需要对应的添加，否则无法同不会来
}, (resolved, rejected) => {
    return {
        resolved,
        rejected,
    };
});
```

### 撤销&重做

通过 [redux-undo](https://github.com/omnidan/redux-undo) 可以实现撤销&重做功能
 
通过undoable 对reducer进行包装，就可以实现撤销&重做功能
```
import undoable, {includeAction} from 'redux-undo';

... 

export default undoable(organization, {
    filter: includeAction([types.SET_ORGANIZATION_TREE_DATA]),
    limit: 10,
    undoType: types.UNDO_ORGANIZATION,
    redoType: types.REDO_ORGANIZATION,
});

```

### 页面级别Redux写法
上述action，不仅仅将数据共享，action也进行了共享，对于页面来说如果仅仅需要共享数据，并不需要共享action，可以使用如下写法：
```
// 在具体的jsx页面中定义如下常量：
export const INIT_STATE = {
    scope: 'someUniqueString',
    sync: true,
    a: 3,
    b: 4,
};

```
说明：

1. 如果要使用 actions.setState方法，INIT_STATE，必须定义， 必须定义，必须定义
1. INIT_STATE：初始化state，这个会被脚本抓取，最终生成src/page-init-state.js，两个作用：
    1. 初始化放入store中的state
    1. 可以很明确看出当前页面用到的state结构
    1. scope：用来限制存放在store中的本页面state的作用于，防止页面过多，产生冲突，命名约定：各个级别模块名+文件名，驼峰命名
    1. sync: true 属性，标记当前页面state与localStorage同步，当前页面state变化将自动保存到localStorage中，页面启动时，会把localStorage中数据自动同步到redux中。
1. 使用`this.props.actions.setState(scope, payload)`方法将数据存于store
1. 如果修改当前页面数据，可以直接使用`this.props.actions.setState(payload)`，不必指定scope
1. 修改其他页面数据，则要指定scope，
    ```js
    // 比如UserAdd.jsx页面要修改UserList.jsx页面所用到的state
    this.props.actions.setState('userListPageScope', payload);
    ```
1. store中的state注入本组件：
    ```js
    export function mapStateToProps(state) {
        return {
            ...state.pageState.someUniqueString, // someUniqueString 为当前页面scope
        };
    }
    // 通过this.props获取：
    this.props.a;
    this.props.b

    // 注入多个页面state时，防止冲突，可以用如下写法
    export function mapStateToProps(state) {
        return {
            page1: state.pageState.page1Scope,
            page2: state.pageState.page2Scope,
        };
    }
    // 通过this.props获取：
    this.page1.a;
    this.page2.a;
    ```

## 路由&菜单
做大型应用时，route比较多，写在一个routes.js文件中，一是routes.js会过于庞大，不好维护，二是团队协作时，很容易产生冲突。
因此每个模块的路由，写在自己的模块下(以routes.js命名)，无法在各个模块routes.js中定义的router，统一在`src/routes.js`中定义。
所有的路由最终通过脚本规整到`src/all-routes.js`文件下。

jsx文件头部定义`export const PAGE_ROUTE = '/base-information/business/users';`，可以不必编写`routes.js`文件。但是只是生成如下结构：
```
{
    path: PagesBaseInformationBusinessUserIndex.PAGE_ROUTE,
    asyncComponent: './pages/base-information/business-user/Index',
},
```
如果需要其他路由属性，请在routes.js文件中定义路由，同时页面一定不要写`export const PAGE_ROUTE = ...`，否则路由被定义两遍，会产生意料之外的bug。



- 系统会根据url同步页面下状态：
    - 头部导航选中状态
    - 左侧菜单展开，选中状态
    - 页面头部信息：标题和面包屑导航等

- url需要有统一的约定，方便提取信息
    ```
    初步定为：http[s]://www.xxxx.com/sys-path/menu-path
    sys-path：对应头部导航，确定是哪个系统，确定左侧显示哪组菜单
    menu-path：左侧菜单对应的path，同时跟路由有对应。menu-path可以多级，比如users/lists/...

    子功能通过'+'进行连接，页面菜单，头部导航还是会保持主功能内容，比如：
    主功能为用户查询（path为：/xxx/user/list），用户查询页面左侧是对应菜单的，内部有个添加页面，但是添加用户页面不对应左侧菜单，
    那么添加页面path定义为：/xxx/user/list/+add，菜单、页面标题、面包屑等信息还会基于用户列表自动生成。
    ```
- 后端所有http的get请求，没有被截获的都渲染`index.html`
    ```
    node后端路由配置（routes.js）：
    router.get('*', function (req, res, next) {
        // ajax请求 抛出404,其他请求直接render index.html
        res.render('index.html');
    });
    ```
- 前端所有没截获的path，都渲染Error404组件
    ```javascript
    // src/Router.jsx
    pageRouts.push(
        {
            path: '*',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, connectComponent(require('./layouts/error/Error404')));
                });
            },
        }
    );
    ```
- 页面跳转使用`Link`，或者`this.props.router`相关API，否则会跳出单页面应用
    ```javascript
    import {Link} from 'react-router'
    <Link to="/xxxxx">XXXXX</Link>

    this.props.router.push('/user/add');
    ```

### 前端路由结构规范
*特殊情况，不能按照规范实现，与各位leader商榷*

1. 多单词使用“_”链接，不要使用“-”，或其他特殊字符。
1. 根据菜单结构，定义url结构，RestFull 约定，具体看下面例子。

例如：
```
菜单结构：
系统 # system
    -用户管理 # user
        -添加用户
        -用户列表

对应的菜单为

列表页：
http:localhost:8080/users
详情页 12为id
http:localhost:8080/users/12
添加页
http:localhost:8080/users/new
修改页
http:localhost:8080/users/12/edit
```
菜单结构
```
门店  # store
    -订单 # order 一级
        -外卖订单 # take_out 二级
            -新订单 # new_order 可点击跳转页面
            -所有订单 # all_order 可点击跳转页面
```
对应的菜单为：
```
列表页
http:localhost:8080/store/order/take_out/new_orders
详情页
http:localhost:8080/store/order/take_out/new_orders/12
添加页
http:localhost:8080/store/order/take_out/new_orders/new
修改页
http:localhost:8080/store/order/take_out/new_orders/21/edit
```

#### 菜单数据来源：
左侧菜单数据由后台提供，会包含path，路由前端单独维护，通过path跟菜单（或者Link）关联。登录成功之后，会把菜单数据缓存在sessionStorage中，菜单数据有变动，需要重新登录才能生效。

*注:头部和左侧菜单也可以前端硬编码,根据项目具体需求,具体决定.*

#### 菜单数据结构：
采用扁平化结构，后台存储更具有通用性，前端会有转换函数，转为树状结构。如果后端提供的数据结构字段名无法对应，做一层数据转换，或者修改转换函数。

```javascript
[
    {
        key: 'system',
        parentKey: undefined,
        order: 1,
        icon: 'fa-th-list',
        text: '系统',
        path: undefined,
    },
    {
        key: 'shop', // 跟url有关
        parentKey: undefined,
        order: 1,
        icon: 'fa-th-list',
        text: '顶级菜单1',
        path: undefined, // 如果顶级菜单作为头部导航，这个path是点击之后的跳转。默认获取第一个带有path的子节点，如果获取不到，path='/'
    },
]
```

#### 地址栏与菜单自动关联
点击菜单时(或其他链接)，不需要绑定事件，直接通过Link走路由跳转，地址栏改变后，会触发监听事件，同步头部导航和左侧菜单状态

```javascript
browserHistory.listen(function (data) {
//细节参见 具体代码 src/Routes.jsx
}}
```

## 按需加载
使用按需加载，具体某个模块改动，只会影响到当前模块对应生成的js文件和common.js，不会影响其他生成的文件，可以提高文件的缓存利用率，加速首页加载．

react-router改成如下写法就可以按需加载:
```javascript
{
    path: '/organization/users',
    getComponent: (location, cb) => {
        require.ensure([], (require) => {
            cb(null, connectComponent(require('./user/UserList')));
        });
    },
},
```
*注：按需加载的模块，就不要重复import，否则不会单独生成文件，按需加载会失效。*


## 自定义routes-loader
简化routes.js文件异步获取component写法，自定义了一个routes-loader,源码：`build/routes-loader.js`,作用：
```
* 添加 startFetchingComponent，shouldComponentMount，endFetchingComponent hock，这三个方法来自于 src/utils/route-utils
* 组件使用connectComponent与redux做链接
* asyncComponent: './user/UserList', ===> getComponent: (nextState, cb) => {
                                             startFetchingComponent();
                                             require.ensure([], (require) => {
                                                 if (!shouldComponentMount(nextState)) return;
                                                 endFetchingComponent();
                                                 cb(null, connectComponent(require('./user/UserList')));
                                             });
                                         },
```

## 页面头部设置
默认根据菜单状态自动设置头部
```javascript
// src/Router.jsx 中代码片段
...
componentDidMount() {
    const {actions} = this.props;

    browserHistory.listen(() => {
        ...
        actions.autoSetPageHeaderStatus();
        ...
    });
}
...
```

各个页面可以自定义头部
```javascript
componentWillMount() {
    const {actions} = this.props;
    actions.setPageHeaderStatus({
        hidden: true,
        title: '自定义title', // 缺省不显示
        breadcrumb:[ // 缺省不显示
            {
                icon: '',
                text: '',
                path: '',
            }
        ],
    });
}

```

## 页面过场动画
在`src/Router.jsx`中，为每个route添加了onEnter和onLeave方法（没找到统一方法，只能为每个route添加），通过action，为页面容器app-content设置entered和leaving两个class，通过class使用css3添加过场动画。

## 页面离开提示
一般可以用于编辑页面，当路由切换到其它页面前，如果有未保存内容，提示用户是否放弃保存。
```javascript
...
static contextTypes = {
    router: React.PropTypes.object,
};
...
componentDidMount() {
    const {route} = this.props;
    const {router} = this.context; // If contextTypes is not defined, then context will be an empty object.

    router.setRouteLeaveHook(route, (/* nextLocation */) => {
        // 返回 false 会继续停留当前页面，
        // 否则，返回一个字符串，会显示给用户，让其自己决定
        return '您有未保存的内容，确认要离开？';
    });
}
...
```

## React 组件封装
总结基于redux组件封装的几个注意事项

- 无状态：内部不使用state（不可避免例外），数据全部从props获取，尽量定义无状态组件
- 不发送ajax请求：组件内部不要使用ajax获取数据，数据和loading状态都通过props传入
- 简化接口：优化传入的props，props个数尽量少，props命名语义化
- 合理默认props
- 定义propTypes
- props单个定义，不要使用options之类的对象，封装不相干的props
- 使用`shouldComponentUpdate(nextProps, nextState)`优化组件性能
- 无副作用：组件只处理展示数据，无其他副作用，比如操作Storage等，发送ajx等。
- 不要封装需求多样化的组件，比如列表页的查询条件组件，组合情况太多，条件太复杂，如果封装了，对组件的维护成本较高。或者只做最常用情况的封装。

## 前后端分离
前后端分离，可以使前后端开发独立，各自不用关心对方是如何实现的，项目也可以分开管理

### 前端实现
前端开发过程中会启动一个node express服务器，这个服务器主要有一下作用：

- 提供webpackd evserver功能，加快rebuild速度，提供热刷新，热重载功能等
- 前端请求反向代理到后端服务器，使前端开发过程中就能请求后端真实接口
- 如果后端使用cookie实现session 和 用户登录，使用fetch时，要携带cookie
- `build/config/index.js`中可以单独配置所需的代理,跟后端对接口的时候，可以在`build/config/index.js`文件中配置，代理到后端的开发机器上，方便对接新的口，其他功能可以代理到测试服务器，或者开发服务起上。


### 后端实现
一般不需要任何处理，如果需要，可以区分开发模式或者线上模式，进行处理。

### mock数据
通过promise-ajax发送数据，以'/mock/'开头的请求，将会被mockjs截获，其他请求不会。

## 设计原则

1. 状态，可用不可用等，设计成switch
1. 单选，3（4？）个以内，使用radio，多个使用checkbox

## 坑
- webpack配置，allChunks要设置为true，否则 webpack异步方式加载的组件 样式无法引入 坑！！！
    ```javascript
    new ExtractTextPlugin('[name].css', {
        disable: false,
        allChunks: true // 不设置成true，webpack异步方式加载的组件 样式无法引入 坑！！！
    }),
    ```
- npm run unit 报错 ReferenceError: Can't find variable: webpackJsonp， 原因： unit单元测试，css 不能使用ExtractTextPlugin
- object-assign 是将多个对象合并成一个对象，并没有deepcopy的作用，如果需要deepcopy的场景，要使用deepcopy。

## 相关文档链接
- [react](http://reactjs.cn/)
- [react-native](http://reactnative.cn/)
- [redux](http://cn.redux.js.org/)
- [redux-actions](https://github.com/acdlite/redux-actions)
- [redux-promise](https://github.com/acdlite/redux-promise)
- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [react-router](https://github.com/reactjs/react-router)
- [redux-undo](https://github.com/omnidan/redux-undo)
- [nightwatchjs(端对端测试)](http://nightwatchjs.org/guide#usage)
- [mochajs(单元测试)](http://mochajs.org/)
- [react-test-utils](http://reactjs.cn/react/docs/test-utils.html)
- [karma-runner](http://karma-runner.github.io/0.13/config/configuration-file.html)
- [karma-webpack](ttps://github.com/webpack/karma-webpack)


## TODO
- [ ] webpack 打包速度优化，研究一下dll，关于配置 github上搜索 react webpack，看看其他项目webpack是怎么配置的，项目是如何组织的。
- [x] 端对端测试环境搭建
- [x] 端对端测试写法
- [x] 单元测试环境搭建。
- [x] 单元测试写法。
- [x] 编写一个脚本（手脚架），用来生成 type action service reducer jsx，每次新加功能都要手动创建，比较烦。 *通用性不是很好控制，暂时不做*
- [x] 前后端分离，数据交互问题，crsf问题。*后端dev模式启动时，不启用crsf*
- [x] antd spin 组件消失时，有个500毫秒延迟，不知道官方什么时候能够提示可配置时间
- [ ] 使用electron生成桌面应用
- [x] 角色管理，权限树选中的bug
- [ ] redux 结构，actions全局，actionTypes全局，随着项目模块增多，这两个全局会越来越大，维护起来会不会是个问题？
- [x] 由于异步加载具体页面的js，网路慢情况下，页面切换，会在之前页面停顿很长时间，开速点击切换不同的页面，会出现串页情况（异步引起的。） *路由中加了几个hock*
- [x] 哪些数据需要redux处理，哪些数据不需要redux处理，直接使用组件内部state即可？ *此文档中有介绍*
- [ ] 异步的问题，比如有两个请求，请求1（10ms返回），请求2（5ms返回），操作同一个数据，先点击发起请求1，再马上点击发起请求2，我需要的是请求2的数据，由于请求1比请求2慢，页面会先显示请求2的数据，然后变成请求1的数据了。可以在promise-middleware.js中控制，同一个action，同一时间段只能发起一个请求，其他请求发起的时候，显示"系统繁忙"提示？
- [ ] 样式组件化
- [x] generate-init-state.js，generate-page-route.js，generate-routes.js等相关脚本，watch功能合并，用一个文件generator.js
- [ ] 代码生成
- [x] 请求封装，提供打断功能，提供根据输入，请求远程提示数据功能
- [x] 丰富actions.setState等相关方法，提供删除数据元素、删除对象属性等功能
- [x] 简化前后端联调
- [ ] 较少元素列表页面直接可编辑，提供可编辑表格cell封装，整行可编辑，单独单元格可编辑

- [ ] 非具体项目功能封装成脚手架
    - 构建流程
    - dev build 等命令
    - redux相关封装
    - 路由相关封装
- [ ] 基于antd封装非业务相关组件，项目架构
- [ ] generate-init-state.js，generate-page-route.js，generate-routes.js等相关脚本相关脚本优化，目前的方式，好像页面js按需加载无效，本身js都打包了好像。




