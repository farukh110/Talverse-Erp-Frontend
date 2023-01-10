import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';

import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateProgramCategoryInput,
  GetAllProgramCategoryOutput,
  UpdateProgramCategoryInput
} from './dto/programCategoryDto';

class programCategoryService {

  public async create(createProgramCategoryInput: CreateOrUpdateProgramCategoryInput) {
    let result = await http.post('/ProgramCategory/Add', createProgramCategoryInput);
    return result.data.result;
  }

  public async update(updateProgramCategoryInput: UpdateProgramCategoryInput) {
    let result = await http.put('/ProgramCategory/Update', updateProgramCategoryInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/ProgramCategory/Delete', { params: entityDto });
    return result.data;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateProgramCategoryInput> {
    let result = await http.get('/ProgramCategory/GetWithTranslations', { params: entityDto });
    return result.data.result;
  }

  public async getAllProgramCategory(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllProgramCategoryOutput>> {
    let result = await http.get('/ProgramCategory/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

}

export default new programCategoryService;