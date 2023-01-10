
import { EntityDto } from '../../services/dto/entityDto';
import http from '../httpService';
import { GetDynamicFormRequestDto } from './dto/getDynamicFormRequestDto';

class DynamicFormService {
 

    public async getProductDynamicForm(formId : GetDynamicFormRequestDto) {
    let result = await http.post('/ProductForm/GetProductFormDetailsById',  formId );
    return result.data.result;
  }

  public async getFormDataItemsByProductId(Id : Number) {
    let result = await http.get('/ProductForm/GetProductFormsByProductId',   { params: {input:Id} } );
    return result.data.result;
  }

  public async getAssociatedRepSupporters(Id : Number) {
    let result = await http.get('/Supporter/GetRepSupportersByRepId',   { params: {supporterId:Id} } );
    return result.data.result;
  }

  public async getFormDataItemsByCampaignId(Id : Number) {
    let result = await http.get('/ProductForm/GetProductFormsByCampaignId',   { params: {input:Id} } );
    return result.data.result;
  }

}

export default new DynamicFormService();
