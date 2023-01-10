import { store } from 'react-context-hook';
import cashOutService from '../services/cashOut/cashOutService';
import { CashOutRequestDto } from '../services/cashOut/dto/cashOutRequestDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import utils from '../utils/utils';

class CashOutStore {
  

  async submitCashOut(requestParameter: CashOutRequestDto) {
    let result = await cashOutService.submitCashOut(requestParameter);
    return result;
  }

  

}

export default CashOutStore;
