export interface CreateCampaignOutputItem {
  
  id: number;
  startDate: string;
  endDate: string;
  target: number;
  displayOrder: number;
  isMainCampaign: boolean;
  isTargetAchieved: boolean;
  products: string[],
  acceptDonationAfterTargetAchieved: boolean;
  productId: number;
  translations: [
    {
      name: string,
      description: string,
      language: string
    }
  ]
  }
  
  export interface CreateCampaignOutput {
    result: CreateCampaignOutputItem;
  }
  