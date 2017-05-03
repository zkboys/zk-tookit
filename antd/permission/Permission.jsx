import React, {Component, PropTypes} from 'react';

class Permission extends Component {
    static defaultProps = {}
    static propTypes = {
        code: PropTypes.string.isRequired,
        hasPermission: PropTypes.func.isRequired,
    };

    render() {
        const {code, className = '', hasPermission} = this.props;
        if (hasPermission(code)) {
            return (
                <span className={className}>
                    {this.props.children}
                </span>
            );
        }
        return null;
    }
}
export default Permission;
