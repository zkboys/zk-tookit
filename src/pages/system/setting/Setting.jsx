import React, {Component} from 'react';
import {Radio, Form, Switch} from 'antd';
import * as Utils from '../../../utils';
import './style.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export class LayoutComponent extends Component {

    handleFixedPageHeaderChange = (checked) => {
        const {actions} = this.props;

        actions.setSettings({pageHeaderFixed: checked});

        // 页面头部背景添加动画效果，提示用户改变的部分
        setTimeout(() => {
            document.querySelector('.page-header').style.backgroundColor = '#fffdcb';
        }, 0);
        setTimeout(() => {
            document.querySelector('.page-header').style.backgroundColor = '#fff';
        }, 1300);
        setTimeout(() => {
            Utils.removeClass('.page-header', 'entered');
            Utils.removeClass('.app-content', 'entered');
        }, 600);
    }

    handlePageAnimationTypeChange = (e) => {
        const {actions} = this.props;
        const pageAnimationType = e.target.value;

        if (pageAnimationType === 'random') {
            actions.setSettings({randomPageAnimation: true});
        } else {
            actions.setSettings({pageAnimationType, randomPageAnimation: false});
        }

        // 过场动画效果提示
        setTimeout(() => {
            Utils.removeClass('.app-content', 'entered');
            Utils.addClass('.app-content', 'leaving');
            Utils.removeClass('.page-header', 'entered');
            Utils.addClass('.page-header', 'leaving');
        }, 0);
        setTimeout(() => {
            Utils.removeClass('.app-content', 'leaving');
            Utils.addClass('.app-content', 'entered');
            Utils.removeClass('.page-header', 'leaving');
            Utils.addClass('.page-header', 'entered');
        }, 300);

        setTimeout(() => {
            Utils.removeClass('.page-header', 'entered');
            Utils.removeClass('.app-content', 'entered');
        }, 600);
    }

    render() {
        let {
            usePageWitchAnimation,
            pageHeaderFixed,
            queryBarFixed,
            pageAnimationType,
            randomPageAnimation,
        } = this.props;

        if (randomPageAnimation) {
            pageAnimationType = 'random';
        }

        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 21},
        };
        return (
            <div className="system-setting">
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="固定页面头部："
                    >
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            checked={pageHeaderFixed}
                            onChange={this.handleFixedPageHeaderChange}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="固定查询条件："
                    >
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            checked={queryBarFixed}
                            onChange={checked => this.props.actions.setSettings({queryBarFixed: checked})}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="页面过场动画："
                    >
                        <Switch
                            style={{float: 'left'}}
                            checkedChildren="开"
                            unCheckedChildren="关"
                            checked={usePageWitchAnimation}
                            onChange={checked => this.props.actions.setSettings({usePageWitchAnimation: checked})}
                        />
                        <div
                            className="page-animation-type"
                            style={{display: usePageWitchAnimation ? 'inline-block' : 'none'}}>
                            <RadioGroup
                                onChange={this.handlePageAnimationTypeChange}
                                value={pageAnimationType}
                            >
                                <Radio key="random" value="random">随机</Radio>
                                <Radio key="fade" value="fade">淡入淡出</Radio>
                                <Radio key="up" value="up">↑上侧出入场</Radio>
                                <Radio key="right" value="right">→右侧出入场</Radio>
                                <Radio key="down" value="down">↓下侧出入场</Radio>
                                <Radio key="left" value="left">←左侧出入场</Radio>
                            </RadioGroup>
                        </div>
                    </FormItem>

                </Form>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.setting,
    };
}
