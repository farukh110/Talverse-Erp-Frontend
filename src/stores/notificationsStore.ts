import { PushCustomAppUpdateRequestDto } from '../services/notifications/dto/notificationsRequestRespDto';
import notificationsService from '../services/notifications/notificationsService';

class NotificationsStore {
 
  async sendCustomAppUpdate(reqObj: PushCustomAppUpdateRequestDto) {
    let result = await notificationsService.sendCustomAppUpdate(reqObj);
    return result;
  }
}

export default NotificationsStore;
