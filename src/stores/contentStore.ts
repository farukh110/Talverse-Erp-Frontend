import { store } from 'react-context-hook';
import contentService from '../services/Content/contentService';
import { ContentRequestDto, SavedRequestDto } from '../services/Content/dto/contentRequestDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import utils from '../utils/utils';

class ContentStore {
  
  static AppStateKeys = {

    CONTENT: "content",
    EDIT_CONTENT: "editContent",
    VIEW_CONTENT: "viewContent",

  }

  async create(requestParameter: ContentRequestDto) {
    let result = await contentService.create(requestParameter);
    return result;
    // store.set(ContentStore.AppStateKeys.CONTENT, result);
  }

  async createNewComponent(requestParameter: SavedRequestDto) {
    let result = await contentService.createNewComponent(requestParameter);
    return result;
    // store.set(ContentStore.AppStateKeys.CONTENT, result);
  }

  async GetComponent(requestParameter: ContentRequestDto) {
    let result = await contentService.GetComponent(requestParameter);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async GetComponentData(requestParameter: ContentRequestDto) {
    let result = await contentService.GetComponentData(requestParameter);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async GetComponentDataWithTranslations(requestParameter: ContentRequestDto) {
    let result = await contentService.GetComponentDataWithTranslations(requestParameter);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

}

export default ContentStore;
