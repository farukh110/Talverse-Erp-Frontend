// Create Or Update Donor Input
export interface CreateOrUpdateDonorInput {

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

// Create Donor Input  
export interface CreateDonorInput {

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

// Create Donor Output Item
export interface CreateDonorOutputItem {

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

// Create Donor Output  
export interface CreateProductOutput {
    result: CreateDonorOutputItem;
}

// GetAll Donor Output    
export interface GetAllDonorOutput {

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

// Get Donor Output
export interface GetDonorOutput {

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

// Update Donor Input
export interface UpdateDonorInput {

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

// Update Donor Output
export interface UpdateDonorOutput {

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
