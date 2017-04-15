import React from 'react';
import {Tabs} from 'antd';
import {Link} from 'react-router';
import FontIcon from '../components/font-icon/FontIcon';
import connectComponent from '../utils/connectComponent';
import PubSub from '../utils/pubsubmsg';
import {getCurrentSidebarMenuByUrl} from '../utils';

const TabPane = Tabs.TabPane;

export class LayoutComponent extends React.Component {

    static defaultProps = {
        active: '',
    }
    state = {
        activeKey: '',
        panes: [],
    }
    onChange = (activeKey) => {
        this.setState({activeKey});
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({panes, activeKey});
    }

    componentWillMount() {
        PubSub.subscribeOnceAcceptOldMsg('app-tabs-change', ({currentPageId, tabs}) => {
            this.setTabs({currentPageId, tabs});
        });
        PubSub.subscribe('app-tabs-change', ({currentPageId, tabs}) => {
            this.setTabs({currentPageId, tabs});
        });
    }

    setTabs({currentPageId, tabs}) {
        const {getMenus} = this.props.actions;
        setTimeout(() => { // 这个timeout 解决 Cannot update during an existing state transition问题
            getMenus({
                resolved: menus => {
                    const panes = [];
                    tabs.forEach(t => {
                        let exist = false;
                        let path = t.path;
                        if (path && path.indexOf('/+') > -1) {
                            path = path.substring(0, path.indexOf('/+'));
                            exist = panes.filter(p => p.path === path);
                        }
                        const menu = getCurrentSidebarMenuByUrl(menus, path);
                        if (menu && !(exist && exist.length)) {
                            let key = t.id;
                            let icon = menu.icon;
                            let text = menu.text;
                            if (key === '_') {
                                path = '/';
                                text = '首页';
                                icon = 'fa-home';
                            }
                            panes.push({
                                icon,
                                text,
                                path,
                                key: t.id,
                            });
                        }
                    });
                    this.setState({
                        panes,
                    });
                    if (location.pathname.indexOf('/+') < 0) {
                        this.setState({
                            activeKey: currentPageId,
                        });
                    }

                    if (location.pathname === '/') {
                        const {actions} = this.props;
                        actions.setPageHeaderStatus({
                            hidden: true,
                        });
                    }
                },
            });
        }, 0);
    }

    render() {
        const {panes, activeKey} = this.state;
        return (
            <div>
                <Tabs
                    hideAdd
                    activeKey={activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                >
                    {panes.map(pane => <TabPane tab={
                        <Link to={pane.path} activeClassName="active">
                            <FontIcon
                                type={pane.icon}
                            />
                            <span>{pane.text}</span>
                        </Link>
                    } key={pane.key}/>)}
                </Tabs>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.app,
    };
}

export default connectComponent({LayoutComponent, mapStateToProps});
