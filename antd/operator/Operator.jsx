import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Popconfirm, Dropdown, Menu} from 'antd';
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
        moreWidth: 'auto',
        moreTrigger: ['click'],
    };

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.isRequired,
            color: PropTypes.string,
            permission: PropTypes.string,
            loading: PropTypes.bool,

            onClick: PropTypes.func,
            confirm: PropTypes.object,
        })),
        hasPermission: PropTypes.func,
        moreWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        moreTrigger: PropTypes.array,
    };

    loadingIcon = <Icon type="loading"/>;

    label = {};

    getLabel = (opt, i) => {
        let {
            label,
            loading,
            color,
        } = opt;

        if (loading) {
            const labelWidth = this.label[i] ? this.label[i].offsetWidth : 'auto';
            label = <span style={{display: 'inline-block', width: labelWidth, textAlign: 'center'}}>{this.loadingIcon}</span>;
        } else {
            const labelStyle = {};
            if (color) {
                labelStyle.color = color;
            }
            label = <span style={labelStyle} ref={v => this.label[i] = v}>{label}</span>;
        }
        return label;
    };

    getConfirm = (opt, i) => {
        let label = this.getLabel(opt, i);
        const {confirm} = opt;
        /*
         * 如果含有confirm属性，即表明是Popconfirm，
         * confirm作为Popconfirm的props
         *
         * 其他元素同理
         * */
        return (
            <Popconfirm {...confirm}>
                <a>{label}</a>
            </Popconfirm>
        );
    };

    getPrompt = (opt, i) => {
        let label = this.getLabel(opt, i);
        const {prompt} = opt;
        return (
            <PopPrompt {...prompt}>
                <a>{label}</a>
            </PopPrompt>
        );
    };

    getText = (opt, i) => {
        let label = this.getLabel(opt, i);
        const {onClick} = opt;

        if (opt.label.type === 'a') return <span onClick={onClick}>{label}</span>;

        return <a onClick={onClick}>{label}</a>;
    };

    getItem = (opt, i) => {
        const {hasPermission} = this.props;
        const {
            permission,
            confirm,
            prompt,
        } = opt;

        let hasPer = permission ? hasPermission(permission) : true;

        if (hasPer) {
            if (confirm) return this.getConfirm(opt, i);

            if (prompt) return this.getPrompt(opt, i);

            return this.getText(opt, i);
        }
        return null;
    };

    render() {
        const {items, moreWidth, moreTrigger} = this.props;
        let operators = [];
        let more = [];

        items.forEach((opt, i) => {
            const {isMore} = opt;
            const item = this.getItem(opt, i);

            if (item) {
                if (isMore) {
                    more.push(item);
                } else {
                    operators.push(item);
                }
            }
        });

        if (more && more.length) { // 更多
            const menu = (
                <Menu style={{width: moreWidth}}>
                    {
                        more.map((item, index) => <Menu.Item key={index}>{item}</Menu.Item>)
                    }
                </Menu>
            );
            operators.push(
                <Dropdown overlay={menu} trigger={moreTrigger}>
                    <a className="ant-dropdown-link">
                        更多 <Icon type="down"/>
                    </a>
                </Dropdown>
            );
        }

        const operatorsLength = operators.length;

        if (!operatorsLength) {
            return <span>无操作权限</span>;
        }
        return (
            <span>
                {operators.map((v, i) => (
                    <span key={`operator-${i}`}>
                        {v}
                        {operatorsLength === i + 1 ? '' : <span className="ant-divider"/>}
                    </span>
                ))}
            </span>
        );
    }
}
