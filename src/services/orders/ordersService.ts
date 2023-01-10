
import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';

import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

import {
  CountryInvoiceDto,
  CreateOrUpdateOrderInput,
  GetAllOrderOutput,
  InsertOrderInput,
  UpdateDonationInput,
  UpdateOrderInput
} from '../orders/dto/ordersDto';
import AppConsts from '../../lib/appconst';
import { ContentRequestDto } from '../Content/dto/contentRequestDto';

class ordersService {




  public async create(createOrderInput: CreateOrUpdateOrderInput) {
    let result = await http.post('/OrderDetail/Add', createOrderInput);
    return result.data.result;
  }

  public async createOrderSaveDonation(createOrderInput: InsertOrderInput) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.appAccessKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };
    let result = await http.post('/Donation/SaveDonation', createOrderInput,configHeader);
    return result.data.result;
  }
  public async update(updateOrderInput: UpdateOrderInput) {
    let result = await http.put('/OrderDetail/Update', updateOrderInput);
    return result.data.result;
  }

  public async updateOrderDonation(updateDonationInput: UpdateDonationInput) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.sourceAppKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };

    let result = await http.put('/Donation/UpdateDonation', updateDonationInput,configHeader);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
   let result = await http.delete('/Donation/DeleteDonation', { params: {orderId:entityDto.id }});
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateOrderInput> {
    let result = await http.get('/OrderDetail/Get', { params: entityDto });
    return result && result.data ? result.data.result : null;
  }

  public async getAllOrderDetail(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllOrderOutput>> {
    let result = await http.get('/OrderDetail/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getDonationbyId(Id: Number) {
    let result = await http.get('/Donation/GetDonationDetailsById', { params: { orderId: Id } });
    return result.data.result;
  }

  // start void country invoice
  public async voidCountryInvoice(Id: any) {
    let result = await http.patch(`/Invoice/Void?invoiceNumber=${Id}`);
    return result.data.result;
  };
  // end void country invoice

  public async generateCountryInvoice(countryInvoiceobj: CountryInvoiceDto) {
    let objAppHeader = {};
    objAppHeader[AppConsts.authorization.sourceAppKey] = AppConsts.erpApps.AkhyaarApp.accessKey;
    let configHeader = { headers: objAppHeader };
    let result = await http.post('/Invoice/GenerateCountryInvoice', countryInvoiceobj,configHeader);
    return result.data.result;
  }

  public async GetCustomCsv(contentRequest: ContentRequestDto) {
    let result = await http.post('/Order/GetOperationsOrderReport', contentRequest);
    return result.data;
}

  
}

export default new ordersService();
