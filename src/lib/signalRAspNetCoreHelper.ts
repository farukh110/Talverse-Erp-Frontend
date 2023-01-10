import AppConsts from './appconst';
import Util from '../utils/utils';

declare var abp: any;

class SignalRAspNetCoreHelper {
  initSignalR() {
    var encryptedAuthToken = abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);
    abp.signalr = {
      autoConnect: true,
      connect: undefined,
      hubs: undefined,
      qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
      remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl?.endsWith('/') ?
        AppConsts.remoteServiceBaseUrl?.slice(0, -1) :
        AppConsts.remoteServiceBaseUrl,
      url: '/signalr'
    };

    Util.loadScript(AppConsts.appBaseUrl + '/dist/abp.signalr-client.js');

    abp.event.on('abp.notifications.received', function (userNotification: any) {
      console.log(userNotification);
      abp.notifications.showUiNotifyForUserNotification(userNotification);
    });
  }
}
export default new SignalRAspNetCoreHelper();
