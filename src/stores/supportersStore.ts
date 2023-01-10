import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
    CreateOrUpdateSupporterInput,
    UpdateSupporterInput,
    GetSupporterOutput,
    UpdateUserProductSettingsOutput
} from '../services/supporters/dto/supportersDto';
import supportersService from '../services/supporters/supportersService';
import { UpdateSupporterProfileRequestDto } from '../services/user/dto/createOrUpdateUserInput';

class SupportersStore {
    supporters!: PagedResultDto<GetSupporterOutput>;
    editSupporter!: CreateOrUpdateSupporterInput;

    static AppStateKeys = {
        SUPPORTERS: "supporters",
        EDIT_SUPPORTER: "editSupporters"
    }
    async create(createSupporterInput: CreateOrUpdateSupporterInput) {
        let result = await supportersService.create(createSupporterInput);
        this.supporters.items.push(result);
    }
    async update(updateSupporterInput: UpdateSupporterInput) {
        let result = await supportersService.update(updateSupporterInput);
        this.supporters.items = this.supporters.items.map((x: GetSupporterOutput) => {
            if (x.id === updateSupporterInput.id) {
                console.log(result);
                x = result;
            }
            return x;
        });
    }

    async delete(entityDto: EntityDto) {
        let res = await supportersService.delete(entityDto);
        if (res.success) {
            this.supporters.items = this.supporters.items.filter((x: GetSupporterOutput) => x.id !== entityDto.id);
            this.supporters.totalCount = this.supporters.items.length;
            store.set(SupportersStore.AppStateKeys.SUPPORTERS, { ...this.supporters });
        }
    }

    async get(entityDto: EntityDto) {
        let result = await supportersService.get(entityDto);
        this.editSupporter = result;
        store.set(SupportersStore.AppStateKeys.EDIT_SUPPORTER, result);
    }


    // get all supporters 
    async getAllSupporters(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
        let result = await supportersService.getAllSupporters(pagedFilterAndSortedRequest);
        this.supporters = result;
        store.set(SupportersStore.AppStateKeys.SUPPORTERS, result)
        return result;
    }

    async getAllCSVData() {
        let result = await supportersService.getAllSupporters({
            maxResultCount: 300000,
            skipCount: 0,
            keyword: "",
            sorting: ""
        });
        return result.items;
    }

    async getSupporterProfile() {
        let result = await supportersService.getSupporterProfile();
        return result;
    }

    async updateSupporterProfile(requestObj: UpdateSupporterProfileRequestDto) {
        let result = await supportersService.updateSupporterProfile(requestObj);
        return result;
    }
    async updateUserProductSettings(reqObj: UpdateUserProductSettingsOutput) {
        let result = await supportersService.updateUserProductSettings(reqObj);
        return result;
    }
}

export default SupportersStore;
