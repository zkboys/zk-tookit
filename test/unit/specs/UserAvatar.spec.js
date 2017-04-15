import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';
import UserAvatar from '../../../src/components/UserAvatar.jsx'

// http://reactjs.cn/react/docs/test-utils.html
describe('UserAvatar', () => {

    it('用户不存在', () => {
        let instance = ReactTestUtils.renderIntoDocument(
            <UserAvatar/>
        );
        assert.ok(ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'span'));
    });

    it('额外class', () => {
        const user = {
            name: '用户名',
        };
        const className = 'test';
        let instance = ReactTestUtils.renderIntoDocument(
            <UserAvatar user={user} className={className}/>
        );
        assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'test'));
    });

    it('用户存在，只有登录名', () => {
        const user = {
            loginname: '登录名',
        };
        const className = 'test';
        let instance = ReactTestUtils.renderIntoDocument(
            <UserAvatar user={user} className={className}/>
        );
        assert.ok(ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'span'));
    });

    it('用户存在，有头像', () => {
        const user = {
            avatar: 'http://img0.bdstatic.com/img/image/shouye/xiaoxiao/%E5%AE%A0%E7%89%A983.jpg',
        };
        const className = 'test';
        let instance = ReactTestUtils.renderIntoDocument(
            <UserAvatar user={user} className={className}/>
        );
        assert.ok(ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, 'img'));
    });
});
