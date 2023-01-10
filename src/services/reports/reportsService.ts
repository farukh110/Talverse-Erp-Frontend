
import AppConsts from '../../lib/appconst';
import { ContentRequestDto } from '../Content/dto/contentRequestDto';

import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import http from '../httpService';
import { khumsRequestDto, OrderMarkAsDoneDto, OrderRemarksDto, orderRequestDto } from './dto/reportsDto';

//------------------ transfer package report service ---------------------- 

class reportsService {

    public async GetTransferPackageReport(contentRequest: ContentRequestDto) {
        let result = await http.post('/ERPReport/GetTransferPackageReport', contentRequest);
        return result.data.result;
    }


    //------------------ khums report service ----------------------

    public async GetKhumsReport(filters: khumsRequestDto, pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {

        let QueryString = "";
        if (String(filters) != '') {
            QueryString = encodeURI(JSON.stringify(filters));
        }
        pagedFilterAndSortedRequest['filter'] = QueryString;
        let result = await http.get('/Akh/Reports/Khums', { params: pagedFilterAndSortedRequest });
        return result.data.result;
    }

    /* ------------------------------------------------------------------ ANF REPORTS  ---------------------------------------------------------------------------- */


    //------------------ khums report service ----------------------

    public async GetAnfKhumsReport(filters: any) {

        let objAppHeader = {};
        objAppHeader[AppConsts.authorization.authorizationKey] = AppConsts.erpApps.NajfayiaApi.authorizationKey;
        let configHeader = { headers: objAppHeader };

        let QueryString = encodeURI(JSON.stringify(filters));
        let result = await http.get(`${AppConsts.anfReportBaseUrl}/reports/khumsReportAkh`, { params: { filter: QueryString }, headers: objAppHeader });
        return result.data.data;
    }

    //------------------ Operation report service ----------------------

    public async GetAnfOperationsReportReport(filters: any) {

        let objAppHeader = {};
        objAppHeader[AppConsts.authorization.authorizationKey] = AppConsts.erpApps.NajfayiaApi.authorizationKey;
        let configHeader = { headers: objAppHeader };

        let QueryString = encodeURI(JSON.stringify(filters));
        let result = await http.get(`${AppConsts.anfReportBaseUrl}/reports/mergerReportAkh`, { params: { filter: QueryString }, headers: objAppHeader },);
        return result.data.data;
    }

    // start sadaqahty request report

    public async GetSadaqahRequestReport(filters: orderRequestDto, pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {

        let QueryString = "";
        if (String(filters) != '') {
            QueryString = encodeURI(JSON.stringify(filters));
        }
        pagedFilterAndSortedRequest['filter'] = QueryString;
        let result = await http.get('/Order/GetOrderPerformanceBased', { params: pagedFilterAndSortedRequest });
        console.log("GetSadaqahRequestReport service main hai ..... :", result.data.result);
        return result.data.result;
    }

    public async updateMarkAsDone(Id: any, orderMarkAsDoneDto: OrderMarkAsDoneDto) {

        let result = await http.patch(`/Orders/${Id}`, orderMarkAsDoneDto);
        console.log(" result of updateMarkAsDone service _ _ _ _", result);
        return result.data;
    }

    public async updateRemarks(Id: any, orderRemarksDto: OrderRemarksDto) {

        let result = await http.patch(`/Orders/${Id}`, orderRemarksDto);
        console.log(" result of updateRemarks service _ _ _ _", result);
        return result.data;
    }

    // end sadaqahty request report

}

export default new reportsService;