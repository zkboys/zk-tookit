import React, {Component, PropTypes} from 'react';

/**
 * 根据hasPermission 和code 来判断children是否显示
 * 一般用于前端权限控制是否显示某个按钮等
 */
export default class Permission extends Component {
    static defaultProps = {};
    static propTypes = {
        code: PropTypes.string.isRequired,
        hasPermission: PropTypes.func.isRequired,
    };

    render() {
        const {code, hasPermission} = this.props;
        if (hasPermission(code)) {
            const props = {...this.props};
            Reflect.deleteProperty(props, 'code');
            Reflect.deleteProperty(props, 'hasPermission');
            return (
                <span {...props}>
                    {this.props.children}
                </span>
            );
        }
        return null;
    }
}
