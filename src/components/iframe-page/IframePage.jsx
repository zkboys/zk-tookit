import React, {Component} from 'react';
import './style.less';

export default class LayoutComponent extends Component {
    state = {
        iframeDom: null,
    }

    componentDidMount() {
        // FIXME iframe方式打开页面，使页面padding去掉，页面容器固定，页面使用iframe滚动条
        console.log(this.iframeDom.parentNode.parentNode);
        console.log(this.iframeDom);
        if (this.iframeDom.parentNode.getAttribute('id') === 'app-frame-page') {
            this.iframeDom.parentNode.parentNode.style.padding = 0;
            this.iframeDom.parentNode.parentNode.style.bottom = '3px';
        } else {
            this.iframeDom.parentNode.style.padding = 0;
            this.iframeDom.parentNode.style.bottom = '3px';
        }
    }

    componentWillUnmount() {
        if (this.iframeDom.parentNode.getAttribute('id') === 'app-frame-page') {
            this.iframeDom.parentNode.parentNode.style.padding = '0 16px 16px 16px';
            this.iframeDom.parentNode.parentNode.style.bottom = 0;
        } else {
            this.iframeDom.parentNode.style.padding = '0 16px 16px 16px';
            this.iframeDom.parentNode.style.bottom = 0;
        }
    }

    render() {
        const {url} = this.props;
        return (
            <div className="iframe-page" ref={view => this.iframeDom = view}>
                <iframe src={url} frameBorder="0" width="100%" height="100%"/>
            </div>
        );
    }
}
