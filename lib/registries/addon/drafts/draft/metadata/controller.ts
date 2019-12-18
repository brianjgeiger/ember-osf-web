import Controller from '@ember/controller';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Media from 'ember-responsive';

import NodeModel from 'ember-osf-web/models/node';
import { DraftPageRouteModel } from './route';

export default class RegistriesDrat extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    model!: DraftPageRouteModel;

    @alias('model.taskInstance.value.draftRegistration') draftRegistration?: DraftRegistration;
    @alias('model.taskInstance.value.node') node?: NodeModel;

    @alias('draftRegistration.id') draftId!: string;

    @not('draftRegistration') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;
}
