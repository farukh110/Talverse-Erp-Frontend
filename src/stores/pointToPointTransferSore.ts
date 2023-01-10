import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import pointToPointTransferService from '../services/pointToPointTransfer/pointToPointTransferService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateTransferInput,
  UpdateTransferInput,
  GetTransferOutput,
} from '../services/transfer/dto/transferDto';
import { GetSupporterOutput } from '../services/supporters/dto/supportersDto';
import supportersService from '../services/supporters/supportersService';
import contentService from '../services/Content/contentService';
import { ContentRequestDto } from '../services/Content/dto/contentRequestDto';
import AppConsts from '../lib/appconst';
import { CreateSubmitTransferInput } from '../services/pointToPointTransfer/dto/pointToPointTransferDto';
import { L } from '../lib/abpUtility';

class PointToPointTransferSore {
  transfer!: PagedResultDto<GetTransferOutput>;
  supporter!: PagedResultDto<GetSupporterOutput>;
  editTransfer!: CreateOrUpdateTransferInput;

  static AppStateKeys = {
    TRANSFER: "p2p_transfer",
    TRANSFER_VIEW: "p2p_transferView",
    SUPPORTER: "p2p_supporter",
    EDIT_TRANSFER: "p2p_editTransfer",
    TRANSFER_DETAILS: "p2p_TRANSFER_DETAILS",
    TRANSFER_DISPATCH_DYNAMIC_DETAILS: "p2p_TRANSFER_DISPATCH_DYNAMIC_DETAILS",
    PENDING_TRANSFERS_SELECTED_KEYS: "p2p_SELECTED_KEYS",
    DATA_SOURCE_EXCHANGE: "p2p_DATA_SOURCE_EXCHANGE",
    FILE_LIST: "p2p_FILE_LIST",
    EXCHANGE_COUNTER: "p2p_EXCHANGE_COUNTER",
    RETAIN_TRANSFER_DATA: "p2p_RETAIN_TRANSFER_DATA",
    originOrDestination: {
      SELECT_ORIGIN: 'selectOrigin',
      SELECT_DESTINATION: 'selectDestination',
      SELECT_DISPATCH_DESTINATION: 'SelectDestination'
    },
    prefixes: {
      SELECTED_PAYMENTS: "selectedPayments_",
      TRANSFER_AMOUNT: "_transferAmount"

    }
  }



  async create(createTransferInput: CreateOrUpdateTransferInput) {
    let result = await pointToPointTransferService.create(createTransferInput);
    this.transfer.items.push(result);
  }
  async update(updateTransferInput: UpdateTransferInput) {
    let result = await pointToPointTransferService.update(updateTransferInput);
    this.transfer.items = this.transfer.items.map((x: GetTransferOutput) => {
      if (x.id === updateTransferInput.id) {
        x = result;
      }
      return x;
    });
  }

  async delete(entityDto: EntityDto) {
    let res = await pointToPointTransferService.delete(entityDto);
    if (res.success) {
      this.transfer.items = this.transfer.items.filter((x: GetTransferOutput) => x.id !== entityDto.id);
      this.transfer.totalCount = this.transfer.items.length;
      store.set(PointToPointTransferSore.AppStateKeys.TRANSFER, { ...this.transfer });
    }
  }

  async get(entityDto: EntityDto) {
    let result = await pointToPointTransferService.get(entityDto);
    this.editTransfer = result;
    store.set(PointToPointTransferSore.AppStateKeys.EDIT_TRANSFER, result);
  }

  async createTransfer() {
    this.editTransfer = {

      id: 0,
      orderType: '',
      name: '',
      currencySymbol: '',
      currencyName: '',
      pendingAmount: 0,
      transferAmount: 0,
      isSelected: true,
      ordersList: [
        {
          name: '',
          currencySymbol: '',
          currencyName: '',
          orderId: 0,
          orderDetailId: 0,
          pendingAmount: 0,
          transferAmount: 0,
          isSelected: true
        }
      ],
      productId: 0,
      currencyId: 0,
      campaignId: 0,
      transferId: 0

    };
    //store.set(PointToPointTransferSore.AppStateKeys.EDIT_TRANSFER, this.editTransfer)
  }

  // get All transfer 
  async getAllTransfer(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await pointToPointTransferService.getAllTransfer(pagedFilterAndSortedRequest);
    this.transfer = result;
    store.set(PointToPointTransferSore.AppStateKeys.TRANSFER, result)
    return result;
  }

  async getAllPendingTransfer(repId: string) {
    let result = await pointToPointTransferService.getAllPendingTransfer(repId);
    this.transfer = result;
    store.set(PointToPointTransferSore.AppStateKeys.TRANSFER, result)
    return result;
  }

  // get All supporter 
  async getAllSupporter(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await supportersService.getAllSupporters(pagedFilterAndSortedRequest);
    this.supporter = result;
    store.set(PointToPointTransferSore.AppStateKeys.SUPPORTER, result)
    return result;
  }

  // get transfer package details 
  async getAllTransferPackageDetails(requestObj: any, userId: Number, sourceTpId: Number) {
    let result = await pointToPointTransferService.getAllTransferPackageDetails(requestObj, 2, sourceTpId);
    //this.transfer = result;
    // store.set(PointToPointTransferSore.AppStateKeys.TRANSFER, result)
    return result;
  }


