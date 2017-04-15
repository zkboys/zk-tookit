import 'antd/dist/antd.css';
import classNames from 'classnames';
import React, {Component} from 'react';
import {message, Spin} from 'antd';
import './style.less';
import SideBar from './SideBar';
import Header from './Header';
import PageHeader from './PageHeader';
import PubSubMsg from '../../../utils/pubsubmsg';
import connectComponent from '../../../redux/store/connectComponent.js';
import * as _AppContent from './AppContent';

const AppContent = connectComponent(_AppContent);

export class LayoutComponent extends Component {
    state = {
        loading: false,
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.toast.id !== nextProps.toast.id) {
            const {text, type} = nextProps.toast;

            if (type === 'error') {
                message.error(text);
            } else if (type === 'success') {
                message.success(text);
            } else {
                message.warning(text);
            }
        }
    }

    showLoading = 0;

    componentWillMount() {
        const {actions} = this.props;
        PubSubMsg.subscribe('start-fetching-component', () => {
            this.showLoading = setTimeout(() => {
                this.setState({
                    loading: true,
                });
            }, 10); // 给10ms时间，过滤掉从缓存中获取js的情况
        });
        PubSubMsg.subscribe('end-fetching-component', () => {
            actions.setPageStatus('entered');
            // 没有显示loading就不显示，页面js已经加载之后就不存在异步了。
            clearTimeout(this.showLoading);
            this.setState({
                loading: false,
            });
        });
    }

    componentDidMount() {
        const {actions} = this.props;

        actions.getMenus({fromServer: true}); // 从服务器获取菜单数据
        actions.getCurrentUser();
        actions.getStateFromStorage();
    }

    render() {
        const {
            isSidebarCollapsed,
            currentHeaderKey,
            sideBarHidden,
            headerMenus,
            user,
            sideBarMenus,
            openKeys,
            selectedKeys,
            children,
            pageHeader,
            pageHeaderFixed,
            pageStatus,
            pageAnimationType,
        } = this.props;

        const {
            logout,
            toggleSideBar,
        } = this.props.actions;

        const pageHeaderClassName = classNames({
            full: sideBarHidden,
            fixed: true,
            collapsed: isSidebarCollapsed,
            [pageStatus]: true,
            [pageAnimationType]: true,
        });

        const loadingComponentClassName = classNames({
            'loading-component': true,
            collapsed: isSidebarCollapsed,
            full: sideBarHidden,
            show: this.state.loading,
        });

        return (
            <div id="app-frame">
                <Header
                    collapsed={isSidebarCollapsed}
                    exit={logout}
                    menus={headerMenus}
                    current={currentHeaderKey}
                    user={user}
                    toggleSideBar={toggleSideBar}
                />
                <SideBar
                    menus={sideBarMenus}
                    collapsed={isSidebarCollapsed}
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    hidden={sideBarHidden}
                />
                {
                    // 元素使用了transform 内部元素 display:fixed 将失效 (chrome, opera)
                    // 防止启用动画时 app-content 会添加transform属性, pageHeader 固定失效，这里需要将 PageHeader提出来
                    pageHeaderFixed ?
                        <PageHeader
                            className={pageHeaderClassName}
                            hidden={pageHeader.hidden}
                            title={pageHeader.title}
                            breadcrumb={pageHeader.breadcrumb}
                        />
                        :
                        null
                }
                <AppContent>
                    {
                        !pageHeaderFixed ?
                            <PageHeader
                                hidden={pageHeader.hidden}
                                title={pageHeader.title}
                                breadcrumb={pageHeader.breadcrumb}
                            />
                            :
                            null
                    }
                    <div id="app-frame-page">
                        {children}
                    </div>
                </AppContent>
                <div className={loadingComponentClassName}>
                    <Spin spinning size="large"/>
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.setting,
        ...state.utils,
    };
}
