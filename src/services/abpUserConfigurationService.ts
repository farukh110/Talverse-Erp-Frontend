import http from './httpService';

class AbpUserConfigurationService {
  public async getAll() {
    const result = await http.get('/UserConfiguration/GetAll?culture=en');
    return result;
  }
}

export default new AbpUserConfigurationService();
