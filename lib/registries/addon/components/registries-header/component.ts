import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { requiredAction } from 'ember-osf-web/decorators/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

@localClassNames('RegistriesHeader')
export default class RegistriesHeader extends Component {
    layout = layout;

    @service analytics!: Analytics;
    @requiredAction onSearch!: (value: string) => void;

    today = new Date();
    showingHelp = false;
    value: string = defaultTo(this.value, '');
    searchable: number = defaultTo(this.searchable, 0);
    showHelp: boolean = defaultTo(this.showHelp, false);

    _onSearch() {
        this.analytics.click('link', 'Index - Search', this.value);
        this.onSearch(this.value);
    }

    @action
    toggleHelp(this: RegistriesHeader) {
        this.set('showingHelp', !this.showingHelp);
    }

    @action
    onClick() {
        this._onSearch();
    }

    @action
    keyDown(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this._onSearch();
        }
    }
}
