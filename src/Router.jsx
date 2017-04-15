import React, {Component} from 'react';
import {Router, browserHistory, RouterContext} from 'react-router';
import allPageRoutes from '../route/all-routes';
import * as AppFrame from './components/app-frame/AppFrame';
import * as Home from './pages/home/Home';
import connectComponent from '../redux/store/connectComponent.js';
import * as Utils from '../utils';
import PubSub from '../utils/pubsubmsg.js';
import pageRoutes from '../route/page-routes';
import {isLogin, toLogin} from './commons/index';

export class LayoutComponent extends Component {
    constructor(props) {
        super(props);
        const allRoutes = allPageRoutes.concat(pageRoutes);
        // 所有未截获请求，渲染Error404组件
        allRoutes.push(
            {
                path: '*',
                getComponent: (location, cb) => {
                    require.ensure([], (require) => {
                        cb(null, connectComponent(require('./pages/error/Error404')));
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
            component: connectComponent(AppFrame),
            indexRoute: {
                component: connectComponent(Home),
                onEnter: this.onEnter,
                onLeave: this.onLeave,
            },
            childRoutes: allRoutes,
        };

        browserHistory.listen(this.setPageStatus);
    }

    setPageStatus = () => {
        const {actions, usePageWitchAnimation} = this.props;

        actions.autoSetSideBarStatus();
        actions.autoSetHeaderMenuStatus();
        actions.getMenus();

        if (!usePageWitchAnimation) {
            actions.autoSetPageHeaderStatus();
        }
    }

    onLeave = (prevState, oriOnLeave) => {
        const {usePageWitchAnimation, actions, randomPageAnimation} = this.props;

        if (usePageWitchAnimation) {
            if (randomPageAnimation) {
                const pageAnimationTypes = ['up', 'down', 'left', 'right', 'fade'];
                const random = Utils.getRandomNum(0, 4);
                const pageAnimationType = pageAnimationTypes[random];
                actions.setSettings({pageAnimationType});
            }

            actions.setPageStatus('leaving');
        }

        if (oriOnLeave) {
            oriOnLeave(prevState);
        }
    }

    onEnter = (nextState, replace, callback, oriOnEnter) => {
        if (!isLogin()) {
            return toLogin();
        }

        const {usePageWitchAnimation, actions} = this.props;
        const switchDuring = 150;

        const scrollDom = document.documentElement || document.body;

        if (usePageWitchAnimation) {
            setTimeout(() => {
                actions.autoSetPageHeaderStatus();

                setTimeout(() => {
                    actions.setPageStatus('entered');
                }, switchDuring);

                if (oriOnEnter) {
                    oriOnEnter(nextState, replace, callback);
                } else {
                    scrollDom.scrollTop = 0;
                    callback();
                }
            }, switchDuring);
            return;
        }

        if (oriOnEnter) {
            oriOnEnter(nextState, replace, callback);
        } else {
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
        this.setPageStatus(); // 由于browserHistory.listen首次页面进入不触发，这里需要调用一次，处理页面菜单等选中状态
    }

    pages = {};

    render() {
        const {
            isSidebarCollapsed,
        } = this.props;
        return (
            <Router
                routes={this.routes}
                history={browserHistory}
                createElement={this.createElement}
                render2={props => {
                    function isAppFrame(dom) {
                        return dom && dom.firstChild.getAttribute('id') === 'app-frame';
                    }

                    function hideAppFramePage() {
                        document.getElementById('app-frame-page').style.display = 'none';
                    }

                    function showAppFramePage() {
                        document.getElementById('app-frame-page').style.display = 'block';
                    }

                    function switchPage(currentPageId, pages) {
                        const tabs = [];
                        Object.keys(pages).forEach((id) => {
                            const page = pages[id];
                            const dom = page.dom;
                            if (currentPageId === id) {
                                if (isAppFrame(dom)) {
                                    showAppFramePage();
                                } else if (dom) {
                                    dom.style.display = 'block';
                                }
                            }
                            if (currentPageId !== id) {
                                if (isAppFrame(dom)) {
                                    hideAppFramePage();
                                } else if (dom) {
                                    dom.style.display = 'none';
                                }
                            }
                            if (isSidebarCollapsed) {
                                Utils.addClass(`#${id}`, 'collapsed');
                            } else {
                                Utils.removeClass(`#${id}`, 'collapsed');
                            }
                            tabs.push({
                                id,
                                path: page.path,
                            });
                        });
                        PubSub.publish('app-tabs-change', {currentPageId, tabs});
                    }

                    const components = props.components;
                    const routes = props.routes;
                    const tabPageId = routes.map(r => r.path).join('').replace(/\//g, '_');
                    const path = routes.map(r => {
                        if (r.path === '/') {
                            return '';
                        }
                        return r.path;
                    }).join('');

                    const appFrame = document.getElementById('app-frame');
                    if (appFrame) {
                        props.components = [components[1]];
                    }

                    let page = this.pages[tabPageId];
                    let className = appFrame ? 'app-content page-header-fixed right' : '';
                    className += isSidebarCollapsed ? ' collapsed' : '';
                    if (!page) {
                        page = this.pages[tabPageId] = {};
                        page.path = path;
                        page.component = (
                            <div
                                ref={view => this.pages[tabPageId].dom = view}
                                id={tabPageId}
                                className={className}
                                key={tabPageId}
                            >
                                <RouterContext {...props} />
                            </div>
                        );
                    }
                    switchPage(tabPageId, this.pages);
                    const tabPages = Object.keys(this.pages).map(id => this.pages[id].component);
                    return (
                        <div>
                            {tabPages}
                        </div>
                    );
                }}
            />
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.setting,
    };
}
