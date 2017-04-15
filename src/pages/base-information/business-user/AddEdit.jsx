import React, {Component} from 'react';
import {Form, Input, Button, Card, Row, Col, Switch, Tabs, Checkbox, Spin} from 'antd';
import './style.less';
import PageContent from '../../../components/page-content/PageContent';
import * as promiseAjax from '../../../commons/promise-ajax';
import {getCurrentLoginUser} from '../../../commons/index';
import NoData from '../../../components/NoData';
import {arrRemove} from '../../../utils';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
export const PAGE_ROUTE = '/base-information/business/users/+add/:userId';

class UserAdd extends Component {
    state = {
        title: '添加业务人员',
        isEdit: false,
        userId: null,
        gettingUser: false,
        user: {},
        systems: [],
        activeSystemTabKey: null,
        gettingRoles: false,
        systemRoles: {}, // 角色 缓存
        roleIds: [],
        systemIds: [],
    };

    componentWillMount() {
        const {params: {userId}} = this.props;
        if (userId !== ':userId') {
            this.setState({
                title: '修改业务人员',
                userId,
                isEdit: true,
                gettingUser: true,
            });
            promiseAjax.get('/user/findById', {id: userId}).then(data => {
                if (data) {
                    // TODO setState这两个数据
                    // roleIds: [],
                    // systemIds: [],
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

        const loginUserId = getCurrentLoginUser().id;
        promiseAjax.get(`/admins/${loginUserId}`).then(data => {
            const activeSystemTabKey = data.systems && data.systems.length && data.systems[0].id;
            this.setState({
                systems: data.systems,
                activeSystemTabKey,
            });
            this.handleSystemTabClick(activeSystemTabKey);
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {form, router} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values.enabled) {
                    values.enabled = 1;
                } else {
                    values.enabled = 0;
                }
                const {userId, systemIds, roleIds} = this.state;
                values.systemId = systemIds.join(',');
                values.roleId = roleIds.join(',');
                if (userId) {
                    promiseAjax.post('/user/update', values).then(() => {
                        router.goBack();
                    });
                } else {
                    promiseAjax.post('/user/add', values).then(() => {
                        router.goBack();
                    });
                }
            }
        });
    }
    handleSystemTabClick = (key) => {
        const {systemRoles} = this.state;
        console.log(systemRoles);
        if (!systemRoles[key]) {
            this.setState({
                gettingRoles: true,
            });
            promiseAjax.get('/role/getRoleBySysId', {systemId: key}).then(data => {
                const roles = data;
                if (roles && roles.length) {
                    systemRoles[key] = roles;
                    this.setState({systemRoles});
                }
            }).finally(() => {
                this.setState({
                    gettingRoles: false,
                });
            });
        }

        this.setState({
            activeSystemTabKey: key,
        });
    }

    handleRoleCheck = (checked, role) => {
        const roleId = role.id;
        const systemId = role.systemId;
        const {roleIds, systemIds} = this.state;
        if (checked) {
            roleIds.push(roleId);
            systemIds.push(systemId);
        } else {
            arrRemove(roleIds, roleId);
            arrRemove(systemIds, systemId);
        }
        this.setState({roleIds, systemIds});
    }

    renderSystemTabPanes = () => {
        const {systems, systemRoles} = this.state;
        const roleLayout = {
            xs: 8,
            sm: 6,
            md: 4,
            lg: 4,
            xl: 2,
        };
        return systems.map(sys => {
            const roles = systemRoles[sys.id] || [];
            const hasRoles = roles && roles.length;
            return (
                <TabPane tab={sys.name} key={sys.id}>
                    {
                        hasRoles ?
                            <Row>
                                {roles.map(role => <Col {...roleLayout} key={role.id}><Checkbox onChange={e => this.handleRoleCheck(e.target.checked, role)}>{role.name}</Checkbox></Col>)}
                            </Row>
                            : <NoData/>
                    }
                </TabPane>
            );
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {title, user, userId, isEdit, activeSystemTabKey, gettingRoles} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const cardStyle = {
            marginBottom: 16,
        };
        return (
            <PageContent className="base-business-user-add">
                <h1 style={{textAlign: 'center', marginBottom: 16}}>{title}</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Card title="账号信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                {isEdit ?
                                    <FormItem
                                        {...formItemLayout}
                                        label=""
                                    >
                                        {getFieldDecorator('id', {
                                            initialValue: userId,
                                        })(
                                            <Input type="hidden"/>
                                        )}
                                    </FormItem>
                                    :
                                    null
                                }
                                <FormItem
                                    {...formItemLayout}
                                    label="登陆名称"
                                >
                                    {getFieldDecorator('loginName', {
                                        initialValue: user.loginName,
                                        rules: [
                                            {
                                                required: true, message: '请输入登陆名称!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="密码"
                                >
                                    {getFieldDecorator('password', {
                                        initialValue: user.password,
                                        rules: [
                                            {
                                                required: true, message: '请输入密码!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="用户编码"
                                >
                                    {getFieldDecorator('userCode', {
                                        initialValue: user.userCode,
                                        rules: [
                                            {
                                                required: true, message: '请输入用户编码!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="账号是否可用"
                                >
                                    {getFieldDecorator('enabled', {
                                        initialValue: user.enabled === undefined ? true : user.enabled === 1,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择账号是否可用!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="角色设置">
                        <Spin spinning={gettingRoles}>
                            <Tabs type="card" activeKey={activeSystemTabKey} onTabClick={this.handleSystemTabClick}>
                                {this.renderSystemTabPanes()}
                            </Tabs>
                        </Spin>
                    </Card>
                    <Card title="基本信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证号"
                                >
                                    {getFieldDecorator('idCardNo', {
                                        initialValue: user.idCardNo,
                                        rules: [
                                            {
                                                required: false, message: '请输入身份证号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="身份证姓名"
                                >
                                    {getFieldDecorator('idCardName', {
                                        initialValue: user.idCardName,
                                        rules: [
                                            {
                                                required: false, message: '请输入身份证姓名!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="备注名"
                                >
                                    {getFieldDecorator('remarkName', {
                                        initialValue: user.remarkName,
                                        rules: [
                                            {
                                                required: false, message: '请输入备注名!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="性别"
                                >
                                    {getFieldDecorator('gender', {
                                        initialValue: user.gender,
                                        rules: [
                                            {
                                                required: false, message: '请输入性别!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="出生日期"
                                >
                                    {getFieldDecorator('birthDate', {
                                        initialValue: user.birthDate,
                                        rules: [
                                            {
                                                required: false, message: '请输入出生日期!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>


                                <FormItem
                                    {...formItemLayout}
                                    label="所属机构"
                                >
                                    {getFieldDecorator('orgNo', {
                                        initialValue: user.orgNo,
                                        rules: [
                                            {
                                                required: false, message: '请选择用户所属机构!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="直属机构/所属名称"
                                    style={{display: 'none'}}
                                >
                                    {getFieldDecorator('orgName', {
                                        initialValue: user.orgName,
                                        rules: [
                                            {
                                                required: false, message: '请输入直属机构/所属名称!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="手机号"
                                >
                                    {getFieldDecorator('phone', {
                                        initialValue: user.phone,
                                        rules: [
                                            {
                                                required: false, message: '请输入手机号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="座机号"
                                >
                                    {getFieldDecorator('telphone', {
                                        initialValue: user.telphone,
                                        rules: [
                                            {
                                                required: false, message: '请输入座机号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="邮箱"
                                >
                                    {getFieldDecorator('email', {
                                        initialValue: user.email,
                                        rules: [
                                            {
                                                required: false, message: '请输入邮箱!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="QQ号"
                                >
                                    {getFieldDecorator('qq', {
                                        initialValue: user.qq,
                                        rules: [
                                            {
                                                required: false, message: '请输入QQ号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="微信"
                                >
                                    {getFieldDecorator('wechat', {
                                        initialValue: user.wechat,
                                        rules: [
                                            {
                                                required: false, message: '请输入微信!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="机构管理者"
                                >
                                    {getFieldDecorator('isCreatePerson', {
                                        initialValue: user.isCreatePerson,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择机构管理者!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="个人结算信息" style={cardStyle}>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="银行账户名称"
                                >
                                    {getFieldDecorator('accountName', {
                                        initialValue: user.accountName,
                                        rules: [
                                            {
                                                required: false, message: '请输入银行账户名称!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="账户是否过期"
                                >
                                    {getFieldDecorator('accountExpired', {
                                        initialValue: user.accountExpired,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择账户是否过期!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="账户是否锁定"
                                >
                                    {getFieldDecorator('accountLocked', {
                                        initialValue: user.accountLocked,
                                        valuePropName: 'checked',
                                        rules: [
                                            {
                                                required: false, message: '请选择账户是否锁定!',
                                            },
                                        ],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="开户行名称"
                                >
                                    {getFieldDecorator('openbankName', {
                                        initialValue: user.openbankName,
                                        rules: [
                                            {
                                                required: false, message: '请输入开户行名称!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="结算账号"
                                >
                                    {getFieldDecorator('settleAccount', {
                                        initialValue: user.settleAccount,
                                        rules: [
                                            {
                                                required: false, message: '请输入结算账号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="联行行号"
                                >
                                    {getFieldDecorator('cnapsCode', {
                                        initialValue: user.cnapsCode,
                                        rules: [
                                            {
                                                required: false, message: '请输入联行行号!',
                                            },
                                        ],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <div>
                        <Button type="primary" htmlType="submit" size="large" style={{marginRight: 16}}>保存</Button>
                        <Button
                            type="ghost" htmlType="reset" size="large"
                            onClick={() => this.props.form.resetFields()}>
                            重置
                        </Button>
                    </div>
                </Form>
            </PageContent>
        );
    }
}

export const LayoutComponent = Form.create()(UserAdd);
