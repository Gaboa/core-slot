import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Balance/BalanceView';

export let controller = (() => {

    function initMobile() {
        view.draw.CashBalance({});
        view.draw.CoinBalance({});
    }

    function initDesktop() {
        view.draw.CashBalance({});
        view.draw.DesktopBalance({});
    }

    function initFSMobile() {
        view.draw.CashBalance({});
        view.draw.FSMobileBalance({});
    }

    function initFSDesktop() {
        view.draw.CashBalance({});
        view.draw.FSDesktopBalance({});
    }

    function updateBalance() {
        if (model.state('mobile')) {
            view.update.CashBalance({});
            view.update.CoinBalance({});
        }
        if (model.state('desktop')) {
            view.update.CashBalance({});
            view.update.DesktopBalance({});
        }
    }

    events.on('model:balance:update', updateBalance);

    return {
        initMobile,
        initDesktop,
        initFSMobile,
        initFSDesktop
    };

})();