import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from 'zk-react/redux/store/index';
import Router, {initRouter} from 'zk-react/route/Router.jsx';
import './global.less';
import * as Error404 from './error/Error404';
import Frame from './Frame';
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
function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('main'));
