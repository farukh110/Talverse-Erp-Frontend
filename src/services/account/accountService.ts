import { RegisterInput } from './dto/registerInput';
import { RegisterOutput } from './dto/registerOutput';
import http from '../httpService';

class AccountService {
  public async register(registerInput: RegisterInput): Promise<RegisterOutput> {
    let result = await http.post('/Account/Register', registerInput);
    return result.data.result;
  }
}

export default new AccountService();
