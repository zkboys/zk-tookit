import React, {Component} from 'react';
import {Button} from 'antd';
import './style.less';
import PageContent from '../../components/page-content/PageContent';

export const PAGE_ROUTE = '/example/actions-set-state';
export const PAGE_SCOPE = 'actionsSetState';
export const INIT_STATE = {
    sync: true,
    a: {
        b: {
            c: ['ccc'],
            c2: 'c2',
        },
        b1: [],
        b2: 'b2',
    },
    d: 'd',
    e: 'e',
}; // end of INIT_STATE

export class LayoutComponent extends Component {
    state = {};

    render() {
        return (
            <PageContent className="actions-set-state">
                <p>
                    <Button onClick={() => {
                        this.props.actions.setState({
                            e: 'eeeeeee',
                        });
                    }}>actions.setState</Button>
                    <br/>
                    <span>{this.props.e}</span>
                </p>
                <p>
                    <Button onClick={() => {
                        this.props.actions.arrAppend('a.b.c', '11');
                    }}>actions.arrAppend 11</Button>
                    <Button onClick={() => {
                        this.props.actions.arrAppend('a.b.c', ['11', '22']);
                    }}>actions.arrAppend ['11', '22']</Button>
                    <Button onClick={() => {
                        this.props.actions.arrRemove('a.b.c', '11');
                    }}>actions.arrRemove 11</Button>
                    <Button onClick={() => {
                        this.props.actions.arrRemoveAll('a.b.c', '11');
                    }}>actions.arrRemoveAll 11</Button>
                    <br/>
                    <span>{this.props.a.b.c.join(',')}</span>
                </p>
                <p>
                    <Button onClick={() => {
                        this.props.actions.objSet('a.b.c2', '11');
                    }}>actions.objSet a.b.c2 = 11</Button>
                    <Button onClick={() => {
                        this.props.actions.objRemove('a.b.c2', '11');
                    }}>actions.objRemove a.b.c2</Button>
                    <br/>
                    <span>{this.props.a.b.c2}</span>
                </p>
            </PageContent>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.pageState[PAGE_SCOPE],
    };
}
