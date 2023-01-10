import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateSupporterInput,
  GetAllSupporterOutput,
  UpdateSupporterInput,
  UpdateUserProductSettingsOutput
} from './dto/supportersDto';
import { UpdateSupporterProfileRequestDto } from '../user/dto/createOrUpdateUserInput';

class supportersService {

  public async create(createSupporterInput: CreateOrUpdateSupporterInput) {
    let result = await http.post('/Supporter/Add', createSupporterInput);
    return result.data.result;
  }

  public async update(updateSupporterInput: UpdateSupporterInput) {
    let result = await http.put('/Supporter/Update', updateSupporterInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/Supporter/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateSupporterInput> {
    let result = await http.get('/Supporter/Get', { params: entityDto });
    return result.data.result;
  }
  
  public async getAllSupporters(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllSupporterOutput>> {
    let result = await http.get('/Supporter/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAssociatedRepSupporters(Id : Number) {
    let result = await http.get('/Supporter/GetRepSupportersByRepId',   { params: {supporterId:Id} } );
    return result.data.result;
  }

  public async getSupporterProfile(): Promise<any> {
    let result = await http.get('/Supporter/GetSupporterProfileErp');
    return result.data.result;
  }

  public async updateSupporterProfile(requestObj: UpdateSupporterProfileRequestDto) {
    let result = await http.post('/Supporter/UpdateSupporterProfileErp', requestObj);
    return result.data.result;
  }

  public async updateUserProductSettings(requestObj: UpdateUserProductSettingsOutput) {
    let result = await http.post('/Supporter/UpdateUserProductSettings', requestObj);
    return result.data;
  }
}

export default new supportersService;