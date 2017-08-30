/**
 * form相关封装的一些基础方法，EditCell、QueryItem、FormPage等组件可能用到；
 * type可用类型有：input number textarea password mobile email select select-tree checkbox radio switch data time data-time cascader；
 *
 * @module antd/form-utils 表单工具
 * */
import React from 'react';
import {InputClear, FormItemLayout} from 'zk-tookit/antd';
import {InputNumber, Input, Select, Checkbox, Radio, Switch, DatePicker, TimePicker, Cascader} from 'antd';

function isInputLikeElement(type) {
    return [
        'input',
        'input-clear',
        'number',
        'textarea',
        'password',
        'mobile',
        'email',
    ].includes(type);
}

/**
 * 基于item配置，获取表单元素的placeholder
 * @param {Object} item 表单元素的配置
 * @returns {String} 表单元素的placeholder
 */
export function getPlaceholder(item) {
    const {type = 'input', label, placeholder, elementProps = {}} = item;
    if (elementProps.placeholder) return elementProps.placeholder;
    if (placeholder) return placeholder;
    if (isInputLikeElement(type)) {
        return `请输入${label}`;
    }

    return `请选择${label}`;
}

/**
 *  获取表单元素
 *
 * @param {Object} item 表单元素的配置，大多是 FormItemLayout 所需参数 及 表单元素所需参数：
 * type、field、label、labelSpaceCount、width、placeholder、decorator、elementProps、layout
 * @param {Object} form antd 的form对象
 * @returns {XML} 根据item生成的表单元素
 */
export function getFormElement(item, form) {
    const {type = 'input', elementProps = {}} = item;
    elementProps.placeholder = getPlaceholder(item);
    const width = elementProps.width ? elementProps.width : '100%';
    const commonStyle = {width};
    elementProps.style = elementProps.style ? {...commonStyle, ...elementProps.style} : commonStyle;
    if (isInputLikeElement(type)) {
        if (type === 'input-clear') return <InputClear {...elementProps} form={form}/>;
        if (type === 'number') return <InputNumber {...elementProps}/>;
        return <Input {...elementProps}/>;
    }

    if (type === 'select') {
        const Option = Select.Option;
        const {options = []} = elementProps;
        return (
            <Select {...elementProps}>
                {
                    options.map(opt => <Option key={opt.value} {...opt}>{opt.label}</Option>)
                }
            </Select>
        );
    }

    if (type === 'checkbox') return <Checkbox {...elementProps}>{elementProps.label}</Checkbox>;

    if (type === 'checkbox-group') return <Checkbox.Group {...elementProps}/>;

    if (type === 'radio') return <Radio {...elementProps}>{elementProps.label}</Radio>;

    if (type === 'radio-group') return <Radio.Group {...elementProps}/>;

    if (type === 'switch') return <Switch {...elementProps} style={{...elementProps.style, width: 'auto'}}/>;

    if (type === 'date') return <DatePicker {...elementProps}/>;

    if (type === 'date-range') return <DatePicker.RangePicker {...elementProps}/>;

    if (type === 'month') return <DatePicker.MonthPicker {...elementProps}/>;

    if (type === 'time') return <TimePicker {...elementProps}/>;

    if (type === 'cascader') return <Cascader {...elementProps}/>;

    // TODO 其他类型，碰到需求的时候，再补充
    // TODO 自定义组件，from相关的组件（editable-cell、query-item）等，统一自定义组件接口。
}

/**
 * 获取FormItem组件
 * @param item
 * @param form
 * @returns {XML} FormItemLayout组件
 */
export function getFormItem(item, form) {
    const {getFieldDecorator} = form;
    const {field, decorator} = item;
    return (
        <FormItemLayout key={item.field} {...item}>
            {getFieldDecorator(field, decorator)(getFormElement(item, form))}
        </FormItemLayout>
    );
}
