import React, {Component, PropTypes} from 'react';
import {Menu, Popconfirm} from 'antd';
import {Link} from 'react-router';
import FontIcon from '../../components/font-icon/FontIcon';
import UserAvatar from '../../components/UserAvatar';

class Header extends Component {
    static defaultProps = {
        menus: [],
        collapsed: false,
        user: {
            name: '未登录',
        },
        toggleSideBar() {
        },
        exit() {
        },
    }

    static propTypes = {
        menus: PropTypes.array,
        collapsed: PropTypes.bool,
        user: PropTypes.object,
        toggleSideBar: PropTypes.func,
        exit: PropTypes.func,
    }

    handleExit = () => {
        this.props.exit();
    }

    handleSignOutPopVisibleChange = (visible) => {
        if (visible) {
            // 使弹框固定，不随滚动条滚动
            window.setTimeout(() => {
                const popover = document.querySelector('.ant-popover.ant-popover-placement-bottomRight');
                popover.style.top = '56px';
                popover.style.position = 'fixed';
            }, 0);
        }
    }

    renderMenus = () => {
        return this.props.menus.map((menu) => {
            return (
                <Menu.Item key={menu.key}>
                    <Link to={menu.path}>
                        <FontIcon type={menu.icon}/><span>{menu.text}</span>
                    </Link>
                </Menu.Item>
            );
        });
    }

    render() {
        const {collapsed, toggleSideBar, user, current} = this.props;
        const handleExit = this.handleExit;
        const logoClass = collapsed ? 'collapsed' : '';
        const logo = collapsed ? 'PORTAL' : '统一门户';
        const userName = user ? user.name : '尚未登录';
        return (
            <div className="app-header">
                <div className={`logo ${logoClass}`}>
                    <Link to="/">
                        {logo}
                    </Link>
                </div>
                <a className="app-sidebar-toggle" onClick={toggleSideBar}><FontIcon type="fa-bars"/></a>
                <div className="navigation">
                    <Menu
                        selectedKeys={[current]}
                        mode="horizontal"
                    >
                        {this.renderMenus()}
                    </Menu>
                </div>
                <ul className="menu">
                    <li>
                        <Link to="/system/profile/pass">
                            <UserAvatar className="user-avatar" user={user}/>
                            <span>{userName}</span>
                        </Link>
                    </li>
                    <li>
                        <Popconfirm
                            onVisibleChange={this.handleSignOutPopVisibleChange}
                            placement="bottomRight"
                            title="您确定要退出系统吗？"
                            onConfirm={handleExit}
                        >
                            <a>
                                <FontIcon type="fa-sign-out"/>
                                <span>退出系统</span>
                            </a>
                        </Popconfirm>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;

