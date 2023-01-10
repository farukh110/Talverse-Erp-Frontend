import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'mobx-react';
import { AppProvider } from './AppProvider'
import Utils from './utils/utils';
import abpUserConfigurationService from './services/abpUserConfigurationService';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';

declare var abp: any;

Utils.setLocalization();

abpUserConfigurationService.getAll().then(data => {
  Utils.extend(true, abp, data.data.result.config);
  abp.countries = data.data.result.countries;
  abp.user = data.data.result.user;
  abp.clock.provider = Utils.getCurrentClockProvider(data.data.result.config.clock.provider);

  moment.locale(abp.localization.currentLanguage.name);

  if (abp.clock.provider.supportsMultipleTimezone) {
    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
  }

  const stores = initializeStores();

  ReactDOM.render(
    <AppProvider value={stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>,
    document.getElementById('root') as HTMLElement
  );

  registerServiceWorker();
});
