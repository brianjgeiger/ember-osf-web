import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

// Adapted from Ember-SHARE
@layout(template, styles)
export default class QuerySyntax extends Component {
    @service intl!: Intl;
}
