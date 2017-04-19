import React from 'react';
import {Affix} from 'antd';
import './style.less';
import {getItem} from '../../utils/storage';

export default class extends React.Component {
    state = {
        appHeaderHeight: 0,
        pageHeaderHeight: 0,
    };

    componentDidMount() {
        const appHeader = document.querySelector('.app-header');
        const pageHeader = document.querySelector('.page-header');
        const appHeaderHeight = appHeader.offsetHeight;
        const pageHeaderHeight = pageHeader.offsetHeight;
        /* eslint-disable */
        this.setState({
            appHeaderHeight,
            pageHeaderHeight,
        });
    }

    render() {
        const settings = getItem('setting');
        let {fixed = settings && settings.queryBarFixed, offsetTop} = this.props;
        const pageHeaderFixed = settings && settings.pageHeaderFixed;
        const {appHeaderHeight, pageHeaderHeight} = this.state;

        if (offsetTop === undefined) {
            if (pageHeaderFixed) {
                offsetTop = appHeaderHeight + pageHeaderHeight;
            } else {
                offsetTop = pageHeaderHeight;
            }
        }

        if (fixed) {
            return (
                <Affix offsetTop={offsetTop}>
                    <div className="query-bar">
                        {this.props.children}
                    </div>
                </Affix>
            );
        }
        return (
            <div className="query-bar">
                {this.props.children}
            </div>
        );
    }
}
