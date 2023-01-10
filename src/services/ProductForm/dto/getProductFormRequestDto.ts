export interface GetProductFormRequestDto {
  
    formId: string,
    fieldId?: string,
    selectedValue?: string,
    externalAppId?: string,
    formValues?: [{}],
    selectedItem? :{}
  }
    