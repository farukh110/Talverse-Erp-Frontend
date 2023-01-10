// Create Or Update Order Input
export interface CreateOrUpdateOrderInput {

    id: number,
    appId: number,
    creationTime: string,
    productName: string,
    categoryName: string,
    campaignName: string,
    supporterName: string,
    userName: string,
    orderStatus: string,
    currency: string,
    amount: number
}

// Create Order Input  
export interface CreateOrderInput {

    id: number,
    appId: number,
    creationTime: string,
    productName: string,
    categoryName: string,
    campaignName: string,
    supporterName: string,
    userName: string,
    orderStatus: string,
    currency: string,
    amount: number
}

// Create Order Output Item
export interface CreateOrderOutputItem {

    id: number,
    appId: number,
    creationTime: string,
    productName: string,
    categoryName: string,
    campaignName: string,
    supporterName: string,
    userName: string,
    orderStatus: string,
    currency: string,
    amount: number
}

// Create Order Output  
export interface CreateOrderOutput {
    result: CreateOrderOutputItem;
}

// GetAll Order Output    
export interface GetAllOrderOutput {

    items: [
        {
            id: number,
            appId: number,
            creationTime: string,
            productName: string,
            categoryName: string,
            campaignName: string,
            supporterName: string,
            userName: string,
            orderStatus: string,
            currency: string,
            amount: number
        }
    ],
    totalCount: number
}

// Get Order Output
export interface GetOrderOutput {

    items: [
        {
            orderId: number,
            appId: number,
            creationTime: string,
            productName: string,
            categoryName: string,
            campaignName: string,
            supporterName: string,
            userName: string,
            orderStatus: string,
            currency: string,
            amount: number
        }
    ],
    totalCount: number,
    id: number
}

// Update Order Input
export interface UpdateOrderInput {

    id: number,
    appId: number,
    creationTime: string,
    productName: string,
    categoryName: string,
    campaignName: string,
    supporterName: string,
    userName: string,
    orderStatus: string,
    currency: string,
    amount: number

}

// Update Order Output
export interface UpdateOrderOutput {

    id: number,
    appId: number,
    creationTime: string,
    productName: string,
    categoryName: string,
    campaignName: string,
    supporterName: string,
    userName: string,
    orderStatus: string,
    currency: string,
    amount: number
}

// insert Order Output
export interface InsertOrderInput {
    campaignId?: Number,
    formId?: any,
    productFormDetails: {
        formFields: [],
        id: Number,
        productFormDescription: string
        IsSupporterNameRequired?: Boolean
    },
    supporter: {
        id: Number,
        name: string,
        contactNumber: string,
        countryId?:number
    },
    PlacedBy: {
        id: Number,
        name?: string,
        contactNumber?: string
    },
    OrderDate: Date,
    nameOnReceipt: string
}


export interface UpdateDonationInput {
    orderId: Number,
    productFormDetails: {
        id: Number,
        name?: string
        description?: string,
        formFields: [],
        isSupporterNameRequired?: Boolean
    },
    supporter: {
        id: Number,
        name: string,
        contactNumber: string,
        countryId?:number
    },
    orderDate: Date,
    nameOnReceipt: string

}

export interface CountryInvoiceDto {
    appId?: Number,
    orderId: Number,
    donorId?: Number,
    donorName: string,
    amount: Number,
    countryId: Number,
    languageCode?: string,
    isPdfRequired?: boolean,
    isImageRequired?: boolean

}