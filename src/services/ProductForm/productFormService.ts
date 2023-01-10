
import { EntityDto } from '../../services/dto/entityDto';
import http from '../httpService';
import { GetProductFormRequestDto } from './dto/getProductFormRequestDto';

class ProductFormService {
 
    public async getProductForm(formId : GetProductFormRequestDto) {
    let result = await http.post('/ProductForm/GetProductFormDetailsById',  formId );
    return result.data.result;
  }

  public async getFormDataItemsByProductId(Id : Number) {
    let result = await http.get('/ProductForm/GetProductFormsByProductId',   { params: {input:Id} } );
    return result.data.result;
  }

  public async getFormDataItemsByCampaignId(Id : Number) {
    let result = await http.get('/ProductForm/GetProductFormsByCampaignId',   { params: {input:Id} } );
    return result.data.result;
  }
}

export default new ProductFormService();
