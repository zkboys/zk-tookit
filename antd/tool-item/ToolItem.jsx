import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import {FontIcon} from 'zk-tookit/antd';


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
                            type = 'primary',
                            icon,
                            text,
                            permission,
                            component,
                            getComponent,
                            onClick = () => {
                            },
                        } = item;
                        if (permission && !hasPermission(permission)) return null;
                        if (getComponent) return <span key={index}>{getComponent()}</span>;
                        if (component) return <span key={index}>{component}</span>;
                        return (
                            <Button key={index} type={type} onClick={onClick}>
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
