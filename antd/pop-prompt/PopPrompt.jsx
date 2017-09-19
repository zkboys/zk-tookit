import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popover, Button, Form} from 'antd';
import {getFormItem} from '../form-util/FormUtils';

const FormItem = Form.Item;
/**
 * pop形式的小文本输入框
 *
 */

// TODO 是否提供外部form功能？
@Form.create()
export default class PopPrompt extends Component {
    constructor(props) {
        super(props);
        const currProps = this.props;
        let visible;
        if ('visible' in currProps) {
            visible = currProps.visible;
        } else if ('defaultVisible' in currProps) {
            visible = currProps.defaultVisible;
        }
        this.state.visible = visible;
    }

    static propTypes = {
        title: PropTypes.string,
        okText: PropTypes.string,
        cancelText: PropTypes.string,
        onCancel: PropTypes.func,
        onConfirm: PropTypes.func,
        onVisibleChange: PropTypes.func,
        inputProps: PropTypes.object,
    };

    static defaultProps = {
        title: '请输入',
        okText: '确认',
        cancelText: '取消',
        onCancel: () => true,
        onConfirm: () => true,
        onClickLabel: () => true,
        onVisibleChange: () => true,
    };

    state = {
        visible: false,
    };

    componentWillReceiveProps(nextProps) {
        // 如果 props 传入 visible,则直接更新
        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible,
            });
        }
    }

    handleConfirm = (e) => {
        e.preventDefault();
        const {form, onConfirm, items} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const result = items && items.length ? values : values.value;

                onConfirm(result);
                this.hide();
            }
        });
    };

    handleCancel = () => {
        this.props.onCancel();
        this.hide();
    };

    hide() {
        this.setState({visible: false});
    }

    handleVisibleChange = (visible) => {
        // 如果 props 传入 visible,则直接更新
        if ('visible' in this.props) {
            visible = this.props.visible;
        }
        this.setState({visible}, () => {
            if (visible) {
                if (this.textArea) {
                    this.textArea.focus();
                    this.textArea.select && this.textArea.select();
                    this.textArea.setSelectionRange && this.textArea.setSelectionRange(0, this.textArea.value.length);
                }
            }
        });
        this.props.onVisibleChange && this.props.onVisibleChange();
        // this.props.form.resetFields();
    };

    renderContent() {
        const {
            form,
            form: {getFieldDecorator},
            inputProps = {},
            okText,
            cancelText,
            decorator,
            items,
        } = this.props;
        return (
            <Form onSubmit={this.handleConfirm}>
                {
                    items && items.length ?
                        items.map(item => getFormItem(item, form))
                        :
                        <FormItem>
                            {
                                getFieldDecorator('value', decorator)(
                                    <textarea
                                        className="ant-input"
                                        ref={node => this.textArea = node}
                                        {...inputProps}
                                    />
                                )
                            }
                        </FormItem>
                }
                <div
                    style={{textAlign: 'right'}}
                >
                    <Button
                        style={{marginRight: 8}}
                        size="small"
                        onClick={this.handleCancel}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        size="small"
                        type="primary"
                        htmlType="submit"
                    >
                        {okText}
                    </Button>
                </div>
            </Form>
        );
    }

    render() {
        const {children, title, onClickLabel} = this.props;
        const {visible} = this.state;
        return (
            <Popover
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
                content={this.renderContent()}
                title={title}
                trigger="click"
            >
                <span onClick={onClickLabel}>
                    {children}
                </span>
            </Popover>
        );
    }
}
