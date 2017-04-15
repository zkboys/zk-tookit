import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './global.less';
import configureStore from '../redux/store/configure-store';
import * as Routers from './Router';
import connectComponent from '../redux/store/connectComponent.js';

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
