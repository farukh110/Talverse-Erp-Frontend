export interface GetDynamicFormRequestDto {
  
    formId: string,
    fieldId?: string,
    selectedValue?: string,
    externalAppId?: string,
    formValues?: [{}]
  }
    