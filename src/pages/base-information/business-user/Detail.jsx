import React, {Component} from 'react';
import {Card, Row, Col, Switch, Spin} from 'antd';
import './style.less';
import PageContent from '../../../components/page-content/PageContent';
import * as promiseAjax from '../../../commons/promise-ajax';

export const PAGE_ROUTE = '/base-information/business/users/+detail/:userId';

export class LayoutComponent extends Component {
    state = {
        gettingUser: false,
        user: {},
    }

    componentWillMount() {
        const {params: {userId}} = this.props;
        this.setState({
            gettingUser: true,
        });
        promiseAjax.get('/user/findById', {id: userId}).then(data => {
            if (data) {
                this.setState({
                    user: data,
                });
            }
        }).finally(() => {
            this.setState({
                gettingUser: false,
            });
        });
    }

    render() {
        let {user = {}, gettingUser} = this.state;
        const cardStyle = {
            marginBottom: 16,
        };
        const labelStyle = {
            textAlign: 'right',
        };
        return (
            <PageContent className="base-business-user-detail">
                <Spin spinning={gettingUser}>
                    <Card title="账号信息" style={cardStyle}>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={6} style={labelStyle}>
                                        登陆名称：
                                    </Col>
                                    <Col span={18}>
                                        {user.loginName}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={6} style={labelStyle}>
                                        用户编码：
                                    </Col>
                                    <Col span={18}>
                                        {user.userCode}
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={6}>
                                <Row>
                                    <Col span={6} style={labelStyle}>
                                        是否可用：
                                    </Col>
                                    <Col span={18}>
                                        <Switch disabled checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <h1>登录名：{user.loginName}</h1>
                    {Object.keys(user).map(key => {
                        return (
                            <div key={key}>
                                {key}:{user[key]}
                            </div>
                        );
                    })}
                </Spin>
            </PageContent>
        );
    }
}
