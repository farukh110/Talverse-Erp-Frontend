import { ChangePasswordRequestDto, CreateOrUpdateUserInput, ResetPasswordRequestDto } from '../services/user/dto/createOrUpdateUserInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { GetUserOutput } from '../services/user/dto/getUserOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { UpdateUserInput } from '../services/user/dto/updateUserInput';
import userService from '../services/user/userService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';
class UserStore {
  users!: PagedResultDto<GetUserOutput>;
  editUser!: CreateOrUpdateUserInput;
  roles: GetRoles[] = [];
  static AppStateKeys = {
    USERS: "users",
    EDIT_USER: "editUser"
  }
  async create(createUserInput: CreateOrUpdateUserInput) {
    let result = await userService.create(createUserInput);
    this.users.items.push(result);
  }
  async update(updateUserInput: UpdateUserInput) {
    let result = await userService.update(updateUserInput);
    this.users.items = this.users.items.map((x: GetUserOutput) => {
      if (x.id === updateUserInput.id) {
        console.log(result);
        x = result;
      }
      return x;
    });
  }

  async delete(entityDto: EntityDto) {
    let res = await userService.delete(entityDto);
    if (res.success) {
      this.users.items = this.users.items.filter((x: GetUserOutput) => x.id !== entityDto.id);
      this.users.totalCount = this.users.items.length;
      store.set(UserStore.AppStateKeys.USERS, { ...this.users });
    }
  }

  async getRoles() {
    let result = await userService.getRoles();
    this.roles = result;
  }

  async get(entityDto: EntityDto) {
    let result = await userService.get(entityDto);
    this.editUser = result;
    store.set(UserStore.AppStateKeys.EDIT_USER, result);
  }

  async createUser() {
    this.editUser = {
      userName: '',
      name: '',
      surname: '',
      emailAddress: '',
      isActive: false,
      roleNames: [],
      password: '',
      id: 0,
    };
    store.set(UserStore.AppStateKeys.EDIT_USER, this.editUser)
    this.roles = [];
  }
  async getAll(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await userService.getAll(pagedFilterAndSortedRequest);
    this.users = result;
    store.set(UserStore.AppStateKeys.USERS, result)
    return result;
  }

  async getAllCSVData() {
    let result = await userService.getAll({
      maxResultCount: 300000,
      skipCount: 0,
      keyword: "",
      sorting: "userName"
    });
    return result.items;
  }

  async changeLanguage(languageName: string) {
    await userService.changeLanguage({ languageName: languageName });
  }
  async changePassword(requestObj: ChangePasswordRequestDto) {
    await userService.changePassword(requestObj);
  }

  async sendForgotPasswordToken(userName: string) {
    return await userService.sendForgotPasswordToken(userName);
  }

  async resetPassword(requestObj: ResetPasswordRequestDto) {
    return await userService.resetPassword(requestObj);
  }
}

export default UserStore;
