import React, {Component, PropTypes} from 'react';
import {Form, Input, Radio, Icon, Button} from 'antd';
import ValidationRule from '../../../commons/validation-rule';
import './style.less';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export class Message extends Component {
    static defaultProps = {
        loading: false,
    };

    static propTypes = {
        loading: PropTypes.bool,
        user: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
            email: PropTypes.string,
            mobile: PropTypes.string,
            gender: PropTypes.string,
        }),
        form: PropTypes.object,
        actions: PropTypes.object,
    };

    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        const {loading, form, actions} = this.props;
        if (loading) {
            return;
        }
        e.preventDefault();
        form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }

            actions.updateUserMessage(values, () => {
                actions.updateCurrentUser(values);
            });
        });
    }

    render() {
        const {user, loading, form: {getFieldDecorator}} = this.props;
        const idDecorator = getFieldDecorator('_id', {initialValue: user._id});
        const nameDecorator = getFieldDecorator('name', {initialValue: user.name});
        const emailDecorator = getFieldDecorator('email', {
            initialValue: user.email,
            rules: [
                ValidationRule.email(),
            ],
        });
        const mobileDecorator = getFieldDecorator('mobile', {
            initialValue: user.mobile,
            rules: [
                ValidationRule.mobile(),
            ],
        });
        const genderDecorator = getFieldDecorator('gender', {
            initialValue: user.gender,
            rules: [],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };

        return (
            <div className="system-profile-message">
                <Form layout="horizontal" onSubmit={this.handleSubmit} onReset={this.handleReset}>
                    <FormItem
                        {...formItemLayout}
                        label="用户id："
                        style={{display: 'none'}}
                        hasFeedback
                    >
                        {idDecorator(
                            <Input placeholder="请输入登录名"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户名："
                        hasFeedback
                    >
                        {nameDecorator(
                            <Input placeholder="请输入用户名"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱："
                        hasFeedback
                    >
                        {emailDecorator(
                            <Input placeholder="请输入邮箱"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电话："
                        hasFeedback
                    >
                        {mobileDecorator(
                            <Input placeholder="请输入电话"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别：">
                        {genderDecorator(
                            <RadioGroup>
                                <Radio value="male">男</Radio>
                                <Radio value="female">女</Radio>
                            </RadioGroup>
                        )}
                        <span><Icon type="info-circle-o"/> 暂不支持其它性别</span>
                    </FormItem>
                    <FormItem wrapperCol={{span: 12, offset: 7}}>
                        <Button type="ghost" style={{marginRight: 8}} htmlType="reset">重置</Button>
                        <Button type="primary" loading={loading} htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export const LayoutComponent = createForm()(Message);
export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.profileMessage,
    };
}
