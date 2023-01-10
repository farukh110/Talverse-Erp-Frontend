import { useEffect } from 'react';
export function useFormDefaultValue(formRef: any, fieldName: string, value: any,dataItems?:any[]) {


    useEffect(() => {
      setValue(formRef,fieldName,value);
      }, [value,dataItems]);
}

const setValue = (formRef: any, fieldName: string, value: any) =>{
  if (value && formRef) {
    let obj = {};
    obj[fieldName] = value;
    formRef.setFieldsValue(obj);//fix for setting value 
  }
}
