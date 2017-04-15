import React from 'react';
import {mount, shallow} from 'enzyme';
import Operator from '../../../src/components/Operator.jsx'

// http://reactjs.cn/react/docs/test-utils.html
// http://airbnb.io/enzyme/
describe('components/Operator.jsx', () => {
    it('不传如任何参数', () => {
        const wrapper = shallow(<Operator />);
        expect(wrapper.find('span')).to.have.length(1);
    });
    it('一个操作', () => {
        const wrapper = shallow(<Operator items={[{
            onClick: () => alert(1),
            label: '测试',
        }]}/>);
        expect(wrapper.find('span')).to.have.length(3);
    });

    it('两个个操作', () => {
        const wrapper = shallow(<Operator items={[
            {
                onClick: () => alert(1),
                label: '测试',
            },
            {
                onClick: () => alert(1),
                label: '测试2',
            }
        ]}/>);
        expect(wrapper.find('span')).to.have.length(6);
    });
});
