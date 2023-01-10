
import http from '../httpService';
import { oprhanSponsorshipCancellationRequestDto } from './dto/orphanSponsorshipCancellationRequestDto';


class OrphanSponsorshipCancellationService {

    public async submitOrphanSponsorShipCancellation(contentRequest: oprhanSponsorshipCancellationRequestDto) {
        let result = await http.post('Orphan/SubmitCancellationRequest', contentRequest);
        return result.data.result;
    }
}

export default new OrphanSponsorshipCancellationService();
