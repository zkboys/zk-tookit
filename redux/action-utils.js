import {createAction} from 'redux-actions';
import * as Storage from 'zk-tookit/utils/storage';
import * as types from './action-types';

export default function ({pageInitState, syncKeys}) {
    return {
        // 同步本地数据到state中，一般在项目启动时，会调用此action进行同步。各个模块的reducer要对应的函数处理同步逻辑
        getStateFromStorage: createAction(types.GET_STATE_FROM_STORAGE, () => {
            let keys = syncKeys;
            if (pageInitState) {
                keys = keys.concat(Object.keys(pageInitState).map(key => {
                    if (pageInitState[key] && pageInitState[key].sync === true) {
                        return key;
                    }
                    return null;
                }));
            }
            return Storage.multiGet(keys);
        }, (resolved, rejected) => {
            return {
                resolved,
                rejected,
            };
        }),
    };
}
