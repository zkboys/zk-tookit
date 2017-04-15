import * as utils from './utils';
import * as app from './app';
import * as page from './page';

const actions = {
    page,
    app,
    utils,
};
const actionsFunctions = {};

// 检测是否有同名action
// 由于所有action方法最终会合并到this.props.actions中
// 如果有同名方法，将会出现覆盖情况
for (let key of Object.keys(actions)) {
    const action = actions[key];
    for (let k of Object.keys(action)) {
        if (actionsFunctions[k]) {
            throw Error(`不予许定义同名的action方法：${key}.${k} 与 ${actionsFunctions[k]._module}.${k} 方法冲突！`);
        } else {
            actionsFunctions[k] = action[k];
            actionsFunctions[k]._module = key;
        }
    }
}

export default actionsFunctions;
