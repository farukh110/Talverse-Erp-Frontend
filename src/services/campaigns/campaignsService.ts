
import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';
import { CreateOrUpdateCampaignInput } from '../campaigns/dto/createOrUpdateCampaignInput';
import { GetAllCampaignOutput } from '../campaigns/dto/getAllCampaignOutput';
import { UpdateCampaignInput } from '../campaigns/dto/updateCampaignInput';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import AppConsts from '../../lib/appconst';
import { AuthorizeCampaignRequestDto, UserOrRolePermissionsRequestDto } from './dto/updateCampaignOutput';

class campaignsService {

  public async create(createCampainInput: CreateOrUpdateCampaignInput) {
    let result = await http.post('/Campaign/Add', createCampainInput);
    return result.data.result;
  }

  public async update(updateCampainInput: UpdateCampaignInput) {
    let result = await http.put('/Campaign/Update', updateCampainInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/Campaign/Delete', { params: entityDto });
    return result.data;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateCampaignInput> {
    let result = await http.get('/Campaign/GetWithTranslations', { params: entityDto });
    return result.data.result;
  }

  public async getAllCampaigns(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllCampaignOutput>> {
    let result = await http.get('/Campaign/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async authorizeCampaignToSupporter(reqObj: AuthorizeCampaignRequestDto) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.appAccessKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };
    let result = await http.post('/Campaign/UpdateCampaignSettingsForSupporter', reqObj, configHeader);
    return result.data;
  }

  public async revokeCampaignfromSupporter(reqObj: AuthorizeCampaignRequestDto) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.appAccessKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };
    let result = await http.post('/Campaign/DeleteSupporterFromCampaign', reqObj, configHeader);
    return result.data;
  }

  public async updateMultiplePermissions(reqObj: UserOrRolePermissionsRequestDto) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.appAccessKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };
    let result = await http.post('/Campaign/UpdatePermissions', reqObj, configHeader);
    return result.data;
  }

  public async updateCampaignAdditionalTarget(reqObj: AuthorizeCampaignRequestDto) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.appAccessKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };
    let result = await http.post('/Campaign/UpdateCampaignUserSettings', reqObj, configHeader);
    return result.data;
  }


}

export default new campaignsService();
