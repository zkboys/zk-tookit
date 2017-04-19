import connectComponent from '/Users/wangshubin/workspace/personal/zk-react/redux/store/connectComponent.js';
import {startFetchingComponent, endFetchingComponent, shouldComponentMount} from '/Users/wangshubin/workspace/personal/zk-react/utils/route-utils';

export default [
    {
        path: '/error/401',
        getComponent: (nextState, cb) => {startFetchingComponent();require.ensure([], (require) => {if (!shouldComponentMount(nextState)) return;endFetchingComponent();cb(null, connectComponent(require('/Users/wangshubin/workspace/personal/zk-react/demo/src/error/Error401')));});},},
    {
        path: '/error/403',
        getComponent: (nextState, cb) => {startFetchingComponent();require.ensure([], (require) => {if (!shouldComponentMount(nextState)) return;endFetchingComponent();cb(null, connectComponent(require('/Users/wangshubin/workspace/personal/zk-react/demo/src/error/Error403')));});},},
    {
        path: '/example/page1',
        getComponent: (nextState, cb) => {startFetchingComponent();require.ensure([], (require) => {if (!shouldComponentMount(nextState)) return;endFetchingComponent();cb(null, connectComponent(require('/Users/wangshubin/workspace/personal/zk-react/demo/src/examples/Page1')));});},},
    {
        path: '/example/sync-tree',
        getComponent: (nextState, cb) => {startFetchingComponent();require.ensure([], (require) => {if (!shouldComponentMount(nextState)) return;endFetchingComponent();cb(null, connectComponent(require('/Users/wangshubin/workspace/personal/zk-react/demo/src/examples/SyncTree')));});},},
    {
        path: '/example/actions-set-state',
        getComponent: (nextState, cb) => {startFetchingComponent();require.ensure([], (require) => {if (!shouldComponentMount(nextState)) return;endFetchingComponent();cb(null, connectComponent(require('/Users/wangshubin/workspace/personal/zk-react/demo/src/examples/actions')));});},},
    {
        path: '/example/promise-ajax',
        getComponent: (nextState, cb) => {startFetchingComponent();require.ensure([], (require) => {if (!shouldComponentMount(nextState)) return;endFetchingComponent();cb(null, connectComponent(require('/Users/wangshubin/workspace/personal/zk-react/demo/src/examples/promise-ajax')));});},},
];
