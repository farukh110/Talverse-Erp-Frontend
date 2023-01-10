import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import ordersService from '../services/orders/ordersService';
import productsService from '../services/products/productsService';
import userService from '../services/user/userService';
import programCategoryService from '../services/ProgramCategory/programCategoryService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
  CountryInvoiceDto,
  CreateOrUpdateOrderInput,
  GetOrderOutput,
  InsertOrderInput,
  UpdateDonationInput,
  UpdateOrderInput
} from '../services/orders/dto/ordersDto';
import { GetProductOutput } from '../services/products/dto/productsDto';
import { GetUserOutput } from '../services/user/dto/getUserOutput';
import { GetProgramCategoryOutput } from '../services/ProgramCategory/dto/programCategoryDto';
import campaignsService from '../services/campaigns/campaignsService';
import productFormService from '../services/ProductForm/productFormService';
import supportersService from '../services/supporters/supportersService';
import { GetProductFormRequestDto } from '../services/ProductForm/dto/getProductFormRequestDto';
import contentService from '../services/Content/contentService';
import { ContentRequestDto, SavedRequestDto } from '../services/Content/dto/contentRequestDto';
import AppConsts from '../lib/appconst';
import { L } from '../lib/abpUtility';

class OrdersStore {
  orders!: PagedResultDto<GetOrderOutput>;
  products!: PagedResultDto<GetProductOutput>;
  users!: PagedResultDto<GetUserOutput>;
  programsCategory!: PagedResultDto<GetProgramCategoryOutput>;
  editOrder!: CreateOrUpdateOrderInput;

  static AppStateKeys = {
    ORDERS: "orders",
    PRODUCTS: "products",
    USERS: "users",
    PROGRAMS_CATEGORY: "programsCategory",
    EDIT_ORDER: "editOrder",
    VIEW_ORDER: "viewOrder"
  }
  async create(createOrderInput: CreateOrUpdateOrderInput) {
    let result = await ordersService.create(createOrderInput);
    this.orders.items.push(result);
  }

  async createNewOrder(createOrderInput: InsertOrderInput) {
    let result = await ordersService.createOrderSaveDonation(createOrderInput);
    //this.orders.items.push(result);
    return result;
  }




  async updateOrderDonation(updateDonationInput: UpdateDonationInput) {
    let result = await ordersService.updateOrderDonation(updateDonationInput);
    // this.orders.items = this.orders.items.map((x: any) => {
    //   console.log(x);
    //   if (x.id === updateDonationInput.orderId) {
    //     console.log(result);
    //     x = result;
    //   }
    //   return x;
    // });
    return result;
  }


  async update(updateOrderInput: UpdateOrderInput) {
    let result = await ordersService.update(updateOrderInput);
    this.orders.items = this.orders.items.map((x: GetOrderOutput) => {
      if (x.id === updateOrderInput.id) {
        x = result;
      }
      return x;
    });
  }

  async delete(entityDto: EntityDto, requestObj: SavedRequestDto) {
  
    let res = await ordersService.delete(entityDto);
    if (res) {
      this.orders.items = this.orders.items.filter((x: any) => x.orderId !== entityDto.id);
      this.orders.totalCount = this.orders.totalCount - 1;//this.orders.items.length;
      store.set(OrdersStore.AppStateKeys.ORDERS, { ...this.orders });
    }
  }

  async get(entityDto: EntityDto) {
    let result = await ordersService.getDonationbyId(entityDto.id);
    this.editOrder = result;
    store.set(OrdersStore.AppStateKeys.EDIT_ORDER, result);
    return result;
  }

  async createOrders() {
    this.editOrder = {

      id: 0,
      appId: 0,
      creationTime: '',
      productName: '',
      categoryName: '',
      campaignName: '',
      supporterName: '',
      userName: '',
      orderStatus: '',
      currency: '',
      amount: 0

    };
    store.set(OrdersStore.AppStateKeys.EDIT_ORDER, this.editOrder)
  }

  // get all orders 
  async getAllOrderDetail(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await ordersService.getAllOrderDetail(pagedFilterAndSortedRequest);
    // this.orders.items = result.items;
    store.set(OrdersStore.AppStateKeys.ORDERS, result);
    return result;
  }

