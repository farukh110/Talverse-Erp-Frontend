// import { action, observable } from 'mobx';

import { CreateRoleInput } from '../services/role/dto/createRoleInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput';
import { GetAllRoleOutput } from '../services/role/dto/getAllRoleOutput';
import { GetRoleAsyncInput } from '../services/role/dto/getRolesAsyncInput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedRoleResultRequestDto } from '../services/role/dto/PagedRoleResultRequestDto';
import RoleEditModel from '../models/Roles/roleEditModel';
import { UpdateRoleInput } from '../services/role/dto/updateRoleInput';
import roleService from '../services/role/roleService';

class RoleStore {
  roles!: PagedResultDto<GetAllRoleOutput>;
  roleEdit: RoleEditModel = new RoleEditModel();
  allPermissions: GetAllPermissionsOutput[] = [];

  async create(createRoleInput: CreateRoleInput) {
    await roleService.create(createRoleInput);
  }

  async createRole() {
    this.roleEdit = {
      grantedPermissionNames: [],
      role: {
        name: '',
        displayName: '',
        description: '',
        id: 0,
      },
      permissions: [{ name: '', displayName: '', description: '' }],
    };
  }

  
  async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput) {
    await roleService.getRolesAsync(getRoleAsyncInput);
  }

  
  async update(updateRoleInput: UpdateRoleInput) {
    await roleService.update(updateRoleInput);
    this.roles.items
      .filter((x: GetAllRoleOutput) => x.id === updateRoleInput.id)
      .map((x: GetAllRoleOutput) => {
        return (x = updateRoleInput);
      });
  }

  
  async delete(entityDto: EntityDto) {
    await roleService.delete(entityDto);
    this.roles.items = this.roles.items.filter((x: GetAllRoleOutput) => x.id !== entityDto.id);
  }

  
  async getAllPermissions() {
    var result = await roleService.getAllPermissions();
    this.allPermissions = result;
  }

  
  async getRoleForEdit(entityDto: EntityDto) {
    let result = await roleService.getRoleForEdit(entityDto);
    this.roleEdit.grantedPermissionNames = result.grantedPermissionNames;
    this.roleEdit.permissions = result.permissions;
    this.roleEdit.role = result.role;
  }

  
  async get(entityDto: EntityDto) {
    var result = await roleService.get(entityDto);
    this.roles = result.data.result;
  }

  
  async getAll(pagedFilterAndSortedRequest: PagedRoleResultRequestDto) {
    let result = await roleService.getAll(pagedFilterAndSortedRequest);
    this.roles = result;
  }
}

export default RoleStore;
