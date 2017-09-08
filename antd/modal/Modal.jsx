import React, {Component} from 'react';
import {Modal} from 'antd';

// 扩展beforeOpen回调

export default class ModalComponent extends Component {

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.beforeOpen && this.props.beforeOpen();
        }
    }

    render() {
        return (
            <Modal {...this.props}>
                {this.props.children}
            </Modal>
        );
    }
}