  async postTransfer(postBody: CreateSubmitTransferInput) {
    let result = await pointToPointTransferService.postTransfer(postBody);
    return result;
  }


  async GetComponentData(requestParameter: ContentRequestDto, mode: string) {

    let result = await contentService.GetComponentData(requestParameter);
    if (mode === L(AppConsts.actionNames.DETAIL_VIEW)) {
      store.set(PointToPointTransferSore.AppStateKeys.TRANSFER_VIEW, result);
    }
    else if (mode == "GetAll") {
      store.set(PointToPointTransferSore.AppStateKeys.TRANSFER, result);
    }
    else if (mode == L(AppConsts.actionNames.EDIT)) {
      store.set(PointToPointTransferSore.AppStateKeys.EDIT_TRANSFER, result);
    }

    // store.set(OrdersStore.AppStateKeys.EDIT_ORDER, result);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }



  async getAllCSVData() {
    let result = await pointToPointTransferService.getAllTransfer({
      maxResultCount: 300000,
      skipCount: 0,
      keyword: "",
      sorting: ""
    });
    return result.items;
  }

  async changeLanguage(languageName: string) {
    await pointToPointTransferService.changeLanguage({ languageName: languageName });
  }

  async acknowledgeTransfer(transferId: Number) {
    await pointToPointTransferService.acknowledgeTransfer(transferId);
  }


  //#region  Transfer Related Functions 

  createInputObjForGetTransferPackage(formValues: any, pendingTransfersList: any, alreadySelectedRows: any) {
    try {
      let transferSelectedItemsList = pendingTransfersList;
      const namePrefix = PointToPointTransferSore.AppStateKeys.prefixes.SELECTED_PAYMENTS;
      const nameSuffix = PointToPointTransferSore.AppStateKeys.prefixes.TRANSFER_AMOUNT;

      this.setDefaultSelectionToFalse(transferSelectedItemsList);

      for (let i = 0; i < alreadySelectedRows.length; i++) {
        let splititems = alreadySelectedRows[i].split('-');
        if (splititems.length === 2) {
          let item = transferSelectedItemsList.find((item: any) => item.currencyId == splititems[1]);
          if (item) {
            let key = `${namePrefix}${splititems[1]}${nameSuffix}`;
            item.isSelected = true;
            item.transferAmount = formValues[key] ? formValues[key] : item.transferAmount;
          }

        }
      }
      return transferSelectedItemsList;
    }
    catch (ex) {
      console.log(`error: ${ex}`);
    }
  }



  setDefaultSelectionToFalse(transferSelectedItemsList: any) {

    try {
      transferSelectedItemsList.forEach((element: any) => {
        element.isSelected = false;
        if (element.ordersList) {
          element.ordersList.forEach((childElement: any) => {
            childElement.isSelected = false;
          })
        }
      });
    }
    catch (ex) {
      console.log(`error: ${ex}`);
    }

  }

  setDefaultSelectionColumn(transferSelectedItemsList: any) {

    try {
      transferSelectedItemsList.forEach((element: any) => {
        element.isSelected = true;
        element.transferAmount = element.amount;
      });
    }
    catch (ex) {
      console.log(`error: ${ex}`);

    }
    return transferSelectedItemsList;

  }

  setDefaultTransferAmount(transferSelectedItemsList: any) {

    try {
      transferSelectedItemsList.forEach((element: any) => {
        element.transferAmount = element.amount;
      });
    }
    catch (ex) {
      console.log(`error: ${ex}`);

    }
    return transferSelectedItemsList;

  }

  async getSubmitTransferPayload(formValues: any, subFormFields: any, pendingTransfersList: any, fileListState: any, transferPackage: any, exchangeList: any) {
    let keyvalues: any = [];
    Object.keys(formValues).forEach(function (key) {
      let field = subFormFields.find((item: any) => item.internalName == key);
      if (field) {
        keyvalues.push({ key: key, value: formValues[key] });
      }
    });
    console.log('BEFORE MAKING YAARA', pendingTransfersList);
    let selectedlist = pendingTransfersList?.balanceAmount.filter((item: any) => item.isSelected === true);

    console.log(selectedlist, 'selectedlistselectedlistselectedlistselectedlist');

    let selectedListNew = selectedlist.map((Item: any) => {
      return {
        currencyId: Item.currencyId,
        currency: Item.currencyCode,
        amount: Item.transferAmount,
        pendingAmount: Item.amount
      }

    });


    // let transferDetails: any = { selectedPayments: [], transferredPayments: [] };
    // transferDetails.selectedPayments = selectedListNew;
    // transferDetails.transferredPayments = exchangeList;
    // creating post Data object
    let postPayload: CreateSubmitTransferInput = {
      input: fileListState && fileListState.fileList ? fileListState.fileList : [],
      payload: {
        transferId: transferPackage.id,
        packageId: transferPackage.packageId,
        transferDetails: exchangeList,
        paymentDetails: selectedListNew,
        exchangeHistory: formValues.exchangeDetails ? formValues.exchangeDetails : [],
        transferToId: formValues.SelectDestination,
        additionalData: keyvalues,
        // transferItemList: selectedlist,
        sourceTransferPointId: formValues.selectOrigin
      }

    };
    return postPayload;
  }

  //#endregion
}

export default PointToPointTransferSore;