  // void country invoice 
  async voidCountryInvoice(invoiceId: any) {

    let result = await ordersService.voidCountryInvoice(invoiceId);
    return result; 
  }

  // get all products 
  async getAllProducts(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await productsService.getAllProducts(pagedFilterAndSortedRequest);
    this.products = result;
    store.set(OrdersStore.AppStateKeys.PRODUCTS, result);
    return result;
  }
  // get all campaigns 
  async getAllCampaigns(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await campaignsService.getAllCampaigns(pagedFilterAndSortedRequest);
    // this.campaigns = result;
    // store.set(CampaignsStore.AppStateKeys.CAMPAIGNS, result)
    return result;
  }

  // get all users
  async getAllUsers(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await userService.getAll(pagedFilterAndSortedRequest);
    this.users = result;
    store.set(OrdersStore.AppStateKeys.USERS, result);
    return result;
  }

  // get all programs category

  async getAllprogramsCategory(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await programCategoryService.getAllProgramCategory(pagedFilterAndSortedRequest);
    this.programsCategory = result;
    store.set(OrdersStore.AppStateKeys.PROGRAMS_CATEGORY, result);
    return result;
  }

  async getAllCSVData() {
    let result = await ordersService.getAllOrderDetail({
      maxResultCount: 300000,
      skipCount: 0,
      keyword: "",
      sorting: ""
    });
    return result.items;
  }

  async generateCountryInvoice(postBody: CountryInvoiceDto) {
    let result = await ordersService.generateCountryInvoice(postBody);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }


  async countryInvoiceRequestCreate(orderId: Number, values: any) {
    try {
      let postObj: CountryInvoiceDto = {
        orderId: orderId,
        amount: values.amount,
        donorName: values.donorName,
        countryId: values.country,
        isImageRequired: false,
        isPdfRequired: true
      };

      return await this.generateCountryInvoice(postObj);
    }
    catch (ex) {
      console.log(`error: ${ex}`);
    }
  }

  forceDownload = async (url: any, fileName: any) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  }



  //#region  Product Form Service Calls


  async getForm(postBody: GetProductFormRequestDto) {
    let result = await productFormService.getProductForm(postBody);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async getFormDataItemsByProductId(id: Number) {
    let result = await productFormService.getFormDataItemsByProductId(id);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async getFormDataItemsByCampaignId(id: Number) {
    let result = await productFormService.getFormDataItemsByCampaignId(id);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async getAssociatedRepSupporters(id: Number) {
    let result = await supportersService.getAssociatedRepSupporters(id);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  //#endregion

  //#region Content Service Calls 


  //GetComponentData

  async GetComponent(requestParameter: ContentRequestDto, mode: string) {
    let result = await contentService.GetComponent(requestParameter);
    if (mode === L(AppConsts.actionNames.DETAIL_VIEW)) {
      store.set(OrdersStore.AppStateKeys.VIEW_ORDER, result);
    }
    else if (mode === L(AppConsts.actionNames.EDIT)) {
      this.editOrder = result;
      store.set(OrdersStore.AppStateKeys.EDIT_ORDER, { ...result });
    }
    else if (mode === 'GetAll') {

    }

    // this.editOrder = result;
    // store.set(OrdersStore.AppStateKeys.EDIT_ORDER,{...result});
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async GetComponentData(requestParameter: ContentRequestDto, mode: string) {

    let result = await contentService.GetComponentData(requestParameter);
    if (mode === AppConsts.actionNames.DETAIL_VIEW) {
      store.set(OrdersStore.AppStateKeys.VIEW_ORDER, result);
    }
    else if (mode === 'GetAll') {
      this.orders = result;
      store.set(OrdersStore.AppStateKeys.ORDERS, { ...result });
    }
    // store.set(OrdersStore.AppStateKeys.EDIT_ORDER, result);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async GetCustomCsv(requestParameter: ContentRequestDto) {
    let result = await ordersService.GetCustomCsv(requestParameter); //ordersService
    return result;
  }
  //#endregion



}

export default OrdersStore;
