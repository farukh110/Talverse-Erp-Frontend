import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import productsService from '../services/products/productsService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateProductInput,
  UpdateProductInput,
  GetProductOutput
} from '../services/products/dto/productsDto';

class DonorsStore {
  donors!: PagedResultDto<GetProductOutput>;
  editDonor!: CreateOrUpdateProductInput;

  static AppStateKeys = {
    DONORS: "donors",
    EDIT_DONOR: "editDonor"
  }
  async create(createProductInput: CreateOrUpdateProductInput) {
    let result = await productsService.create(createProductInput);
    this.donors.items.push(result);
  }
  async update(updateProductInput: UpdateProductInput) {
    let result = await productsService.update(updateProductInput);
    this.donors.items = this.donors.items.map((x: GetProductOutput) => {
      if (x.id === updateProductInput.id) {
        console.log(result);
        x = result;
      }
      return x;
    });
  }

  async delete(entityDto: EntityDto) {
    let res = await productsService.delete(entityDto);
    if (res.success) {
      this.donors.items = this.donors.items.filter((x: GetProductOutput) => x.id !== entityDto.id);
      this.donors.totalCount = this.donors.items.length;
      store.set(DonorsStore.AppStateKeys.DONORS, { ...this.donors });
    }
  }

  async get(entityDto: EntityDto) {
    let result = await productsService.get(entityDto);
    this.editDonor = result;
    store.set(DonorsStore.AppStateKeys.EDIT_DONOR, result);
  }

  async createDonor() {
    this.editDonor = {

      code: '',
      isActive: true,
      displayOrder: 0,
      isAllowedInCampaign: false,
      customFields: '',
      programId: 0,
      isDeleted: false,
      isSupporterNameRequired: false,
      isFeatured: false,
      translations: [
        {
          name: '',
          language: '',
          unitName: '',
          id: 0
        }
      ],
      id: 0

    };
    store.set(DonorsStore.AppStateKeys.EDIT_DONOR, this.editDonor)
  }

  // get all products 
  async getAllDonors(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await productsService.getAllProducts(pagedFilterAndSortedRequest);
    this.donors = result;
    store.set(DonorsStore.AppStateKeys.DONORS, result)
    return result;
  }

  async getAllCSVData() {
    let result = await productsService.getAllProducts({
      maxResultCount: 300000,
      skipCount: 0,
      keyword: "",
      sorting: ""
    });
    return result.items;
  }

  async changeLanguage(languageName: string) {
    await productsService.changeLanguage({ languageName: languageName });
  }
}

export default DonorsStore;
