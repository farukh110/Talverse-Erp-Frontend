import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import transferService from '../services/transfer/transferService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateTransferInput,
  UpdateTransferInput,
  GetTransferOutput,
  CreateSubmitTransferInput
} from '../services/transfer/dto/transferDto';
import { GetSupporterOutput } from '../services/supporters/dto/supportersDto';
import supportersService from '../services/supporters/supportersService';
import contentService from '../services/Content/contentService';
import { ContentRequestDto } from '../services/Content/dto/contentRequestDto';
import AppConsts from '../lib/appconst';
import { L } from '../lib/abpUtility';

class TransferStore {
  transfer!: PagedResultDto<GetTransferOutput>;
  supporter!: PagedResultDto<GetSupporterOutput>;
  editTransfer!: CreateOrUpdateTransferInput;

  static AppStateKeys = {
    TRANSFER: "transfer",
    TRANSFER_VIEW: "transferView",
    SUPPORTER: "supporter",
    EDIT_TRANSFER: "editTransfer",
    TRANSFER_DETAILS: "TRANSFER_DETAILS",
    TRANSFER_DISPATCH_DYNAMIC_DETAILS: "TRANSFER_DISPATCH_DYNAMIC_DETAILS",
    PENDING_TRANSFERS_SELECTED_KEYS: "SELECTED_KEYS",
    DATA_SOURCE_EXCHANGE: "DATA_SOURCE_EXCHANGE",
    FILE_LIST: "FILE_LIST",
    EXCHANGE_COUNTER: "EXCHANGE_COUNTER",
    RETAIN_TRANSFER_DATA: "RETAIN_TRANSFER_DATA",
    originOrDestination: {
      SELECT_ORIGIN: 'selectOrigin',
      SELECT_DESTINATION: 'selectDestination',
      SELECT_DISPATCH_DESTINATION: 'SelectDestination'
    },
    prefixes: {
      SELECTED_PAYMENTS: "selectedPayments_",
      TRANSFER_AMOUNT: "_transferAmount"

    },
    ASSOCIATED_DESTINATION_LIST: "ASSOCIATED_DESTINATION_LIST",
    IS_PARTIAL_TRANSFER: "IS_PARTIAL_TRANSFER"
  }


  // static LocalizationKeys = {
  //   LBL_EQUIVALENT_CURRENCY_IN_PACKAGE: 'Equivalent Currency & Amount in Package',
  //   LBL_SELECTED_PAYMENTS_TOTAL: 'Selected Payments Total',
  //   HDR_SELECTED_AND_EQUIVALENT: 'Selected And Equivalent Exchanged Payment',
  //   HDR_EXCHANGE_HISTORY: 'Exchange History',
  //   HDR_TRANSFER_DETAILS: 'Transfer Details',
  //   LBL_DESTINATION: 'Destination',
  //   HDR_TRANSFER_PACKAGE_CONTENTS: 'Selected Package Contents',
  //   LBL_DESTINATION_TYPE: 'Destination Type',
  //   LBL_TRACKING_NUMBER: "Tracking Number",
  //   LBL_TRANSFER_DATE: "Transfer Date"
  // }

  async create(createTransferInput: CreateOrUpdateTransferInput) {
    let result = await transferService.create(createTransferInput);
    this.transfer.items.push(result);
  }
  async update(updateTransferInput: UpdateTransferInput) {
    let result = await transferService.update(updateTransferInput);
    this.transfer.items = this.transfer.items.map((x: GetTransferOutput) => {
      if (x.id === updateTransferInput.id) {
        x = result;
      }
      return x;
    });
  }

  async delete(entityDto: EntityDto) {
    let res = await transferService.delete(entityDto);
    if (res.success) {
      this.transfer.items = this.transfer.items.filter((x: GetTransferOutput) => x.id !== entityDto.id);
      this.transfer.totalCount = this.transfer.items.length;
      store.set(TransferStore.AppStateKeys.TRANSFER, { ...this.transfer });
    }
  }

  async get(entityDto: EntityDto) {
    let result = await transferService.get(entityDto);
    this.editTransfer = result;
    store.set(TransferStore.AppStateKeys.EDIT_TRANSFER, result);
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
    //store.set(TransferStore.AppStateKeys.EDIT_TRANSFER, this.editTransfer)
  }

  // get All transfer 
  async getAllTransfer(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await transferService.getAllTransfer(pagedFilterAndSortedRequest);
    this.transfer = result;
    store.set(TransferStore.AppStateKeys.TRANSFER, result)
    return result;
  }

  async getAllPendingTransfer(repId: string) {
    let result = await transferService.getAllPendingTransfer(repId);
    this.transfer = result;
    store.set(TransferStore.AppStateKeys.TRANSFER, result)
    return result;
  }

  // get All supporter 
  async getAllSupporter(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await supportersService.getAllSupporters(pagedFilterAndSortedRequest);
    this.supporter = result;
    store.set(TransferStore.AppStateKeys.SUPPORTER, result)
    return result;
  }

