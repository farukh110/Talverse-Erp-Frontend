import { GetCurrentLoginInformations } from './dto/getCurrentLoginInformations';
import http from '../httpService';

declare var abp: any;

class SessionService {
  public async getCurrentLoginInformations(): Promise<GetCurrentLoginInformations> {
    let result = await http.get('/Session/GetCurrentLoginInformations', {
      headers: {
        'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
      },
    });
    return result.data.result;
  }

  public async resetCache(): Promise<any> {
    let result = await http.get('/Session/ResetCache');
    return result.data.result;
  }

  public async resetAllCache(): Promise<any> {
    let result = await http.get('/Session/ResetAllCache');
    return result.data.result;
  }

  public async resetPermissionCache(): Promise<any> {
    let result = await http.get('/Session/ResetPermissionCache');
    return result.data.result;
  }

  public async getAllCache(): Promise<any> {
    let result = await http.get('/Session/GetAllCache');
    return result.data.result;
  }

  // post calll beloww
  public async resetUserCache() {
    let result = await http.post('/Session/ResetUserCache');
    return result.data.result;
  }
}

export default new SessionService();
