import * as abpTypings from '../lib/abp';

import { L } from '../lib/abpUtility';
import { routers } from '../components/Router/router.config';
import moment from 'moment';
import LocalizationKeys from '../lib/localizationKeys';
import AppConsts from '../lib/appconst';
import { message } from 'antd';

declare var abp: any;

class Utils {
  loadScript(url: string) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
  }

  extend(...args: any[]) {
    let options,
      name,
      src,
      srcType,
      copy,
      copyIsArray,
      clone,
      target = args[0] || {},
      i = 1,
      length = args.length,
      deep = false;
    if (typeof target === 'boolean') {
      deep = target;
      target = args[i] || {};
      i++;
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = args[i]) !== null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          srcType = Array.isArray(src) ? 'array' : typeof src;
          if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && srcType === 'array' ? src : [];
            } else {
              clone = src && srcType === 'object' ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  }

  getPageTitle = (pathname: string) => {
    const route: any = routers.filter(route => route.path === pathname);
    if (route && route.length > 0) {
      return L(route[0].title);
    }
    else {
      let childExist: any = this.getChildRoute(pathname);
      if (childExist && childExist.title) {
        return L(childExist.title);
      } else {
        const localizedAppName = L(LocalizationKeys.ERP_AppName.key);
        return localizedAppName;
      }
    }
  };

  getRoute = (path: string): any => {
    let parent = routers.filter(route => route.path === path)[0];
    if (parent) {
      return parent;
    }
    else {
      return this.getChildRoute(path);
    }
  };



  getChildRoute(path: string) {
    let parentPath = path.split('/');
    let hasChild = routers.find(route => route.childRoutes != undefined && route.path == `/${parentPath[1]}`);//&& route.path ==
    if (hasChild) {
      let childRoute = hasChild.childRoutes.filter((route: any) => route.path === path)[0];
      return childRoute;
    }
    return null;
  }
  setLocalization() {
    if (!abp.utils.getCookieValue('Abp.Localization.CultureName')) {
      let language = navigator.language;
      abp.utils.setCookieValue('Abp.Localization.CultureName', language, new Date(new Date().getTime() + 5 * 365 * 86400000), abp.appPath);
    }
  }

  getCurrentClockProvider(currentProviderName: string): abpTypings.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  splitObjectItemsForEachLine(data: any) {

    let returnString = '';
    if (data) {
      for (let i = 0; i < data.length; i++) {
        returnString += data[i]?.currency + ' ' + data[i]?.amount + '<br>';
      }
    }
    return returnString;
  }

  splitObjectItemsForEachLineToNewLine(data: any) {

    let returnString = '';
    if (data) {
      for (let i = 0; i < data.length; i++) {
        returnString += data[i]?.currency + ' ' + data[i]?.amount;

        returnString += i + 1 == data.length ? '' : '\n';

      }
    }
    return returnString;
  }

 


  splitObjectItemsByPipe(data: any) {

    let returnString = '';
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (i == data.length - 1)
          returnString += data[i]?.currency + ' ' + data[i]?.amount;
        else
          returnString += data[i]?.currency + ' ' + data[i]?.amount + '|';
      }
    }
    return returnString;
  }

  splitToNewLineBySeperator(data: any, seperator: any) {
    let returnString = '';
    if (data) {
      let items = data.split(seperator);
      for (let i = 0; i < items.length; i++) {
        returnString += `${i + 1}) ${items[i]} <br>`;
      }
    }
    return returnString;
  }

  splitBalanceAmountsForEachLine(data: any) {
    let returnString = '';
    if (data) {
      data = JSON.parse(data);
      for (let i = 0; i < data.length; i++) {
        returnString += data[i]?.CurrencyCode + ' ' + data[i]?.Amount + '<br>';
      }
    }
    return returnString;
  }

  //#region  Date Helpers 

  isCampaignDateValid(date: any, dateToCompare: any) {
    const dateToValidate = moment(date);
    const dateToComp = moment(dateToCompare);

    if (dateToValidate.isValid() && dateToComp.isValid()) {
      return dateToValidate.diff(dateToComp, 'days') >= 1 ? true : false;
    }
    return false;

  }


  formattedDate(date: any, format?: any) {
    if (date) {
      const parsedDate = moment(date);
      return parsedDate.isValid() ? format ? parsedDate.format(format) : parsedDate.format("DD/MM/YYYY") : "--";
    }
    else {
      return "--";
    }
  }


  getStartOfDate(date: any, unit: any, format?: any) {
    let form = format ? format : 'YYYY-MM-DD';
    return moment(date).startOf(unit).format(form);
  }

  getEndOfDate(date: any, unit: any, format?: any) {
    let form = format ? format : 'YYYY-MM-DD';
    return moment(date).endOf(unit).format(form);
  }
  getMonthInWords(date: any) {
    return moment.utc(date).startOf('month').format('MMM');
  }

  formattedDateAndTime(date: any, format?: any) {
    if (date) {
      const parsedDate = moment(date);
      return parsedDate.isValid() ? format ? parsedDate.format(format) : parsedDate.format("DD/MM/YYYY HH:mm") : "--";
    }
    else {
      return "--";
    }
  }



  //#endregion

  showAlertMessage(url: string, type: string) {
    switch (url) {
      case "/Donation/SaveDonation":
      case "/Transfer/SubmitTransfer":
      case "/Transfer/SubmitP2PTransfer":
      case "/Content/SaveContent":
      case "/CashOut/SubmitCashOut":
      case "/AppUpdate/PushCustomAppUpdate":
        if (type == AppConsts.responseTypes.success)
          this.getAlertMessage(AppConsts.alertMessageTypes.success, LocalizationKeys.ERP_MsgSuccessfulRecordSave.key);
        else if (type == AppConsts.responseTypes.error)
          this.getAlertMessage(AppConsts.alertMessageTypes.error, LocalizationKeys.ERP_MsgRequestedOperationFailed.key);
        break;
      case "/Donation/UpdateDonation":
      case "/Transfer/UpdateTransfer":
        if (type == AppConsts.responseTypes.success)
          this.getAlertMessage(AppConsts.alertMessageTypes.success, LocalizationKeys.ERP_MsgSuccessfulRecordUpdate.key);
        else if (type == AppConsts.responseTypes.error)
          this.getAlertMessage(AppConsts.alertMessageTypes.error, LocalizationKeys.ERP_MsgRequestedOperationFailed.key);
        break;

      case "/Transfer/AcknowledgePaymentTransfer":
      case "/Transfer/AcknowledgeP2PTransfer":

        if (type == AppConsts.responseTypes.success)
          this.getAlertMessage(AppConsts.alertMessageTypes.success, LocalizationKeys.ERP_MsgTransferAckonwledgedSuccessfully.key);
        else if (type == AppConsts.responseTypes.error)
          this.getAlertMessage(AppConsts.alertMessageTypes.error, LocalizationKeys.ERP_MsgRequestedOperationFailed.key);
        break;

      default:
        break;

    }
  }

  getAlertMessage(alertType: string, alertMessage: string) {
    switch (alertType) {
      case AppConsts.alertMessageTypes.info:
        message.info({
          content: L(alertMessage),
          className: 'global-message-info',
          style: {
            marginTop: '0px',
          },
        });
        message.config({
          duration: 1,
        });
        break;
      case AppConsts.alertMessageTypes.error:
        message.error({
          content: L(alertMessage),
          className: 'global-message-warning',
          style: {
            marginTop: '0px',
          },
        });
        message.config({
          duration: 1,
        });
        break;
      case AppConsts.alertMessageTypes.loading:
        message.loading({
          content: L(alertMessage),
          className: 'global-message-loading',
          style: {
            marginTop: '0px',
          },
        });
        message.config({
          duration: 1,
        });
        break;
      case AppConsts.alertMessageTypes.success:
        message.success({
          content: L(alertMessage),
          className: 'global-message-success',
          style: {
            marginTop: '0px',
          },
        });
        message.config({
          duration: 1,
        });
        break;
      case AppConsts.alertMessageTypes.warn:
        message.warn({
          content: L(alertMessage),
          className: 'global-message-warning',
          style: {
            marginTop: '0px',
          },
        });
        message.config({
          duration: 1,
        });
        break;
      case AppConsts.alertMessageTypes.warning:
        message.warning({
          content: L(alertMessage),
          className: 'global-message-warning',
          style: {
            marginTop: '0px',
          },
        });
        message.config({
          duration: 1,
        });
        break;

      default:
        break;
    }

  }

  downloadFile(res: any, fileName: string) {
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = url
    link.setAttribute('download', fileName);
    document.body.appendChild(link)
    link.click();
  }

}

export default new Utils();
