// Create Or Update Transfer Input
export interface CreateOrUpdateTransferInput {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: true,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: true
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number
}

// Create Transfer Input  
export interface CreateTransferInput {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: true,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: true
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number
}

// Create Transfer Output Item
export interface CreateTransferOutputItem {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: boolean,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: boolean
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number
}

// Create Transfer Output  
export interface CreateTransferOutput {
    result: CreateTransferOutputItem;
}

// GetAll Transfer Output    
export interface GetAllTransferOutput {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: boolean,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: boolean
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number
}

// Get Transfer Output
export interface GetTransferOutput {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: boolean,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: boolean
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number
}

// Update Transfer Input
export interface UpdateTransferInput {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: true,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: true
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number
}

// Update Transfer Output
export interface UpdateTransferOutput {

    id: number,
    orderType: string,
    name: string,
    currencySymbol: string,
    currencyName: string,
    pendingAmount: number,
    transferAmount: number,
    isSelected: true,
    ordersList: [
      {
        name: string,
        currencySymbol: string,
        currencyName: string,
        orderId: number,
        orderDetailId: number,
        pendingAmount: number,
        transferAmount: number,
        isSelected: true
      }
    ],
    productId: number,
    currencyId: number,
    campaignId: number,
    transferId: number

}
export interface CreateSubmitTransferInput {
  input:  [] ,
  payload: {
      transferId: number,
      packageId: string,
      transferDetails: [],
      exchangeHistory:  [],
      transferToId: number,
      additionalData: [],
      transferItemList: [],
      transferFromId:number
  }
}