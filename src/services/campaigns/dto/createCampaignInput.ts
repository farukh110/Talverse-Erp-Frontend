export interface CreateCampaignInput {
  
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
  