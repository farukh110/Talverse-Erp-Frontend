export interface CreateSubmitTransferInput {
    input:  [] ,
    payload: {
        transferId: number,
        packageId: string,
        transferDetails: [],
        paymentDetails:[],
        exchangeHistory:  [],
        transferToId: number,
        additionalData: [],
        // transferItemList: [],
        sourceTransferPointId:number
    }
  }