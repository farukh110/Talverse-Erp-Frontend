import http from '../httpService';
import AppConsts from '../../lib/appconst';
import { PushCustomAppUpdateRequestDto } from './dto/notificationsRequestRespDto';

class notificationsService {
    public async sendCustomAppUpdate(requestobj: PushCustomAppUpdateRequestDto) {
        let objAppHeader = {};
        objAppHeader[AppConsts.authorization.appAccessKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
        let configHeader = { headers: objAppHeader };
        let result = await http.post('/AppUpdate/PushCustomAppUpdate', requestobj,configHeader);
        return result.data;
    }
}

export default new notificationsService;