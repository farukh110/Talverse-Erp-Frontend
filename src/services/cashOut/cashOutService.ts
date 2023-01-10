
import http from '../httpService';
import { CashOutRequestDto } from './dto/cashOutRequestDto';


class cashOutService {

    public async submitCashOut(contentRequest: CashOutRequestDto) {
        let result = await http.post('/CashOut/SubmitCashOut', contentRequest);
        return result.data;
    }
}

export default new cashOutService();
