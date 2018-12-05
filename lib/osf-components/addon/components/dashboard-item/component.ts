import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Component from '@ember/component';
import { allSettled, task } from 'ember-concurrency';
import moment from 'moment';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class DashboardItem extends Component.extend({
    getAncestorTitles: task(function *(this: DashboardItem) {
        if (!this.node) {
            return [];
        }

        const parentId = this.node.belongsTo('parent').id();
        const rootId = this.node.belongsTo('root').id();

        // No ancestors
        if (this.node.id === rootId) {
            return [];
        }

        // One ancestor
        if (parentId === rootId && rootId !== null) {
            const parentNode = yield this.node.parent;
            return [parentNode.title];
        }

        // At least two ancestors
        const results = yield allSettled([
            this.node.root,
            this.node.parent,
        ]);

        const titles = results.mapBy('value').compact().mapBy('title');

        // Results might have undefined `value` if ancestors are private
        if (titles.length > 1) {
            const parent = results[1].value;
            if (parent && parent.belongsTo('parent').id() !== rootId) {
                titles.insertAt(1, this.intl.t('general.ellipsis'));
            }
        }
        return titles;
    }).restartable(),
}) {
    @service intl!: Intl;
    @service analytics!: Analytics;

    node?: Node;

    @alias('getAncestorTitles.lastComplete.value') ancestry!: string[];
    @alias('node.contributors') contributors!: Contributor[];

    @computed('node.dateModified')
    get date(): string | undefined {
        return this.node ? moment(this.node.dateModified).format('YYYY-MM-DD h:mm A') : undefined;
    }

    didReceiveAttrs(this: DashboardItem) {
        this.get('getAncestorTitles').perform();
    }
}
