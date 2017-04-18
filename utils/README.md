# 非业务相关的工具方法

## promise-ajax
> 基于[axios](https://github.com/mzabriskie/axios)进行封装的ajax工具

### 引用：
```
import * as promiseAjax from 'zk-react/utils/promise-ajax';
```

### 初始化：
> 在项目启动时，进行初始化配置，一般是项目入口文件中
```
promiseAjax.init({
    setOptions(instance, isMock) {},
    onShowErrorTip(err, showErrorTip) {},
    onShowSuccessTip(response, showSuccessTip) {},
    isMock(url, data, method, options) (),
})
```

### 使用：
> 默认提供了`get`、`post`、`put`、`patch`、`del`、`singleGet`
```

```