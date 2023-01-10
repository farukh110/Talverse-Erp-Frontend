// Create Or Update Product Input
export interface CreateOrUpdateProductInput {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number
}

// Create Product Input  
export interface CreateProductInput {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number
}

// Create Product Output Item
export interface CreateProductOutputItem {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number
}

// Create Product Output  
export interface CreateProductOutput {
    result: CreateProductOutputItem;
}

// GetAll Product Output    
export interface GetAllProductOutput {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number
}

// Get Product Output
export interface GetProductOutput {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number
}

// Update Product Input
export interface UpdateProductInput {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number

}

// Update Product Output
export interface UpdateProductOutput {

    code: string,
    isActive: true,
    displayOrder: number,
    isAllowedInCampaign: boolean,
    customFields: string,
    programId: number,
    isDeleted: boolean,
    isSupporterNameRequired: boolean,
    isFeatured: boolean,
    translations: [
        {
            name: string,
            language: string,
            unitName: string,
            id: number
        }
    ],
    id: number

}
