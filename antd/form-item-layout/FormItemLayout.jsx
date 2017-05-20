/**
 * 基于antd FormItem进行布局，label固定宽度，表单元素自适应
 * 使用了antd的两个class，会依赖FormItem的结构
 *
 * */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'antd';

const FormItem = Form.Item;
export default class FormItemLayout extends Component {
    static defaultProps = {
        labelSpaceCount: 10, // label所占空间个数，用于与其他label对齐
        labelFontSize: 12, // label字体大小，最终width = labelSpaceCount * labelFontSize
    }
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        labelWidth: PropTypes.number,
        labelSpaceCount: PropTypes.number,
        labelFontSize: PropTypes.number,
    }
    state = {}

    componentDidMount() {
        const labelWidth = this.getLabelWidth();
        // 处理校验信息，与具体表单元素对齐
        const antFormItemLabel = this.formItemDom.querySelector('.ant-form-item-label');
        const antFormItemControlWrapper = this.formItemDom.querySelector('.ant-form-item-control-wrapper');
        if (antFormItemLabel) {
            antFormItemLabel.style.width = `${labelWidth}px`;
            antFormItemLabel.style.float = 'left';
        }
        if (antFormItemControlWrapper) {
            antFormItemControlWrapper.style.paddingLeft = `${labelWidth}px`;
        }
    }

    /**
     * 获取 label宽度，width属性优先
     * 如果没有设置width，最终width = labelSpaceCount * labelFontSize
     * 默认width = 10 * 12 = 120
     *
     * @returns {Number}
     */
    getLabelWidth() {
        const {labelWidth, labelSpaceCount, labelFontSize} = this.props;
        if (labelWidth) return labelWidth;
        return (labelSpaceCount + 2) * labelFontSize;
    }

    render() {
        const {
            id,
            className,
            style,
            children,
        } = this.props;

        const wrapperProps = {};
        if (id) wrapperProps.id = id;
        if (className) wrapperProps.className = className;
        if (style) wrapperProps.style = style;

        const formItemProps = {...this.props};
        const ignoreProps = ['className', 'style', 'labelWidth', 'labelSpaceCount', 'labelFontSize'];
        ignoreProps.forEach(item => {
            Reflect.deleteProperty(formItemProps, item);
        });

        return (
            <div {...wrapperProps} ref={node => this.formItemDom = node}>
                <FormItem {...formItemProps}>
                    {children}
                </FormItem>
            </div>
        );
    }
}
