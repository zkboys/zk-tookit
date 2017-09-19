import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * 根据用户信息（name loginName avatar）获取用户头像
 * 如果avatar存在，返回img头像
 * 如果avatar不存在，返回（name||loginName）[0] 待背景颜色的span（只有背景色，无其他样式）
 */
export default class UserAvatar extends Component {
    static defaultProps = {
        className: 'user-avatar',
        user: {
            name: '匿名',
            loginName: 'no name',
            avatar: '',
        },
    };
    // TODO 修改为 className text url
    static propTypes = {
        className: PropTypes.string,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            loginName: PropTypes.string,
            avatar: PropTypes.string,
        }),
    };

    getCurrentLoginUserAvatar() {
        const user = this.props.user;
        if (!user) {
            const backgroundColor = 'rgb(80, 193, 233)';
            return <span className={this.props.className} style={{backgroundColor}}>?</span>;
        }
        const userName = user.name || user.loginName;
        const avatar = user.avatar;
        if (avatar) {
            return <img className={this.props.className} src={avatar} alt="用户头像"/>;
        }
        const userNameFirstChar = userName[0];
        const colors = [
            'rgb(80, 193, 233)',
            'rgb(255, 190, 26)',
            'rgb(228, 38, 146)',
            'rgb(169, 109, 243)',
            'rgb(253, 117, 80)',
            'rgb(103, 197, 12)',
            'rgb(80, 193, 233)',
            'rgb(103, 197, 12)',
        ];
        const backgroundColor = colors[userNameFirstChar.charCodeAt(0) % colors.length];
        return <span className={this.props.className} style={{backgroundColor}}>{userName[0]}</span>;
    }

    render() {
        return this.getCurrentLoginUserAvatar();
    }
}
