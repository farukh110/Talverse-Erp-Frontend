
import http from '../httpService';
import { GrantTransferPointPermission } from './dto/permissionDto';


class permissionService {

    public async grantTransferPointPermission(requestobj: GrantTransferPointPermission) {
        let result = await http.post('/Permission/GrantTransferPointPermission', requestobj);
        return result.data;
    }


    public async revokeTransferPointPermission(requestobj: GrantTransferPointPermission) {
        let result = await http.post('/Permission/RevokeTransferPointPermission', requestobj);
        return result.data;
    }


}

export default new permissionService;