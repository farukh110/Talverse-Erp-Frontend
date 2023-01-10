// import { action, observable } from 'mobx';
import { store } from 'react-context-hook';
import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import sessionService from '../services/session/sessionService';

class SessionStore {
  currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();
  static AppStateKeys = {
    CURRENT_LOGIN: "currentLoginInfo"
  }
  async getCurrentLoginInformations() {
    let result = await sessionService.getCurrentLoginInformations();
    this.currentLogin = result;
    store.set(SessionStore.AppStateKeys.CURRENT_LOGIN, result);
  }
  async resetCache() {
    let result = await sessionService.resetCache();
    return result;
  }

  async resetAllCache() {
    let result = await sessionService.resetAllCache()
    return result;
  }

  async resetPermissionCache() {
    let result = await sessionService.resetPermissionCache()
    return result;
  }

  async getAllCache() {
    let result = await sessionService.getAllCache()
    return result;
  }

  async resetUserCache() {
    let result = await sessionService.resetUserCache()
    return result;
  }
}

export default SessionStore;
