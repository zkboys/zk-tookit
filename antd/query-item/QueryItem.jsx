/**
 *
 * 查询条件封装，通过传入items即可生成查询条件form表单；
 * @see module:antd/form-utils
 *
 * @param {Object[]} items 查询条件各个项，各项具体参数请参考：{@link module:antd/form-utils}
 * @param {Boolean} [showSearchButton = true] 是否显示查询按钮
 * @param {Boolean} [showResetButton = true] 是否显示重置按钮
 * @param {String | jsx} [searchButtonText = 查询] 查询按钮文案，可以是string 或者 jsx
 * @param {String | jsx} [resetButtonText = 查询] 重置按钮文案，可以是string 或者 jsx
 * @param {Object} [outerForm] 外部提供的form对象，如果未提供，组件将使用内部自己的form；
 * 使用外部提供的form可以使用form的api对组件进行各种操作，适用于比较复杂的需求场景
 * @param {Function} [onSubmit] 点击提交按钮触发的回调
 *
 * @example
 *
 * <QueryItem
 *      items={[
 *          {type: 'input', filed: 'name'},
 *          {type: 'number', filed: 'age'},
 *      ]}
 * />
 *
 * @module antd/QueryItem 查询条件
 * */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button} from 'antd';
import {getFormItem} from '../form-util/form-utils';

class QueryItem extends Component {
    constructor(props) {
        super(props);
        const {outerForm, form} = props;
        if (outerForm) {
            this.form = outerForm;
        } else {
            this.form = form;
        }
    }

    static defaultProps = {
        items: [],
        showSearchButton: true,
        showResetButton: true,
        searchButtonText: '查询',
        resetButtonText: '重置',
        onSubmit: () => true,
    };
    static propTypes = {
        items: PropTypes.array.isRequired,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        searchButtonText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        resetButtonText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        outerForm: PropTypes.object,
        onSubmit: PropTypes.func,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {onSubmit} = this.props;
        this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // TODO values中的日期，moment转换为str格式
                onSubmit(values);
            }
        });
    };

    render() {
        const {
            items,
            showSearchButton,
            showResetButton,
            searchButtonText,
            resetButtonText,
        } = this.props;
        const form = this.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                {
                    /*
                     * items 中元素为数组，则数组中所有表单元素占一行
                     *       如果不是数组，则独自占一行
                     * 查询按钮，拼接到最后一行
                     * */
                    items.map((data, index) => {
                        if (!Array.isArray(data)) {
                            data = [data];
                        }
                        return (
                            <div key={index}>
                                {
                                    data.map(item => {
                                        return getFormItem({float: true, ...item}, form);
                                    })
                                }
                                {
                                    index === items.length - 1 && (showSearchButton || showResetButton) ?
                                        <div>
                                            {
                                                showSearchButton ?
                                                    <Button
                                                        style={{marginLeft: 8, marginBottom: 16}}
                                                        type="primary"
                                                        size="large"
                                                        htmlType="submit"
                                                    >
                                                        {searchButtonText}
                                                    </Button>
                                                    : null
                                            }
                                            {
                                                showResetButton ?
                                                    <Button
                                                        style={{marginLeft: 8, marginBottom: 16}}
                                                        type="ghost"
                                                        size="large"
                                                        onClick={() => this.form.resetFields()}
                                                    >
                                                        {resetButtonText}
                                                    </Button>
                                                    : null
                                            }
                                        </div>
                                        : null
                                }
                                <div style={{clear: 'both'}}/>
                            </div>
                        );
                    })
                }
            </Form>
        );
    }
}

export default Form.create()(QueryItem);
