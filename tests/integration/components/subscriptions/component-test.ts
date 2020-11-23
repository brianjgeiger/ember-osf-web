import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | subscriptions', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(() => {
        server.create('subscription', {
            id: 'test_subscription_a',
            eventName: 'test_subscription_a',
            frequency: SubscriptionFrequency.Instant,
        });
        server.create('subscription', {
            id: 'test_subscription_b',
            eventName: 'test_subscription_b',
            frequency: SubscriptionFrequency.Instant,
        });
    });

    test('it renders all notifications if no subscriptionIds are specified', async assert => {
        await render(hbs`
            <Subscriptions::Manager as |manager|>
                <Subscriptions::List @manager={{manager}} />
            </Subscriptions::Manager>
        `);
        assert.dom('[data-test-subscription-list]').exists();
        assert.dom('[data-test-subscription-list-row="test_subscription_a"]').exists();
        assert.dom(
            '[data-test-subscription-list-row="test_subscription_a"]>div>[data-test-subscription-event-name]',
        ).hasText('Test subscription a');
        assert.dom(
            '[data-test-subscription-list-row="test_subscription_a"]>div>[data-test-power-select]',
        ).hasText('Instant');

        assert.dom('[data-test-subscription-list-row="test_subscription_b"]').exists();
        assert.dom(
            '[data-test-subscription-list-row="test_subscription_b"]>div>[data-test-subscription-event-name]',
        ).hasText('Test subscription b');
        assert.dom('[data-test-subscription-list-row="test_subscription_b"]>div>[data-test-power-select]').hasText(
            'Instant',
        );
    });

    test('it renders only subscription that is in subscriptionIds', async assert => {
        await render(hbs`
            <Subscriptions::Manager @subscriptionIds={{array 'test_subscription_a'}} as |manager|>
                <Subscriptions::List @manager={{manager}} />
            </Subscriptions::Manager>
        `);
        assert.dom('[data-test-subscription-list]').exists();
        assert.dom('[data-test-subscription-list-row="test_subscription_a"]').exists();
        assert.dom(
            '[data-test-subscription-list-row="test_subscription_a"]>div>[data-test-subscription-event-name]',
        ).hasText('Test subscription a');
        assert.dom(
            '[data-test-subscription-list-row="test_subscription_a"]>div>[data-test-power-select]',
        ).hasText('Instant');

        assert.dom('[data-test-subscription-list-row="test_subscription_b"]').doesNotExist();
    });

    test('it updates frequency', async assert => {
        await render(hbs`
            <Subscriptions::Manager as |manager|>
                <Subscriptions::List @manager={{manager}} />
            </Subscriptions::Manager>
        `);
        assert.dom('[data-test-power-select]').hasText('Instant');
        await clickTrigger();
        await click('[data-test-subscription-option="daily"]');
        assert.dom('[data-test-power-select]').hasText('Daily');
    });
});
