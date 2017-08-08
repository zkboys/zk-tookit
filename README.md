# 基于React项目的通用封装
> 平时项目中提取一些公共功能，便于各个项目之间公用，统一维护

## 文件说明
```
.
├── antd // 基于 antd 封装的组件
├── react // react相关的封装，高级组件等
├── docs // 文档
├── redux // redux的一些封装
├── utils // 通用的一些工具方法

```

## 调试zk-tookit

1. 将zk-tookit 放入zk-react-template-management项目中
1. 在zk-tookit文件文件夹中执行 yarn link
1. 在 zk-react-template-management 中执行 yarn link zk-tookit

即可建立连接，方便调试

## TODO
- [x] 构建优化，目前无论开发还是线上构建都太慢了，文件稍微多点（十几个？）慢点影响开发。
- [ ] 文档整理，组件、通用方法的问当整理
- [ ] 重构ajax相关封装，整理成类实现，可以创建多个实例。