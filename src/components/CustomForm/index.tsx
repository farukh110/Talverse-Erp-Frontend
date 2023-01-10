
import React, { forwardRef, useEffect, useRef } from 'react';
import { Form } from 'antd';
import FormElement from './components/FormElement';
import './index.less';
import { CustomButton, CustomCol, CustomRow } from '../CustomControls';
import { L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { GetDynamicFormRequestDto } from '../../services/dynamicForm/dto/getDynamicFormRequestDto';
import formUtils from '../../utils/formUtils';
import { GetProductFormRequestDto } from '../../services/ProductForm/dto/getProductFormRequestDto';
import Loading from '../Loading';
import LocalizationKeys from '../../lib/localizationKeys';
import AppConsts from '../../lib/appconst';

declare var abp: any;
export interface ICustomFormProps extends React.HTMLProps<any> {
  visible?: boolean;
  onSubmit(values: any, formFields?: any): any;
  onCancel(): any;
  subFormFields?: [];
  onChangeCallback(postBody: GetProductFormRequestDto): any;
  formFields: any;
  formId?: string;
  formMode: string;
  hideButtons?: boolean,
  hideCancelButton?: boolean;
  hideSaveButton?: boolean;
  alignButtonsInline?: boolean;
  saveButton?: any;
  cancelButton?: string;
  saveButtonAppearance?: string;
  saveButtontext?: string;
  disabledSaveButton?: boolean;

}
export const FormModes = {
  Edit: 'Edit',
  Add: 'Add',
  Display: 'Display'
}
interface ICustomFormFieldsWrappperProps extends React.HTMLProps<any> {
  fields: any;
  formRef: any;
  onReloadForm(fieldId: any, selectedValue: any): any;
  subFormFields?: [];
  onChangeCallback(postBody: GetProductFormRequestDto): any;
  formMode: string;
}
const CustomFormFieldsWrapper = (props: ICustomFormFieldsWrappperProps) => {
  const { fields, formMode, formRef, onReloadForm, subFormFields, onChangeCallback } = props;

  const getFormFieldType = (formField: any) => {
    if (formMode == FormModes.Display || formField.mode == FormModes.Display) {
      switch (formField.type) {
        case "CustomSubForm":
        case "LanguageTranslation":
        case "AutoComplete":
        case "Dropdown":
          return formField.type;
          break;
        default:
          return "Label";
          break;
      }
    } else
      return formField.type;
  }

  return fields.map((formField: any, $index: any) => (
    formField.visible && formField.type && formField.type != 'Hidden' && <CustomCol key={$index} span={formUtils.getColumnSize(formField.size)}>
      <FormElement formMode={formMode} {...formField} type={getFormFieldType(formField)} dataType={formField.type} formRef={formRef} formFields={fields} onReloadForm={onReloadForm} subFormFields={subFormFields} onChangeCallback={onChangeCallback} />
    </CustomCol>
  ))
}
const CustomFormButtonsWrapper = (props: any) => {
  const { hideCancelButton, hideSaveButton, formMode, cancelForm, submitForm, saveButton, cancelButton, saveButtontext, saveButtonAppearance, disabledSaveButton } = props;

  return <Form.Item className="button-wrapper">

    {!hideCancelButton && !cancelButton &&
      <CustomButton onClick={() => cancelForm()}>
        {L(LocalizationKeys.ERP_LblCancel.key)}
      </CustomButton>
    }
    {saveButton}
    {cancelButton}
    {!hideSaveButton && !saveButton && formMode != FormModes.Display && <CustomButton disabled={disabledSaveButton} onClick={() => submitForm()} appearance={saveButtonAppearance ? saveButtonAppearance : CustomButton.appearances.Save}>
      {saveButtontext ? L(saveButtontext) : L(LocalizationKeys.ERP_LblSave.key)}
    </CustomButton>}
  </Form.Item>
}
const CustomForm = forwardRef((props: ICustomFormProps, ref: any) => {

  // loading status

  const [languageSelectedTab, setLanguageSelectedTab] = useAppState(AppConsts.appState.SELCTED_LANG_TAB);

  const [loadingStatus, setLoadingStatus] = useAppState(AppConsts.appState.FORM_LOADER, false);

  const { onSubmit, onCancel, subFormFields, onChangeCallback, formMode, hideButtons, hideCancelButton, hideSaveButton, alignButtonsInline, disabledSaveButton } = props;

  const { dynamicFormStore } = useAppStores();
  const [formRef] = Form.useForm();
  //const formFields: any[] = props.formFields ? props.formFields : [];
  const [fields, setFields] = useCompState([]);
  useEffect(() => {
    setFields(props.formFields);
  }, [props.formFields, disabledSaveButton]);

  const onReloadForm = async (fieldId: any, selectedValue: any) => {
    // make an api call here 
    const form = formRef;
    let formValues = form?.getFieldsValue();
    let keyvalues: any = [];
    Object.keys(formValues).forEach(function (key) {
      let tempKey = key;
      if (key.startsWith("ddl-"))
        tempKey = key.split("ddl-")[1];
      let field = subFormFields!.find((item: any) => item.internalName == tempKey);
      if (field) {
        keyvalues.push({ key: tempKey, value: formValues[key] });
      }
    });
    let postBody: GetProductFormRequestDto = {
      formId: formValues["formId"],
      fieldId: fieldId,
      selectedValue: selectedValue,
      // externalAppId: "string",
      formValues: keyvalues
    };
    if (true) {
      //in case of sub form mode
      onChangeCallback(postBody)
    }
    else {
      //in case of independent form
    }
  }

  const relaodFullForm = async (fieldId: any, selectedValue: any) => {
    try {
      const form = formRef;
      let formValues = form?.getFieldsValue();
      let keyvalues: any = [];
      Object.keys(formValues).forEach(function (key) {
        keyvalues.push({ key: key, value: formValues[key] });
      });
      let postBody: GetDynamicFormRequestDto = {
        formId: props.formId!,
        fieldId: fieldId,
        selectedValue: selectedValue,
        // externalAppId: "string",
        formValues: keyvalues
      };
      let response = await dynamicFormStore.getForm(postBody);
      if (response) {
        setFields(response.formFields);
      }
    }
    catch (ex) {
      console.log(`error: ${ex}`);
    }
  }
  const submitForm = async () => {
    const form = formRef;
    try {
      form!.validateFields().then(async (values: any) => {

        setLoadingStatus(true);
        // CREATE TRANSLATIONS OBJECT HERE  
        values = translateValuesLanguageData(values);
        let formFieldss = subFormFields;

        // if (formFieldss && subFormFields && subFormFields.length > 0) {
        //   formFieldss = formFieldss.concat(subFormFields);
        // }
        await onSubmit(values, formFieldss);

        setLanguageSelectedTab("tb_en");

        setLoadingStatus(false);

      }).catch(errorInfo => {
       
        let tabToSelect: any = null;
        let errorFields = errorInfo.errorFields;

        if(errorFields && errorInfo.errorFields) {

          errorFields.forEach((element: any) => {

            let name = element.name[0];
            if (name.includes("_")) {
              let splittedName = name.split("_");
              if (tabToSelect == null) {
                tabToSelect = `tb_${splittedName[1]}`;
              }
            }
          });
  
        }

        setLanguageSelectedTab(tabToSelect);
      });
    }
    catch (ex) {
      console.log(`error: ${ex}`);
      setLoadingStatus(false);
    }

  }

  const cancelForm = async () => {
    const form = formRef;
    form!.resetFields();
    onCancel();
  }
  const translateValuesLanguageData = (values: any) => {
    try {
      let translations: any[] = [];
      languages().forEach((element: any) => {
        translations.push({ language: element.name })
      });

      Object.keys(values).forEach(function (key) {
        if (key.includes("_")) {
          let langValue = key.split("_");
          let translation = translations.find(item => item.language == langValue[1]) || {}; // fetching language object 
          if (translation) {
            translation[langValue[0]] = values[key]; // setting key in lanaguage translation array 
            delete values[key]; // deleting key from main object as it is being added as trnalsations array  
          }
        }
      });
      values['translations'] = translations;
      return values;
    }
    catch (ex) {
      console.log(`error: ${ex}`);
    }

  }

  const languages = () => {
    return abp.localization.languages.filter((val: any) => {
      return !val.isDisabled;
    });
  }

  return (
    <>
      <Loading spinning={loadingStatus}>

        {fields && <Form ref={ref} form={formRef} layout="vertical" className="custom-form">

          {alignButtonsInline &&
            <>

              <CustomRow gutter={[16]}>
                <CustomFormFieldsWrapper fields={fields} formMode={formMode} formRef={formRef} onReloadForm={onReloadForm} onChangeCallback={onChangeCallback} subFormFields={subFormFields} ></CustomFormFieldsWrapper>
                <CustomRow>
                  {!hideButtons && <CustomFormButtonsWrapper {...props} submitForm={submitForm} cancelForm={cancelForm}></CustomFormButtonsWrapper>}
                </CustomRow>
              </CustomRow>
            </>
          }

          {!alignButtonsInline &&
            <>
              <CustomRow gutter={[16]}>
                {props.children}
                <CustomFormFieldsWrapper fields={fields} formMode={formMode} formRef={formRef} onReloadForm={onReloadForm} onChangeCallback={onChangeCallback} subFormFields={subFormFields} ></CustomFormFieldsWrapper>
              </CustomRow>
              {!hideButtons && <CustomFormButtonsWrapper {...props} submitForm={submitForm} cancelForm={cancelForm}></CustomFormButtonsWrapper>}
            </>
          }

        </Form>}

      </Loading>
    </>
  )
})

export default CustomForm;