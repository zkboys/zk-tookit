import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Form} from 'antd';
import {FormItemLayout} from 'zk-tookit/antd';
import {getFormElement} from '../form-util/FormUtils';
import './style.less';

/**
 * 可编辑单元格封装，全局form使用 EditableCell，可以显示错误提示
 * 每个 EditableCell 有自己的from，使用 export default Form.create()(EditableCell);
 */
export class EditableRowCell extends Component {
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
    }

    state = {
        value: this.props.value,
        showEdit: false,
    };

    static defaultProps = {
        type: 'input',
        field: '',
        placeholder: '',
        onSubmit: () => {
        },
    };

    static propTypes = {
        // fixme: 改名为form，所有form相关的组件都可这样封装，外部传入from可以提高灵活性；内部form可以简化组件。
        // fixme: 额外编写一个组件：render 函数中，判断this.props.form const EditableCell = Form.create()(EditableRowCell); <EditableCell/> 可以进行不同的render
        globalForm: PropTypes.object, // antd 中提供的form
        field: PropTypes.string.isRequired,
        placeholder: PropTypes.string, // 提示
        type: PropTypes.string, // 编辑类型，默认input
        text: PropTypes.any, // 表格显示的值 decorator.initialValue是表单元素显示的值
        decorator: PropTypes.object, // antd form的 getFieldDecorator 参数
        isRowEdit: PropTypes.bool, // 是否是整行可编辑模式
        showEdit: PropTypes.bool, // 编辑/非编辑形式切换
        defaultShowEdit: PropTypes.bool, // 编辑/非编辑形式切换
        onSubmit: PropTypes.func, // 单独单元格编辑时，点击'对号'，表单无校验错误时，将触发此函数，整行编辑模式，此方法无效
        onEditChange: PropTypes.func, // 编辑/非编辑形式切换触发事件
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
        // props 中存在 defaultActiveIndex 时,则更新
        if ('defaultShowEdit' in this.props) {
            this.setState({
                showEdit,
            });
            // 更新后执行回调函数
            if (onEditChange) onEditChange(showEdit);
        }
    };

    handleSubmit = () => {
        const {onSubmit} = this.props;
        const form = 'globalForm' in this.props ? this.props.globalForm : this.props.form;
        form.validateFieldsAndScroll((err, values) => {
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
        const form = 'globalForm' in this.props ? this.props.globalForm : this.props.form;
        let {getFieldDecorator} = form;

        if (!decorator.initialValue) decorator.initialValue = text;
        let showIcon = true;
        if (isRowEdit) {
            showIcon = false;
        }
        return (
            <div className="editable-cell">
                {
                    showEdit ?
                        <div className="editable-cell-input-wrapper">
                            <Form onSubmit={this.handleSubmit}>
                                <FormItemLayout colon={false} labelWidth={22} label=" ">
                                    {getFieldDecorator(field, decorator)(
                                        getFormElement(this.props, form)
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

const EditableCell = Form.create()(EditableRowCell);
export default EditableCell;

