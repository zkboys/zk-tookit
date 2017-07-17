import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popover, Input, Button, Form} from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class PopPrompt extends Component {
    static defaultProps = {
        title: '内容',
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

    componentDidMount() {

    }

    handleConfirm = (e) => {
        e.preventDefault();
        const {form, onConfirm} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const {value} = values;
                onConfirm(value);
                this.hide();
            }
        });
    };

    handleCancel = () => {
        const {onCancel} = this.props;
        onCancel();
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
            form: {getFieldDecorator},
            inputProps = {},
            okText,
            cancelText,
            decorator,
        } = this.props;
        return (
            <Form onSubmit={this.handleConfirm}>
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
                <div
                    style={{marginTop: 8, textAlign: 'right'}}
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
