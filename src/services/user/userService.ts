import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { ChangePasswordRequestDto, CreateOrUpdateUserInput, ResetPasswordRequestDto } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import AppConsts from '../../lib/appconst';

class UserService {
  public async create(createUserInput: CreateOrUpdateUserInput) {
    let result = await http.post('/User/AddUser', createUserInput);
    return result.data.result;
  }

  public async update(updateUserInput: UpdateUserInput) {
    let result = await http.put('/User/Update', updateUserInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/User/Delete', { params: entityDto });
    return result.data;
  }

  public async getRoles() {
    let result = await http.get('/User/GetRoles');
    return result.data.result.items;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateUserInput> {
    let result = await http.get('/User/Get', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllUserOutput>> {
    let result = await http.get('/User/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async changePassword(changeLanguageInput: ChangePasswordRequestDto) {
    let result = await http.post('/User/ChangePassword', changeLanguageInput);
    return result.data;
  }

  public async sendForgotPasswordToken(userName: string) {
      let result = await http.post(`/UserConfiguration/SendForgotPasswordToken?userName=${userName}`);
      return result.data;
  }

  public async resetPassword(requestObj: ResetPasswordRequestDto) {
      let result = await http.post('/UserConfiguration/ResetForgotPassword', requestObj);
      console.log(result, 'RESPONSE FROMS SERVICE');
      return result.data;
  }

}

export default new UserService();
