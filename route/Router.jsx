import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import allPageRoutes from '../route/all-routes';
import connectComponent from '../redux/store/connectComponent.js';
import pageRoutes from '../route/page-routes';
import config from '../config';

export default class extends Component {
    constructor(props) {
        super(props);
        const allRoutes = allPageRoutes.concat(pageRoutes);
        // 所有未截获请求，渲染Error404组件
        allRoutes.push(
            {
                path: '*',
                getComponent: (location, cb) => {
                    require.ensure([], (require) => {
                        cb(null, connectComponent(require(config.router.error404PagePath)));
                    });
                },
            }
        );

        // 没找到统一的enter 和 leave回调，这里只能为每个route都添加
        allRoutes.forEach(r => {
            const oriOnEnter = r.onEnter;
            const oriOnLeave = r.onLeave;

            r.onEnter = (nextState, replace, callback) => {
                this.onEnter(nextState, replace, callback, oriOnEnter);
            };
            r.onLeave = (prevState) => {
                this.onLeave(prevState, oriOnLeave);
            };
        });

        this.routes = {
            path: '/',
            component: connectComponent(require(config.router.frameComponentPath)),
            indexRoute: {
                component: connectComponent(require(config.router.homePagePath)),
                onEnter: this.onEnter,
                onLeave: this.onLeave,
            },
            childRoutes: allRoutes,
        };

        browserHistory.listen((...args) => {
            if (config.router.historyListen) {
                config.router.historyListen(...args);
            }
        });
    }


    onLeave = (prevState, oriOnLeave) => {
        const {
            onLeave = () => {
            },
        } = config.router;
        onLeave(prevState);

        if (oriOnLeave) {
            oriOnLeave(prevState);
        }
    }

    onEnter = (nextState, replace, callback, oriOnEnter) => {
        const {
            onEnter = () => {
            },
        } = config.router;
        onEnter(nextState, replace, callback);

        if (oriOnEnter) {
            oriOnEnter(nextState, replace, callback);
        } else {
            const scrollDom = document.documentElement || document.body;
            scrollDom.scrollTop = 0;
            callback();
        }
    }

    // 这里可以注入通用props
    createElement = (RouteComponent, props) => {
        return (
            <RouteComponent {...props}/>
        );
    }

    componentDidMount() {
        const {
            onRouterDidMount = () => {
            },
        } = config.router;
        onRouterDidMount();
    }

    render() {
        return (
            <Router
                routes={this.routes}
                history={browserHistory}
                createElement={this.createElement}
            />
        );
    }
}
