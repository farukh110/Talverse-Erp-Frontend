import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';

import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateProductInput,
  GetAllProductOutput,
  UpdateProductInput
} from '../products/dto/productsDto';

class donorsService {

  public async create(createProductInput: CreateOrUpdateProductInput) {
    let result = await http.post('/Donor/Add', createProductInput);
    return result.data.result;
  }

  public async update(updateProductInput: UpdateProductInput) {
    let result = await http.put('/Donor/Update', updateProductInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/Donor/Delete', { params: entityDto });
    return result.data;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateProductInput> {
    let result = await http.get('/Donor/GetWithTranslations', { params: entityDto });
    return result.data.result;
  }

  public async getAllProducts(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllProductOutput>> {
    let result = await http.get('/Donor/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

}

export default new donorsService;