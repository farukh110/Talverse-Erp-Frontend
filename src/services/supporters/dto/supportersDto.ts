// Create Or Update Supporter Input
export interface CreateOrUpdateSupporterInput {

    id: number,
    name: string,
    contactNumber: string
}

// Create Supporter Input  
export interface CreateSupporterInput {

    id: number,
    name: string,
    contactNumber: string
}

// Create Supporter Output Item
export interface CreateSupporterOutputItem {

    id: number,
    name: string,
    contactNumber: string
}

// Create Supporter Output  
export interface CreateSupporterOutput {
    result: CreateSupporterOutputItem;
}

// GetAll Supporter Output    
export interface GetAllSupporterOutput {

    id: number,
    name: string,
    contactNumber: string
}

// Get Supporter Output
export interface GetSupporterOutput {

    id: number,
    name: string,
    contactNumber: string
}

// Update Supporter Input
export interface UpdateSupporterInput {

    id: number,
    name: string,
    contactNumber: string

}

// Update Supporter Output
export interface UpdateSupporterOutput {

    id: number,
    name: string,
    contactNumber: string

}

export interface UpdateUserProductSettingsOutput {
    productId: number,
    supporterUserId: number,
    isPartialPaymentAllowed: boolean
}