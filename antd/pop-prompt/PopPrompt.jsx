import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popover, Input, Button, Form} from 'antd';
import {getFormItem} from '../form-util/FormUtils';

const FormItem = Form.Item;
/**
 * pop形式的小文本输入框
 */
@Form.create()
export default class PopPrompt extends Component {
    static defaultProps = {
        title: '请输入',
        okText: '确认',
        cancelText: '取消',
        onCancel: () => {
        },
        onConfirm: () => {
        },
    };

    static propTypes = {
        title: PropTypes.string,
        okText: PropTypes.string,
        cancelText: PropTypes.string,
        onCancel: PropTypes.func,
        onConfirm: PropTypes.func,
        inputProps: PropTypes.object,
    };

    state = {
        visible: false,
    };

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
        // this.props.form.resetFields();
        this.setState({visible});
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
                                    <Input
                                        type="textarea"
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
        const {children, title} = this.props;
        const {visible} = this.state;
        return (
            <Popover
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
                content={this.renderContent()}
                title={title}
                trigger="click"
            >
                {children}
            </Popover>
        );
    }
}
