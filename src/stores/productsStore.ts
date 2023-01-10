import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import productsService from '../services/products/productsService';
import programsService from '../services/programs/programsService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
  CreateOrUpdateProductInput,
  UpdateProductInput,
  GetProductOutput
} from '../services/products/dto/productsDto';

import { GetProgramOutput } from '../services/programs/dto/programsDto';

class ProductsStore {
  products!: PagedResultDto<GetProductOutput>;
  programs!: PagedResultDto<GetProgramOutput>;
  editProduct!: CreateOrUpdateProductInput;

  static AppStateKeys = {
    PRODUCTS: "products",
    PROGRAMS: "programs",
    EDIT_PRODUCT: "editProducts"
  }
  async create(createProductInput: CreateOrUpdateProductInput) {
    let result = await productsService.create(createProductInput);
    this.products.items.push(result);
  }
  async update(updateProductInput: UpdateProductInput) {
    let result = await productsService.update(updateProductInput);
    this.products.items = this.products.items.map((x: GetProductOutput) => {
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
      this.products.items = this.products.items.filter((x: GetProductOutput) => x.id !== entityDto.id);
      this.products.totalCount = this.products.items.length;
      store.set(ProductsStore.AppStateKeys.PRODUCTS, { ...this.products });
    }
  }

  async get(entityDto: EntityDto) {
    let result = await productsService.get(entityDto);
    this.editProduct = result;
    store.set(ProductsStore.AppStateKeys.EDIT_PRODUCT, result);
  }

  async createProducts() {
    this.editProduct = {

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
    store.set(ProductsStore.AppStateKeys.EDIT_PRODUCT, this.editProduct)
  }

  // get all products 
  async getAllProducts(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await productsService.getAllProducts(pagedFilterAndSortedRequest);
    this.products = result;
    store.set(ProductsStore.AppStateKeys.PRODUCTS, result)
    return result;
  }

  // get all programs 
  async getAllPrograms(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
    let result = await programsService.getAllPrograms(pagedFilterAndSortedRequest);
    this.programs = result;
    store.set(ProductsStore.AppStateKeys.PROGRAMS, result);
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

export default ProductsStore;
