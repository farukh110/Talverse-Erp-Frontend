// import { action, observable } from 'mobx';
import { store } from 'react-context-hook';
import { GrantTransferPointPermission } from '../services/permission/dto/permissionDto';
import permissionService from '../services/permission/permissionService';


class PermissionStore {

    async grantTransferPointPermission(requestobj: GrantTransferPointPermission) {
        let result = await permissionService.grantTransferPointPermission(requestobj)
        return result;
    }

    async revokeTransferPointPermission(requestobj: GrantTransferPointPermission) {
        let result = await permissionService.revokeTransferPointPermission(requestobj)
        return result;
    }


}

export default PermissionStore;
