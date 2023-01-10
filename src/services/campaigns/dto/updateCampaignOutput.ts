export interface UpdateUserOutput {

  id: number;
  startDate: string;
  endDate: string;
  target: number;
  displayOrder: number;
  isMainCampaign: boolean;
  isTargetAchieved: boolean;
  //products: string[],
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

export interface AuthorizeCampaignRequestDto {
  campaignId: Number;
  supporterUserId: Number;
  additionalTarget: Number;
  supporterTarget: Number;
  comments?: string;
}

export interface UserOrRolePermissionsRequestDto {
  users: [];
  roles: [];
  permissions: [];
}