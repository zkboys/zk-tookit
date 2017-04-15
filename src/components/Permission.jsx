import React, {Component, PropTypes} from 'react';
import {hasPermission} from '../commons/permission';

class Permission extends Component {
    static defaultProps = {}
    static propTypes = {
        code: PropTypes.string.isRequired,
    };

    render() {
        const {code, className = ''} = this.props;
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
