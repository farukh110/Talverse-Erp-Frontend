export interface CreateOrUpdateCampaignInput {
  
  id: number;
  startDate: string;
  endDate: string;
  target: number;
  displayOrder: number;
  isMainCampaign: boolean;
  isTargetAchieved: boolean;
  products: string[],
  acceptDonationAfterTargetAchieved?: boolean;
  isAllowedAdditionalTargetAchieved:boolean;
  lockDonationAfterTargetAchieved:boolean;
  targetAchieved:number;
  productId?: number;
  translations?: [
    {
      name: string,
      description: string,
      language: string, firstRecordCTAText:string,
      consecutiveRecordCTAText:string
    }
  ],
  additionalInfo:string
}