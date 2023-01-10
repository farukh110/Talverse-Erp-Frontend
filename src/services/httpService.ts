import AppConsts from './../lib/appconst';
import { L } from '../lib/abpUtility';
import { Modal } from 'antd';
import axios from 'axios';
import LocalizationKeys from '../lib/localizationKeys';
import { store } from 'react-context-hook';
import utils from '../utils/utils';

const qs = require('qs');

declare var abp: any;


const http = axios.create({
  baseURL: AppConsts.remoteServiceBaseUrl,
  timeout: 30000,
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      encode: false,
    });
  },
});

http.interceptors.request.use(
  function (config) {
    if (!!abp.auth.getToken()) {
      config.headers.common['Authorization'] = 'Bearer ' + abp.auth.getToken();
    }

    config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue('Abp.Localization.CultureName');
    config.headers.common['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie();
    config.headers.common[AppConsts.authorization.sourceAppKey] = AppConsts.erpApps.ERPPortal.accessKey;//specify ERP access key

    // count++;
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  response => {
    utils.showAlertMessage(response.config.url || "", AppConsts.responseTypes.success);
    return response;
  },
  error => {
    let errorTitle = error.response?.statusText;
    if (error.response?.status == 401)
      errorTitle = L(LocalizationKeys.ERP_LblLoginFailed.key);
    if (!!error.response && !!error.response.data.error && !!error.response.data.error.message && error.response.data.error.details) {
      Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
      });
    } else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message) {
      Modal.error({
        title: errorTitle,
        content: error.response.data.error.message,
      });
    }
    else if (!!error.response && !!error.response.data && !!error.response.data.message) {
      Modal.error({
        title: errorTitle,
        content: error.response.data.message,
      });

    } else if (!!error.response) {
      Modal.error({ content: L(LocalizationKeys.ERP_MsgErrorUnknownError.key) });
    }
    store.set(AppConsts.appState.FORM_LOADER, false);

    utils.showAlertMessage(error?.response?.config?.url || "", AppConsts.responseTypes.error);
    // count--;
    setTimeout(() => { }, 1000);
    return Promise.reject(error.response);
  }
);


export default http;
