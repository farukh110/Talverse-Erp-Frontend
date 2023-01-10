import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';
import AppConsts from '../../lib/appconst';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateTransferInput,
  GetAllTransferOutput,
  UpdateTransferInput
} from './dto/transferDto';

class transferService {

  public async create(createTransferInput: CreateOrUpdateTransferInput) {
    let result = await http.post('/Transfer/Add', createTransferInput);
    return result.data.result;
  }

  public async update(updateTransferInput: UpdateTransferInput) {
    let result = await http.put('/Transfer/Update', updateTransferInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/Transfer/Delete', { params: entityDto });
    return result.data;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateTransferInput> {
    var objAppHeader = {};
    objAppHeader[AppConsts.authorization.sourceAppKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let result = await http.get('/Transfer/GetAllPendingTransfers', { params: entityDto, headers: objAppHeader });
    return result.data.result;
  }

  public async getAllTransfer(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllTransferOutput>> {
    let result = await http.get('/Transfer/GetAllPendingTransfers', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllPendingTransfer(repId: string): Promise<PagedResultDto<GetAllTransferOutput>> {
    let result = await http.get('/Transfer/GetAllPendingTransfers', { params: { userId: repId } });
    return result.data.result;
  }

  public async getAllTransferPackageDetails(requestObj: any, userId: string, packageId: string) {
    let result = await http.post(`/Transfer/GetTransferPackageDetails?userId=${userId}&packageId=${packageId}`, requestObj);
    return result.data.result;
  }



  public async postTransfer(postBody: any) {
    let postData = new FormData();
    for (let i = 0; i < postBody.input.length; i++) {
      postData.append('input', postBody.input[i]);
    }
    postData.append('payload', JSON.stringify(postBody.payload));
    var reqHeaders = {};
    reqHeaders[AppConsts.authorization.sourceAppKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    reqHeaders["Content-Type"] = "multipart/form-data";
    let configHeader = { headers: reqHeaders };
    let result = await http.post('/Transfer/SubmitTransfer', postData, configHeader);
    return result.data.result;
  }
  public async updateTransfer(postBody: any) {
    let postData = new FormData();
    for (let i = 0; i < postBody.input.length; i++) {
      postData.append('input', postBody.input[i]);
    }
    postData.append('payload', JSON.stringify(postBody.payload));
    var reqHeaders = {};
    reqHeaders[AppConsts.authorization.sourceAppKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    reqHeaders["Content-Type"] = "multipart/form-data";
    let configHeader = { headers: reqHeaders };
    let result = await http.post('/Transfer/UpdateTransfer', postData, configHeader);
    return result.data.result;
  }

  public async acknowledgeTransfer(transferId: Number) {
    let result = await http.get('/Transfer/AcknowledgePaymentTransfer', { params: { transferId: transferId } });
    return result.data.result;
  }
}

export default new transferService;