/**
 * 可编辑单元格封装，结合antd 的table column render进行使用，field、placeholder、type、decorator、elementProps等表单相关的属性，请参考{@link module:antd/form-utils}
 * @see module:antd/form-utils
 *
 * @param {Object} [outerForm] 外部form，如果不传，将使用内部from对象，一般整行编辑模式会用到
 * @param {*} [text] 非编辑模式，表格显示的值
 * @param {Boolean} [isRowEdit] 是否是整行编辑模式
 * @param {Boolean} [showEdit] 编辑/非编辑形式切换
 * @param {Boolean} [defaultShowEdit] 默认编辑/非编辑形式切换
 * @param {Function} [onSubmit] 单元格回车或点击对号图标触发
 * @param {Function} [onEditChange] 编辑/非编辑形式切换时触发
 *
 * @param {String} field 表单元素的name，form会用到
 * @param {String} [placeholder] 表单元素的placeholder
 * @param {String} [type] 表单元素的类型
 * @param {Object} [decorator] form 的 decorator 参数，参见{@link https://ant.design/components/form-cn/}
 * @param {Object} [elementProps] 表单元素属性
 *
 * @example
 * ...
 * <Table
 *    columns={[
 *        {
 *            title: '姓名',
 *            width: 300,
 *            dataIndex: 'name',
 *            key: 'name',
 *            render: (text, record) => {
 *                const {id} = record;
 *                return (
 *                    <EditableCell
 *                        text={text}
 *                        placeholder="请输入姓名"
 *                        field="name"
 *                        defaultShowEdit
 *                        onSubmit={value => {
 *                            // ajax请求，进行数据更新
 *                            const {dataSource} = this.state;
 *                            const data = dataSource.find(item => item.id === id);
 *                            const name = value.name;
 *
 *                            if (data) data.name = name;
 *                            this.setState({dataSource});
 *                        }}
 *                        decorator={{rules: [{required: true, message: '请输入姓名！'}]}}
 *                    />
 *                );
 *            },
 *        },
 *    ]}
 *    dataSource={this.state.dataSource}
 *    rowKey={record => record.id}
 *    pagination={false}
 * />
 * ...
 *
 *
 * @module antd/EditableCell 可编辑单元格
 * */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Form} from 'antd';
import {FormItemLayout} from 'zk-tookit/antd';
import {getFormElement} from '../form-util/form-utils';
import './style.less';

class EditableCell extends Component {
    constructor(props) {
        super(props);
        const currProps = this.props;
        let showEdit;

        if ('showEdit' in currProps) {
            showEdit = currProps.showEdit;
        } else if ('defaultShowEdit' in currProps) {
            showEdit = currProps.defaultShowEdit;
        }

        this.state.showEdit = showEdit;

        this.form = this.props.outerForm || this.props.form;
    }

    state = {
        showEdit: false,
    };

    static defaultProps = {
        type: 'input',
        onSubmit: () => true,
    };

    static propTypes = {
        outerForm: PropTypes.object,
        text: PropTypes.any,
        isRowEdit: PropTypes.bool,
        showEdit: PropTypes.bool,
        defaultShowEdit: PropTypes.bool,
        onSubmit: PropTypes.func,
        onEditChange: PropTypes.func,

        // 一下为form相关
        field: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        decorator: PropTypes.object,
        elementProps: PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
        // 如果 props 传入 showEdit,则直接更新
        if ('showEdit' in nextProps) {
            this.setState({
                showEdit: nextProps.showEdit,
            });
        }
    }

    edit = () => {
        this.toggleEdit(true);
    };

    toggleEdit = (showEdit) => {
        const {onEditChange} = this.props;
        this.setState({showEdit});
        if (onEditChange) onEditChange(showEdit);
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const {onSubmit} = this.props;
        this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
                this.toggleEdit(false);
            }
        });
    };

    render() {
        const {showEdit} = this.state;
        let {
            isRowEdit,
            field,
            text,
            decorator = {},
        } = this.props;
        let {getFieldDecorator} = this.form;

        if (!decorator.initialValue) decorator.initialValue = text;

        let showIcon = !isRowEdit;

        return (
            <div className="editable-cell">
                {
                    showEdit ?
                        <div className="editable-cell-input-wrapper">
                            <Form onSubmit={this.handleSubmit}>
                                <FormItemLayout colon={false} labelWidth={22} label=" ">
                                    {getFieldDecorator(field, decorator)(
                                        getFormElement(this.props, this.form)
                                    )}
                                </FormItemLayout>
                            </Form>
                            {
                                showIcon ?
                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={this.handleSubmit}
                                    />
                                    : null
                            }

                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {text || ' '}
                            {
                                showIcon ?
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={this.edit}
                                    />
                                    : null
                            }
                        </div>
                }
            </div>
        );
    }
}

export default Form.create()(EditableCell);

