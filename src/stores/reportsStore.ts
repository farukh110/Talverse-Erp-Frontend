
import { store } from 'react-context-hook';
import { ContentRequestDto } from '../services/Content/dto/contentRequestDto';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';
import { khumsRequestDto, OrderMarkAsDoneDto, OrderRemarksDto, orderRequestDto } from '../services/reports/dto/reportsDto';
import reportsService from '../services/reports/reportsService';

class ReportsStore {

  static AppStateKeys = {
    
    REMARKS_ORDER: "remarksOrder",
    VIEW_ORDER: "viewOrder"
  }

  //------------------ transfer package report store ---------------------- 

  async GetTransferPackageReport(requestParameter: ContentRequestDto) {
    let result = await reportsService.GetTransferPackageReport(requestParameter);
    return result;
  }

  //------------------ khums report store ----------------------

  async GetKhumsReport(filters: khumsRequestDto, pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await reportsService.GetKhumsReport(filters, pagedFilterAndSortedRequest);
    return result;
  }

  /* ------------------------------------------------------------------ ANF REPORTS  ---------------------------------------------------------------------------- */

  //------------------ khums report store ----------------------

  async GetAnfKhumsReport(filters: any) {
    let result = await reportsService.GetAnfKhumsReport(filters);
    return result;
  }


  //------------------ Operations report store ----------------------

  async GetAnfOperationsReportReport(filters: any) {
    let result = await reportsService.GetAnfOperationsReportReport(filters);
    return result;
  }

  //------------------ Sadaqah request report store ----------------------

  async GetSadaqahRequestReport(filters: orderRequestDto, pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {

    let result = await reportsService.GetSadaqahRequestReport(filters, pagedFilterAndSortedRequest);
    console.log("GetSadaqahRequestReport store main hai :", result);
    return result;
  }

  async updateMarkAsDone(Id: any, requestParameter: OrderMarkAsDoneDto) {
    let result = await reportsService.updateMarkAsDone(Id, requestParameter);
    console.log(" updateMarkAsDone store _ _ _ _ _", result);
    return result;
  }

  async updateRemarks(Id: any, requestParameter: OrderRemarksDto) {
    let result = await reportsService.updateRemarks(Id, requestParameter);
    console.log(" updateRemarks store _ _ _ _ _", result);
    return result;
  }

}

export default ReportsStore;
