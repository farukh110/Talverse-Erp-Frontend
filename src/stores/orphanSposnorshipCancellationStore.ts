import { store } from 'react-context-hook';
import { oprhanSponsorshipCancellationRequestDto } from '../services/orphanSponsorShipCanellation/dto/orphanSponsorshipCancellationRequestDto';
import orphanSponsorshipCancellationService from '../services/orphanSponsorShipCanellation/orphanSponsorshipCancellationService';
import utils from '../utils/utils';

class OrphanSposnorshipCancellationStore {

  async submitCancellationRequest(requestParameter: oprhanSponsorshipCancellationRequestDto) {
    let result = await orphanSponsorshipCancellationService.submitOrphanSponsorShipCancellation(requestParameter);
    return result;
  }

}

export default OrphanSposnorshipCancellationStore;
