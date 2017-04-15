import React, {Component} from 'react';
import classNames from 'classnames';
import {removeClass} from '../../utils';
import './style.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
    };

    static propTypes = {};

    componentWillMount() {
    }
    componentDidMount() {
        // 进入之后，去掉动画class（去掉transform属性），否者内部fixed元素将失效（webkit的bug？）
        this.content.addEventListener('webkitAnimationEnd', () => {
            const {pageStatus} = this.props;
            if (pageStatus === 'entered') {
                removeClass(this.content, pageStatus);
            }
        });
    }
    render() {
        const {
            id,
            isSidebarCollapsed,
            sideBarHidden,
            children,
            pageHeader,
            pageHeaderFixed,
            pageStatus,
            pageAnimationType,
        } = this.props;

        const appContentClassName = classNames({
            'app-content': true,
            'page-header-fixed': pageHeaderFixed,
            'page-header-hidden': pageHeader.hidden,
            collapsed: isSidebarCollapsed,
            full: sideBarHidden,
            [pageStatus]: true,
            [pageAnimationType]: true,
        });
        return (
            <div id={id} className={appContentClassName} ref={(node) => this.content = node}>
                {children}
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.setting,
        ...state.utils,
    };
}
