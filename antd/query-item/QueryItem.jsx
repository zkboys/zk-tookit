import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button} from 'antd';
import {getFormItem} from '../form-util/FormUtils';

/**
 * 查询条件封装，通过传入items即可生成查询条件
 */
@Form.create()
export default class QueryItem extends Component {
    constructor(props) {
        super(props);
        const {outerForm, form} = props; // fixme： 去掉 outerForm，可以使用一个form，另外编写一个组件，render时候通过判断是否传递了form，区分不同渲染，const QueryItemWithForm = Form.create()(QueryItem) <QueryItemWithForm/>
        if (outerForm) {
            this.form = outerForm;
        } else {
            this.form = form;
        }
    }

    static defaultProps = {
        items: [],
        onSubmit: () => {
        },
    };
    static propTypes = {
        onSubmit: PropTypes.func,
        items: PropTypes.array,
        layout: PropTypes.string,
        outerForm: PropTypes.object, // 外部传入的props
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
        const {items, showSearchButton = true, showResetButton = true} = this.props;
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
                                                        查询
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
                                                        重置
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
