import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import {FontIcon} from 'zk-tookit/antd';
import './style.less';

export default class ToolItem extends Component {
    static defaultProps = {
        toolItems: [],
        hasPermission: () => true,
    };

    static propTypes = {
        toolItems: PropTypes.array,
        hasPermission: PropTypes.func,
    };

    state = {};

    componentDidMount() {

    }

    render() {
        const {items, hasPermission} = this.props;
        return (
            <div>
                {
                    items.map((item, index) => {
                        const {
                            key,
                            type = 'primary',
                            icon,
                            text,
                            permission,
                            component,
                            getComponent,
                            onClick = () => {
                            },
                        } = item;
                        const itemKey = key || index;
                        if (permission && !hasPermission(permission)) return null;
                        if (getComponent) return <span className="zk-tookit-tool-item" key={itemKey}>{getComponent()}</span>;
                        if (component) return <span className="zk-tookit-tool-item" key={itemKey}>{component}</span>;
                        return (
                            <Button
                                className="zk-tookit-tool-item"
                                key={itemKey}
                                type={type}
                                onClick={onClick}
                            >
                                {
                                    icon ?
                                        <FontIcon type={icon} style={{marginRight: 8}}/>
                                        : null
                                }
                                {text}
                            </Button>
                        );
                    })
                }
            </div>
        );
    }
}
