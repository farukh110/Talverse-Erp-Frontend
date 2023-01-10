import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import campaignsService from '../services/campaigns/campaignsService';
import productsService from '../services/products/productsService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import { CreateOrUpdateCampaignInput } from '../services/campaigns/dto/createOrUpdateCampaignInput';
import { UpdateCampaignInput } from '../services/campaigns/dto/updateCampaignInput';
import { GetCampaignOutput } from '../services/campaigns/dto/getCampaignOutput';
import { GetProductOutput } from '../services/products/dto/productsDto';
import contentService from '../services/Content/contentService';
import { ContentRequestDto } from '../services/Content/dto/contentRequestDto';
import { AuthorizeCampaignRequestDto, UserOrRolePermissionsRequestDto } from '../services/campaigns/dto/updateCampaignOutput';

class CampaignsStore {
  campaigns!: PagedResultDto<GetCampaignOutput>;
  products!: PagedResultDto<GetProductOutput>;
  editcampaign!: CreateOrUpdateCampaignInput;

  static AppStateKeys = {
    CAMPAIGNS: "campaigns",
    PRODUCTS: "products",
    EDIT_CAMPAIGN: "editCampaign"
  }
  async create(createCampaignInput: CreateOrUpdateCampaignInput) {
    createCampaignInput.additionalInfo = createCampaignInput.additionalInfo && createCampaignInput.additionalInfo != '' ? JSON.parse(createCampaignInput.additionalInfo) : '';
    let result = await campaignsService.create(createCampaignInput);
    this.campaigns.items.push(result);
  }
  async update(updateCampaignInput: UpdateCampaignInput) {
    updateCampaignInput.additionalInfo = updateCampaignInput.additionalInfo && updateCampaignInput.additionalInfo != '' ? JSON.parse(updateCampaignInput.additionalInfo) : '';
    let result = await campaignsService.update(updateCampaignInput);
    this.campaigns.items = this.campaigns.items.map((x: GetCampaignOutput) => {
      if (x.id === updateCampaignInput.id) {
        console.log(result);
        x = result;
      }
      return x;
    });
  }

  async delete(entityDto: EntityDto) {
    let res = await campaignsService.delete(entityDto);
    if (res.success) {
      this.campaigns.items = this.campaigns.items.filter((x: GetCampaignOutput) => x.id !== entityDto.id);
      this.campaigns.totalCount = this.campaigns.items.length;
      store.set(CampaignsStore.AppStateKeys.CAMPAIGNS, { ...this.campaigns });
    }
  }

  async get(entityDto: EntityDto) {
    let result = await campaignsService.get(entityDto);
    this.editcampaign = result;
    store.set(CampaignsStore.AppStateKeys.EDIT_CAMPAIGN, result);
  }

  async createCampaigns() {
    this.editcampaign = {

      id: 0,
      startDate: '',
      endDate: '',
      target: 0,
      displayOrder: 0,
      isMainCampaign: false,
      isTargetAchieved: false,
      products: [],
      acceptDonationAfterTargetAchieved: false,
      isAllowedAdditionalTargetAchieved:false,
      lockDonationAfterTargetAchieved:false,
      targetAchieved:0,
      productId: 0,
      translations: [
        {
          name: '',
          description: '',
          language: '',
          firstRecordCTAText: '',
          consecutiveRecordCTAText: ''
        }
      ],
      additionalInfo: ''

    };
    store.set(CampaignsStore.AppStateKeys.EDIT_CAMPAIGN, this.editcampaign);
  }

  // get all campaigns 
  async getAllCampaigns(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await campaignsService.getAllCampaigns(pagedFilterAndSortedRequest);
    this.campaigns = result;
    store.set(CampaignsStore.AppStateKeys.CAMPAIGNS, result)
    return result;
  }

  // get all products 
  async getAllProducts(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await productsService.getAllProducts(pagedFilterAndSortedRequest);
    this.products = result;
    store.set(CampaignsStore.AppStateKeys.PRODUCTS, result)
    return result;
  }

  async getAllCSVData() {
    let result = await campaignsService.getAllCampaigns({
      maxResultCount: 300000,
      skipCount: 0,
      keyword: "",
      sorting: "Name ASC"
    });
    return result.items;
  }

  async changeLanguage(languageName: string) {
    await campaignsService.changeLanguage({ languageName: languageName });
  }


  async getComponentData(requestParameter: ContentRequestDto) {
    let result = await contentService.GetComponentData(requestParameter);
    return result;
    //store.set(DynamicFormStore.AppStateKeys.FORM, result)
  }

  async authorizeCampaignToSupporter(reqObj: AuthorizeCampaignRequestDto) {
    let result = await campaignsService.authorizeCampaignToSupporter(reqObj);
    return result;
  }

  async revokeCampaignfromSupporter(reqObj: AuthorizeCampaignRequestDto) {
    let result = await campaignsService.revokeCampaignfromSupporter(reqObj);
    return result;
  }

  async updateMultiplePermissions(reqObj: UserOrRolePermissionsRequestDto) {
    let result = await campaignsService.updateMultiplePermissions(reqObj);
    return result;
  }

  async updateCampaignAdditionalTarget(reqObj: AuthorizeCampaignRequestDto) {
    let result = await campaignsService.updateCampaignAdditionalTarget(reqObj);
    return result;
  }

}

export default CampaignsStore;