  // get transfer package details 
  async getAllTransferPackageDetails(requestObj: any, userId: string, packageId: string) {
    let result = await transferService.getAllTransferPackageDetails(requestObj, userId, packageId);
    //this.transfer = result;
    // store.set(TransferStore.AppStateKeys.TRANSFER, result)
    return result;
  }


  async postTransfer(postBody: CreateSubmitTransferInput) {
    let result = await transferService.postTransfer(postBody);
    return result;
  }
  async updateTransfer(postBody: CreateSubmitTransferInput) {
    let result = await transferService.updateTransfer(postBody);
    return result;
  }

  async GetComponentData(requestParameter: ContentRequestDto, mode: string) {

    let result = await contentService.GetComponentData(requestParameter);
    if (mode === L(AppConsts.actionNames.DETAIL_VIEW)) {
      store.set(TransferStore.AppStateKeys.TRANSFER_VIEW, result);
    }
    else if (mode == "GetAll") {
      store.set(TransferStore.AppStateKeys.TRANSFER, result);
    }
    else if (mode == L(AppConsts.actionNames.EDIT)) {
      store.set(TransferStore.AppStateKeys.EDIT_TRANSFER, result);
    }

    // store.set(OrdersStore.AppStateKeys.EDIT_ORDER, result);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }



  async getAllCSVData() {
    let result = await transferService.getAllTransfer({
      maxResultCount: 300000,
      skipCount: 0,
      keyword: "",
      sorting: ""
    });
    return result.items;
  }

  async changeLanguage(languageName: string) {
    await transferService.changeLanguage({ languageName: languageName });
  }

  async acknowledgeTransfer(transferId: Number) {
    await transferService.acknowledgeTransfer(transferId);
  }


  //#region  Transfer Related Functions 

  createInputObjForGetTransferPackage(formValues: any, pendingTransfersList: any, alreadySelectedRows: any) {
    try {
      let transferSelectedItemsList = pendingTransfersList;
      this.setDefaultSelectionToFalse(transferSelectedItemsList);

      const namePrefix = TransferStore.AppStateKeys.prefixes.SELECTED_PAYMENTS;
      const nameSuffix = TransferStore.AppStateKeys.prefixes.TRANSFER_AMOUNT;

      let ParentIdToMakeSelected: any = [];

      for (let i = 0; i < alreadySelectedRows.length; i++) {
        let splititems = alreadySelectedRows[i].split('-');
        if (splititems.length === 2) {
          let item = transferSelectedItemsList.find((item: any) => item.id == splititems[1]);
          if (item) {
            item.isSelected = true;
            let key = `${namePrefix}${splititems[1]}${nameSuffix}`
            item.transferAmount = formValues[key] ? formValues[key] : item.transferAmount;
          }
        }
        else if (splititems.length === 3) {
          this.setChildItemSelection(transferSelectedItemsList, namePrefix, splititems, nameSuffix, formValues, alreadySelectedRows, ParentIdToMakeSelected);
        }

      }

      // setting parent to selected if id is found in the ParentIdToMakeSelected Array  
      if (ParentIdToMakeSelected) {
        this.setParentIdSelection(ParentIdToMakeSelected, transferSelectedItemsList);
      }
      this.setIsPartialExchangedAllowed(transferSelectedItemsList);
      return transferSelectedItemsList;


    }
    catch (ex) {
      console.log(`error: ${ex}`);
    }
  }

  setChildItemSelection(transferSelectedItemsList: any, namePrefix: string, splititems: any, nameSuffix: string, formValues: any, alreadySelectedRows: any, ParentIdToMakeSelected: any) {

    try {
      let item = transferSelectedItemsList.find((item: any) => item.id == splititems[1]);
      if (item) {
        let itemOrder = item.ordersList?.find((item: any) => item.orderId == splititems[2]);
        if (itemOrder) {
          itemOrder.isSelected = true;
          let key = `${namePrefix}${splititems[1]}_${splititems[2]}${nameSuffix}`
          itemOrder.transferAmount = formValues[key] ? formValues[key] : itemOrder.transferAmount;
        }

        // pushing parentID to an array if parent is not in selected list 
        let parentIdVal = 'rw-' + splititems[1];
        let parentId = alreadySelectedRows.find((item: any) => item == parentIdVal);
        if (!parentId) {
          if (!ParentIdToMakeSelected || ParentIdToMakeSelected.indexOf(parentIdVal) === -1)
            ParentIdToMakeSelected.push(parentIdVal);
        }



      }

    } catch (ex) {
      console.log(`error: ${ex}`);
    }

  }

  setParentIdSelection(ParentIdToMakeSelected: any, transferSelectedItemsList: any) {
    try {
      for (let i = 0; i < ParentIdToMakeSelected.length; i++) {
        let splititems = ParentIdToMakeSelected[i].split('-');
        let item = transferSelectedItemsList.find((item: any) => item.id == splititems[1]);
        if (item) {
          item.isSelected = true;
          let sum = 0;
          let itemOrder = item.ordersList?.filter((item: any) => item.isSelected == true);
          if (itemOrder) {
            itemOrder.isSelected = true;
            for (let j = 0; j < itemOrder.length; j++) {
              sum = Number(sum) + Number(itemOrder[j].transferAmount);
            }
          }
          item.transferAmount = sum;
        }
      }

    } catch (ex) {
      console.log(`error: ${ex}`);
    }

    return transferSelectedItemsList;
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

  async getSubmitTransferPayload(formValues: any, subFormFields: any, pendingTransfersList: any, fileListState: any, transferPackage: any, exchangeList: any, isEdit: any) {
    let keyvalues: any = [];
    Object.keys(formValues).forEach(function (key) {
      let field = subFormFields.find((item: any) => item.internalName == key);
      if (field) {
        keyvalues.push({ key: key, value: formValues[key] });
      }
    });

    let selectedlist = !isEdit ? pendingTransfersList.filter((item: any) => item.isSelected === true) : pendingTransfersList;
    // creating post Data object
    let postPayload: CreateSubmitTransferInput = {
      input: fileListState && fileListState.fileList ? fileListState.fileList : [],
      payload: {
        transferId: transferPackage.id,
        packageId: transferPackage.packageId == undefined ? transferPackage.trackingNumber : transferPackage.packageId,
        transferDetails: exchangeList,
        exchangeHistory: formValues.exchangeDetails ? formValues.exchangeDetails : [],
        transferToId: formValues.SelectDestination,
        additionalData: keyvalues,
        transferItemList: selectedlist,
        transferFromId: formValues.selectOrigin
      }

    };
    return postPayload;
  }


  createCombinedPendingTransferList(transferList: any, compState: any) {
    this.setDefaultSelectionToFalse(transferList);
    let transferListNew: any = transferList;
    let currentList: any = transferListNew.map((object: any) => ({ ...object }));
    for (let i = 0; i < compState.packageContents.length; i++) {
      let campaign = compState.packageContents[i].ordersList  ? false : true;
     
      let orderTypeCode = compState.packageContents[i].campaignId ? 'Campaign': 'SpecialServices';
     
      let similiarItem = currentList.find((item: any) => item.orderTypeCode == orderTypeCode.toString() && item.productId == compState.packageContents[i].productId && item.currencySymbol == compState.packageContents[i].currencySymbol);
     
      if (similiarItem) {
        if (campaign) {
          similiarItem.isSelected = true;
          similiarItem.pendingAmount = Number(similiarItem.pendingAmount) + Number(compState.packageContents[i].transferAmount);
          similiarItem.transferAmount = Number(compState.packageContents[i].transferAmount);
        }
        else {
          let parentData = {
            pendingAmount: 0,
            transferAmount: 0
          };
          for (let j = 0; j < compState.packageContents[i].ordersList.length; j++) {
            let currentItem = compState.packageContents[i].ordersList[j];
            let similiarChildItem = similiarItem.ordersList?.find((item: any) => item.orderDetailId == currentItem.orderDetailId);
            if (similiarChildItem) {
              similiarChildItem.pendingAmount = Number(similiarChildItem.pendingAmount) + Number(currentItem.transferAmount);
              similiarChildItem.transferAmount = Number(currentItem.transferAmount);
              similiarChildItem.isSelected = true;
              similiarChildItem.found = true;
              parentData.pendingAmount = Number(parentData.pendingAmount) + Number(similiarChildItem.pendingAmount);
              parentData.transferAmount = Number(parentData.transferAmount) + Number(similiarChildItem.transferAmount);
            } else {
              currentItem.pendingAmount = currentItem.transferAmount;
              similiarItem.ordersList.push(currentItem);
              parentData.pendingAmount = Number(parentData.pendingAmount) + Number(currentItem.transferAmount);
              parentData.transferAmount = Number(parentData.transferAmount) + Number(currentItem.transferAmount);
            }
          }
          // // doing this to update parent pending amount 
          let missedItems = similiarItem.ordersList?.filter((item: any) => !item.found);
          if (missedItems) {
            for (let k = 0; k < missedItems.length; k++) {
              parentData.pendingAmount = Number(parentData.pendingAmount) + Number(missedItems[k].pendingAmount);
            }
          }
          similiarItem.pendingAmount = parentData.pendingAmount;
          similiarItem.transferAmount = parentData.transferAmount;
        }
      }
      else {
        currentList.push(compState.packageContents[i]);
      }
    }

    return currentList;


  }

  setIsPartialExchangedAllowed(transferItemsList: any) {
    try {
      let isSameProduct = true;
      if (transferItemsList && transferItemsList.length > 0) {
        let count = 0;
        let productId;
        while (isSameProduct && count < transferItemsList.length) {
          if (transferItemsList[count].isSelected) {
            if (!productId)
              productId = transferItemsList[count].productId
            else {
              if (productId != transferItemsList[count].productId)
                isSameProduct = false;
            }
          }
          count++;
        }
      }
      store.set(TransferStore.AppStateKeys.IS_PARTIAL_TRANSFER, isSameProduct);
    }
    catch (err) {
      console.log(`error:${err}`);
    }
  }
  //#endregion
}

export default TransferStore;
