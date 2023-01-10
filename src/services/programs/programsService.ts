import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import http from '../httpService';
import { ChangeLanguagaInput } from '../user/dto/changeLanguageInput';

import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateProgramInput,
  GetAllProgramOutput,
  UpdateProgramInput
} from './dto/programsDto';

class programsService {

  public async create(createProgramInput: CreateOrUpdateProgramInput) {
    let result = await http.post('/Program/Add', createProgramInput);
    return result.data.result;
  }

  public async update(updateProgramInput: UpdateProgramInput) {
    let result = await http.put('/Program/Update', updateProgramInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/Program/Delete', { params: entityDto });
    return result.data;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateProgramInput> {
    let result = await http.get('/Program/GetWithTranslations', { params: entityDto });
    return result.data.result;
  }

  public async getAllPrograms(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllProgramOutput>> {
    let result = await http.get('/Program/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

}

export default new programsService;