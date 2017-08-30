import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Form} from 'antd';
import {FormItemLayout} from 'zk-tookit/antd';
import {getFormElement} from '../form-util/form-utils';
import './style.less';

/**
 * 可编辑单元格封装
 */
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
        field: '',
        placeholder: '',
        onSubmit: () => {
        },
    };

    static propTypes = {
        outerForm: PropTypes.object, // antd 中提供的form
        text: PropTypes.any, // 表格显示的值 decorator.initialValue是表单元素显示的值
        isRowEdit: PropTypes.bool, // 是否是整行可编辑模式
        showEdit: PropTypes.bool, // 编辑/非编辑形式切换
        defaultShowEdit: PropTypes.bool, // 编辑/非编辑形式切换
        onSubmit: PropTypes.func, // 单独单元格编辑时，点击'对号'，表单无校验错误时，将触发此函数，整行编辑模式，此方法无效
        onEditChange: PropTypes.func, // 编辑/非编辑形式切换触发事件

        field: PropTypes.string,
        placeholder: PropTypes.string, // 提示
        type: PropTypes.string, // 编辑类型，默认input
        decorator: PropTypes.object, // antd form的 getFieldDecorator 参数
        elementProps: PropTypes.object, // 表单元素props
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

    handleSubmit = () => {
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

