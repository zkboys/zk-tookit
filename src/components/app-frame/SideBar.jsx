import React, {Component, PropTypes} from 'react';
import {Menu} from 'antd';
import {Link} from 'react-router';
import {getScrollBarWidth} from '../../utils/index';
import FontIcon from '../../components/font-icon/FontIcon';

const SubMenu = Menu.SubMenu;

class NavBar extends Component {
    state = {
        openKeys: [],
    }

    static defaultProps = {
        menus: [],
        collapsed: false,
        openKeys: [],
        selectedKeys: '',
        hidden: false,
    }

    static propTypes = {
        menus: PropTypes.array,
        collapsed: PropTypes.bool,
        openKeys: PropTypes.array,
        selectedKeys: PropTypes.string,
        hidden: PropTypes.bool,
    }

    onToggle = (info) => {
        this.setState({
            // openKeys: info.open ? info.keyPath : info.keyPath.slice(1), // 同时关闭其他
            openKeys: info.openKeys,
        });
    }

    getMenuJsx = (node) => {
        const min = this.props.collapsed;
        const key = node.key;
        const path = node.path;
        const icon = node.icon;
        const text = node.text;
        if (node.children) {
            return (
                <SubMenu key={key} title={<span><FontIcon type={icon}/><span>{text}</span></span>}>
                    {node.children.map(this.getMenuJsx)}
                </SubMenu>
            );
        }
        let item = (
            <Link to={path} activeClassName="active">
                <FontIcon
                    type={icon}
                />
                <span>{text}</span>
            </Link>
        );
        if (min && node.parentKeys.length === 1) { // FIXME 这个判断有些不好。
            item = (
                <Link to={path} activeClassName="active">
                    <FontIcon
                        type={icon}
                    />
                    <span>{text}</span>
                </Link>
            );
        }
        return (
            <Menu.Item key={key}>
                {item}
            </Menu.Item>
        );
    }

    renderMenus = () => {
        return this.props.menus.map(this.getMenuJsx);
    }

    render() {
        let {collapsed, openKeys, selectedKeys, hidden} = this.props;
        const width = collapsed ? 60 : 200;
        const innerWidth = collapsed ? 60 : width + getScrollBarWidth();
        let collapsedClass = collapsed ? 'collapsed' : '';
        const sidebarMode = collapsed ? 'vertical' : 'inline';

        if (this.state.openKeys && this.state.openKeys.length) {
            openKeys = this.state.openKeys;
        }
        if (hidden) {
            collapsedClass += ' hidden';
        }
        return (
            <div className={`app-sidebar ${collapsedClass}`} style={{width}}>
                <div className={`app-sidebar-inner ${collapsedClass}`} style={{width: innerWidth}}>
                    {/* 不同模式的菜单要区分开写，否则互相干扰 */}
                    <Menu
                        style={{display: sidebarMode === 'inline' && !hidden ? 'block' : 'none'}}
                        openKeys={openKeys}
                        selectedKeys={[selectedKeys]}
                        onOpenChange={this.onToggle}
                        mode={sidebarMode}
                    >
                        {this.renderMenus()}
                    </Menu>
                    <Menu
                        style={{display: sidebarMode === 'vertical' && !hidden ? 'block' : 'none'}}
                        selectedKeys={[selectedKeys]}
                        mode={sidebarMode}
                    >
                        {this.renderMenus()}
                    </Menu>


                </div>
            </div>
        );
    }
}

export default NavBar;
