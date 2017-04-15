/*
 * 自定义路由loader
 * 添加 startFetchingComponent，shouldComponentMount，endFetchingComponent hock，这三个方法来自于 src/utils/route-utils
 * 组件使用connectComponent与redux做链接
 * asyncComponent: './user/UserList',
 * ===>
 * getComponent: (nextState, cb) => {
 *     startFetchingComponent();
 *     require.ensure([], (require) => {
 *         if (!shouldComponentMount(nextState)) return;
 *         endFetchingComponent();
 *         cb(null, connectComponent(require('./user/UserList')));
 *     });
 * },
 * */
function getComponentString(componentPath) {
    return "getComponent: (nextState, cb) => {"
        + "startFetchingComponent();"
        + "require.ensure([], (require) => {"
        + "if (!shouldComponentMount(nextState)) return;"
        + "endFetchingComponent();"
        + "cb(null, connectComponent(require('" + componentPath + "')));"
        + "});"
        + "},";
}

module.exports = function (source, other) {
    this.cacheable();
    var routesStrTemp = source;
    var patt = /asyncComponent:[ ]*['"]([^'"]+)['"][,]/gm;
    var isRoutes = false;
    var block = null;
    while ((block = patt.exec(source)) !== null) {
        isRoutes = block[0] && block[1];
        if (isRoutes) {
            routesStrTemp = routesStrTemp.replace(block[0], getComponentString(block[1]));
        }
    }
    if (isRoutes) {
        routesStrTemp = "import connectComponent from 'src/utils/connectComponent.js';\n"
            + "import {startFetchingComponent, endFetchingComponent, shouldComponentMount} from 'src/utils/route-utils';"
            + routesStrTemp;
        this.callback(null, routesStrTemp, other);
    } else {
        this.callback(null, source, other);
    }
};