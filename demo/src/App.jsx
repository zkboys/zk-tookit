import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {configureStore, Router, initRouter, initActions, initReducers} from 'zk-react';
import * as demoAction from './actions/demo';
import demo from './reducers/demo';
import './global.less';
import * as Error404 from './error/Error404';
import * as Frame from './Frame';
import Home from './Home';

initRouter({
    Error404,
    Frame,
    Home,
    historyListen: () => {
    },
    onLeave: () => {
    },
    onEnter: () => {
    },
    onRouterDidMount: () => {
    },
});

initActions({demoAction});
initReducers({demo});

const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('main'));
