import React from 'react';

class UserAvatar extends React.Component {
    static defaultProps = {
        className: 'user-avatar',
    }

    getCurrentLoginUserAvatar() {
        const user = this.props.user;
        if (!user) {
            const backgroundColor = 'rgb(80, 193, 233)';
            return <span className={this.props.className} style={{backgroundColor}}>?</span>;
        }
        const userName = user.name || user.loginname;
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
export default UserAvatar;
