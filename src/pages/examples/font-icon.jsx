import React, {Component} from 'react';
import './style.less';
import PageContent from '../../components/page-content/PageContent';
import FontIconSelector from '../../components/font-icon/FontIconSelector';

export const PAGE_ROUTE = '/example/font-icon';

export class LayoutComponent extends Component {
    state = {};

    render() {
        return (
            <PageContent className="actions-set-state">
                <FontIconSelector height={500}/>
            </PageContent>
        );
    }
}
