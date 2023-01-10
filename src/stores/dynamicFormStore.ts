

import { store } from 'react-context-hook';
import { GetDynamicFormRequestDto } from '../services/dynamicForm/dto/getDynamicFormRequestDto';
import dynamicFormService from '../services/dynamicForm/dynamicFormService';

class DynamicFormStore {

    formsList!: [];
    static AppStateKeys = {
        FORM: "forms",
    }

    async getForm(postBody: GetDynamicFormRequestDto) {
        let result = await dynamicFormService.getProductDynamicForm(postBody);
        return result;
        //store.set(DynamicFormStore.AppStateKeys.FORM, result)
    }

    async getFormDataItemsByProductId(id: Number) {
        let result = await dynamicFormService.getFormDataItemsByProductId(id);
        return result;
        //store.set(DynamicFormStore.AppStateKeys.FORM, result)
    }

    async getFormDataItemsByCampaignId(id: Number) {
        let result = await dynamicFormService.getFormDataItemsByCampaignId(id);
        return result;
        //store.set(DynamicFormStore.AppStateKeys.FORM, result)
    }

    async getAssociatedRepSupporters(id: Number) {
        let result = await dynamicFormService.getAssociatedRepSupporters(id);
        return result;
        //store.set(DynamicFormStore.AppStateKeys.FORM, result)
    }

}

export default DynamicFormStore;
