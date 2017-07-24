import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Popconfirm} from 'antd';
import PopPrompt from '../pop-prompt/PopPrompt';

/**
 * 操作封装，一般用于表格最后的操作列中
 */
export default class Operator extends Component {
    static defaultProps = {
        items: [],
        hasPermission(/* permissionCode */) {
            return true;
        },
    }
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            onClick: PropTypes.func,
            label: PropTypes.isRequired,
            color: PropTypes.string,
            permission: PropTypes.string,
            loading: PropTypes.bool,
            confirm: PropTypes.object,
        })),
        hasPermission: PropTypes.func,
    };

    loadingIcon = <Icon type="loading"/>;

    label = {};

    render() {
        const {items, hasPermission} = this.props;
        let operators = [];

        items.forEach((opt, i) => {
            const {
                permission,
                loading,
                onClick,
                color,
                confirm,
                type,
            } = opt;

            let label = opt.label;
            let hasPer = true;

            if (loading) {
                const labelWidth = this.label[i].offsetWidth;
                label = <span style={{display: 'inline-block', width: labelWidth, textAlign: 'center'}}>{this.loadingIcon}</span>;
            } else {
                const labelStyle = {};
                if (color) {
                    labelStyle.color = color;
                }
                label = <span style={labelStyle} ref={v => this.label[i] = v}>{label}</span>;
            }

            if (permission) {
                hasPer = hasPermission(permission);
            } else {
                hasPer = true;
            }

            if (hasPer) {
                if (confirm) {
                    operators.push(
                        <Popconfirm {...confirm}>
                            <a>{label}</a>
                        </Popconfirm>
                    );
                } else if (type === 'prompt') {
                    const {
                        title,
                        okText,
                        cancelText,
                        onCancel,
                        onConfirm,
                        inputProps,
                        decorator,
                    } = opt;
                    operators.push(
                        <PopPrompt
                            title={title}
                            okText={okText}
                            cancelText={cancelText}
                            onCancel={onCancel}
                            onConfirm={onConfirm}
                            inputProps={inputProps}
                            decorator={decorator}
                        >
                            <a>{label}</a>
                        </PopPrompt>
                    )
                    ;
                } else {
                    operators.push(<a onClick={onClick}>{label}</a>);
                }
            }
        });

        const operatorsLength = operators.length;

        if (!operatorsLength) {
            return <span>无操作权限</span>;
        }

        return (
            <span>
                {operators.map((v, i) => {
                    return (
                        <span key={`operator-${i}`}>
                            {v}
                            {operatorsLength === i + 1 ? '' : <span className="ant-divider"/>}
                        </span>
                    );
                })}
            </span>
        );
    }
}
