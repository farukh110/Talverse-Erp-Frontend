export interface PushCustomAppUpdateRequestDto {
    appUpdateTypeId: number;
    sendNotificationNow: boolean
    campaignId?: number;
    translations: PushCustomAppUpdateRequestTranslationDto[];
    saveAppUpdate: boolean;
    landingType: string;
    notificationRecipients: any[]; 

}

export interface PushCustomAppUpdateRequestTranslationDto {
    title?: string;
    description: string;
    language: string;
}