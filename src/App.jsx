import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './global.less';
import configureStore from './store/configure-store';
import * as Routers from './Router';
import connectComponent from './utils/connectComponent.js';
// import config from './configs';

// if (config.debug) {
//     require('./mock/index');
// }

const Router = connectComponent(Routers);
const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('main'));
