
import http from '../httpService';
import { ContentRequestDto, SavedRequestDto } from './dto/contentRequestDto';

class contentService {

    public async create(contentRequest: ContentRequestDto) {

        let result = await http.post('/Content/GetComponent', contentRequest);
        return result.data.result;
    }

    public async createNewComponent(contentRequest: SavedRequestDto) {

        let result = await http.post('/Content/SaveContent', contentRequest);
        return result.data.result;
    }

    public async GetComponent(contentRequest: ContentRequestDto) {
        let result = await http.post('/Content/GetComponent', contentRequest);
        return result.data.result;
    }

    public async GetComponentData(contentRequest: ContentRequestDto) {
        let result = await http.post('/Content/GetComponentData', contentRequest);
        return result.data.result;
    }

    public async GetComponentDataWithTranslations(contentRequest: ContentRequestDto) {
        let result = await http.post('/Content/GetComponentDataWithTranslations', contentRequest);
        return result.data.result;
    }


}

export default new contentService();
