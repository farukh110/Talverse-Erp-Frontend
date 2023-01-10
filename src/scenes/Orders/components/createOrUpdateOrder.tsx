import React, { useEffect, useRef, useState } from 'react';
import rules from './createOrUpdateOrder.validation';
import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import CustomForm from '../../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import createOrderForm from '../json/createOrderForm.json';
import { CustomCol, CustomModal, CustomRow } from '../../../components/CustomControls';
import OrdersStore from '../../../stores/ordersStore';
import { GetDynamicFormRequestDto } from '../../../services/dynamicForm/dto/getDynamicFormRequestDto';
import { Tabs, Form, Select, Radio } from 'antd';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import formUtils from '../../../utils/formUtils';
import { GetProductFormRequestDto } from '../../../services/ProductForm/dto/getProductFormRequestDto';
import AppConsts from '../../../lib/appconst';
import moment from 'moment';
import utils from '../../../utils/utils';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import LocalizationKeys from '../../../lib/localizationKeys';
import { CustomAutoComplete } from '../../../components/CustomWebControls/CustomAutoComplete';
import productDropdownOptions from '../json/productDropdownOptions.json';
import campaignDropdownOptions from '../json/campaignDropdownOptions.json';

const { Option } = Select;

export interface ICreateOrUpdateOrderProps {
    visible?: boolean;
    onCancel(): any;
    modalType?: string;
    onCreate(values: any, allFormFields?: any): any;
    formRef?: React.RefObject<FormInstance>;
    orderNumber?: any;
}

const CreateOrUpdateOrder = (props: ICreateOrUpdateOrderProps) => {



    const [formList, setFormList] = useCompState({});
    const formRef = useRef<FormInstance>();
    const [dropDownItems, setDropDownItems] = useCompState({ campaign: [], products: [], rep: [] });
    const [currentDate, setCurrentDate] = useCompState("");
    const { ordersStore, supportersStore } = useAppStores();
    // const [dropDownState, setDropDownState] = useCompState({});
    const [radioGroupValue, setRadioGroupValue] = React.useState(1);
    const [subFormFields, setSubFormFields] = useCompState([]);
    const [editOrder] = useAppState(OrdersStore.AppStateKeys.EDIT_ORDER);
    const [hideStaticForm, setHideStaticForm] = React.useState(false);
    const { visible, onCreate, onCancel, modalType, orderNumber } = props;

    useEffect(() => {
        setSubFormFields([]);
        //setDropDownState({ ...{} });
        setFormList({ ...{} });
        setRadioGroupValue(1)
        // getProductsList();
        // getCampaignsList();
        // getSupporterList();
        populateFormFields();
    }, [editOrder]);

    useEffect(() => {
        getDropDownItems();
    }, []);

    const getDropDownItems = async () => {
        await getProductsList();
        await getCampaignsList();
        await getSupporterList();
        setDropDownItems({ ...dropDownItems });
    }

    const populateFormFields = () => {

        if (editOrder && editOrder.data) {

            setHideStaticForm(true);
            let renderObj: any = {
                formFields: []
            }
            renderObj = populateEditMode(editOrder.data, editOrder.dataFields);
            setFormList(renderObj);
        }
        else {
            setHideStaticForm(false);
            setFormList(createOrderForm);

            let currentDate: any = createOrderForm.formFields.find((item: any) => item.internalName == 'orderDate');
            currentDate.defaultValue = moment();
        }
    }


    let modalOptions = {

        "visible": visible,
        "width": '60%',
        "title": editOrder && editOrder.data ? L(LocalizationKeys.ERP_LblEditOrder.key) + " : " + orderNumber : L(LocalizationKeys.ERP_LblNewOrder.key),
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"

    }


    const populateEditMode = (data: any, formfields: any) => {
        let renderObj: any = {
            formFields: []
        }
        let additionalData = data.additionalData
        if (formfields && formfields.length > 0) {
            for (let i = 0; i < formfields.length; i++) {
                switch (formfields[i].internalName) {
                    case "campaignId":
                        formfields[i].dataItems = dropDownItems.campaign;
                        formfields[i].defaultValue = data?.campaignId;
                        if (formfields[i].defaultValue) {
                            setRadioGroupValue(1);
                        }
                        else {
                            setRadioGroupValue(2);
                            formfields[i].visible = false
                        }
                        break;

                    case "productId":
                        formfields[i].dataItems = dropDownItems.products;
                        formfields[i].defaultValue = data?.productId;
                        break;

                    case "formId":
                        formfields[i].defaultValue = additionalData?.find((item: any) => item.key == 'FormId')?.value;
                        break;

                    case "supporterId":
                        formfields[i].dataItems = dropDownItems.rep;
                        formfields[i].defaultValue = data?.supporterId;

                        break;
                    case "donorId":
                        formfields[i].defaultValue = data?.donorId;
                        break;
                    case "donorName":
                        formfields[i].defaultValue = data?.placedForName;
                        break;

                    default:
                        formfields[i].defaultValue = data[formfields[i].internalName];
                        break;
                }
                renderObj.formFields.push(formfields[i]);
            }
        }
        let formId = additionalData.find((item: any) => item.key == 'FormId')?.value;
        if (formId) {
            getDynamicForm({
                formId: formId,
                formValues: additionalData
            });
        }
        return renderObj;
    }

    const donorCountryPhoneValidation = (formsArr: any, completeFormFields: any) => {

        // start country field

        if (formsArr.isSupporterContactRequired) {

            completeFormFields.formFields.find((item: any) => item.internalName == "donorContact").validations[1].options[0].value = true;
        }
        else {
            completeFormFields.formFields.find((item: any) => item.internalName == "donorContact").validations[1].options[0].value = false;
        }

        if (formsArr.supporterCountry.toLowerCase() == AppConsts.staticFieldsValues.IS_SHOW.toLowerCase()) {
            completeFormFields.formFields.find((item: any) => item.componentName == "countryId").validations[0].options[0].value = false;
            completeFormFields.formFields.find((item: any) => item.componentName == "countryId").visible = true;
        }
        else if (formsArr.supporterCountry == null || formsArr.supporterCountry == '') {
            completeFormFields.formFields.find((item: any) => item.componentName == "countryId").visible = false;
            completeFormFields.formFields.find((item: any) => item.componentName == "countryId").validations[0].options[0].value = false;
        }

        else if (formsArr.supporterCountry.toLowerCase() == AppConsts.staticFieldsValues.IS_REQUIRED.toLowerCase()) {
            completeFormFields.formFields.find((item: any) => item.componentName == "countryId").validations[0].options[0].value = true;
            completeFormFields.formFields.find((item: any) => item.componentName == "countryId").visible = true;
        }

        // end country field

        return formsArr || completeFormFields;
    }

    const donorPhoneValue = (selectedValueItem: any) => {

        let countries = abp['countries'];

        let exists = countries.find((item: any) => item.code == selectedValueItem);

        if (exists) {
            formRef!.current!.setFieldsValue({ "countryId": exists.id.toString() });
        }
        else {
            formRef!.current!.setFieldsValue({ "countryId": "Not Specified" });
        }
        return selectedValueItem;
    }

    const validateDonorAlreadyExists = (completeForm: any, selectedValueItem: any) => {

        let donorId = formRef.current!.getFieldValue('donorId');
        if (!donorId) {
            let donorField = completeForm.formFields.find((item: any) => item.internalName == 'donorId');
            if (donorField) {
                if (donorField.dataItems && donorField.dataItems.length > 0) {
                    let donorExists = donorField.dataItems.find((item: any) => item.contactNumber == selectedValueItem);
                    if (donorExists) {
                        utils.getAlertMessage("error", L(`This number can't be used as it is already saved with another name "${donorExists.name}" `));
                    }
                }
            }
        }
        return selectedValueItem;
    }


    const onChangeCallback = async (postBody: GetProductFormRequestDto) => {

        let completeForm = formList;
        let dataItems: any = [];
        switch (postBody.fieldId) {
            case "productId":
                if (postBody.formId) {
                    const forms = await ordersStore.getFormDataItemsByProductId(Number(postBody.formId));
                    if (forms) {
                        forms.map((formItem: any, index: any) => {
                            dataItems.push({ key: formItem.id, value: formItem.name || formItem.Description });
                        });
                        completeForm.formFields = formUtils.setFieldDataItems(completeForm, "formId", dataItems);
                        if (editOrder
                            && editOrder.data
                            && !completeForm.formFields.find((item: any) => item.internalName == "formId").defaultValue) {

                            completeForm.formFields.find((item: any) => item.internalName == "formId").defaultValue = dataItems[0].key;
                        }

                        if (!forms[0].isSupporterNameRequired) {
                            completeForm.formFields.find((item: any) => item.internalName == "donorName").validations = [];
                        }
                        else
                            completeForm.formFields.find((item: any) => item.internalName == "donorName").validations = rules.Donor;

                        // start country field    

                        donorCountryPhoneValidation(forms[0], completeForm);
                        setFormList({ ...completeForm });
                    }
                }
                break;
            case "formId":
                delete postBody.selectedItem;
                if (postBody.formId) {
                    if (!editOrder || !editOrder.data) {
                        await getDynamicForm(postBody);
                    }
                }
                else {
                    if (!editOrder || !editOrder.data) {
                        setSubFormFields([]);
                    }
                }
                break;

            case "supporterId":
                if (postBody.formId) {
                    const donors = await ordersStore.getAssociatedRepSupporters(Number(postBody.formId));
                    if (donors && donors.length > 0) {
                        let filteredList = donors.filter((item: any) => item.code == 'Donor');
                        filteredList.map((formItem: any, index: any) => {
                            dataItems.push({ key: formItem.id, value: formItem.name, name: formItem.name, contactNumber: formItem.contactNumber });
                        });
                        completeForm.formFields = formUtils.setFieldDataItems(completeForm, "donorId", dataItems);
                        if ((!editOrder || !editOrder.data) || completeForm.formFields.find((item: any) => item.internalName == 'supporterId')?.defaultValue != formRef!.current!.getFieldValue('supporterId')) {
                            formRef!.current!.setFieldsValue({ 'donorName': null, 'donorContact': null, 'nameOnReceipt': null });
                        }
                        else {
                            let donorField = completeForm.formFields.find((item: any) => item.internalName == 'donorId');
                            if (donorField) {
                                let item = donorField.dataItems.find((item: any) => item.key == donorField.defaultValue);
                                if (item) {
                                    formRef!.current!.setFieldsValue({ 'donorName': item.name, 'donorContact': item.contactNumber, 'nameOnReceipt': item.name });
                                }
                            }
                        }
                    }
                    else {
                        if (!editOrder || !editOrder.data) {
                            completeForm.formFields = formUtils.setFieldDataItems(completeForm, "donorId", dataItems);
                            formRef!.current!.setFieldsValue({ 'donorName': null, 'donorContact': null, 'nameOnReceipt': null });
                        }
                    }

                    updateDefaultCountry(completeForm, postBody.formId);
                    setFormList({ ...completeForm });
                }
                break;

            case "campaignId":
                if (postBody.formId) {
                    const forms = await ordersStore.getFormDataItemsByCampaignId(Number(postBody.formId));
                    if (forms) {
                        forms.map((formItem: any, index: any) => {
                            dataItems.push({ key: formItem.id, value: formItem.name || formItem.Description });
                        });
                        completeForm.formFields = formUtils.setFieldDataItems(completeForm, "formId", dataItems);
                        if (!forms[0].isSupporterNameRequired) {
                            completeForm.formFields.find((item: any) => item.internalName == "donorName").validations = [];
                        }
                        else
                            completeForm.formFields.find((item: any) => item.internalName == "donorName").validations = rules.Donor;

                        // start country field

                        donorCountryPhoneValidation(forms[0], completeForm);

                        // end country field

                        setFormList({ ...completeForm });
                    }
                }
                break;

            case "donorId":
                if (postBody.formId && postBody.selectedItem) {
                    let obj = {};
                    obj['donorName'] = postBody.selectedItem!['name'];
                    obj['donorContact'] = postBody.selectedItem!['contactNumber'];
                    obj['nameOnReceipt'] = postBody.selectedItem!['name'];
                    formRef!.current!.setFieldsValue(obj);
                }
                break;

            case "customPhoneInput":
                if (completeForm.formFields && completeForm.formFields.length > 0) {

                    if (formRef.current) {
                        if (postBody.formId == "country")
                            donorPhoneValue(postBody.selectedItem);
                        else
                            validateDonorAlreadyExists(completeForm, postBody.selectedItem);

                    }

                }

                break;

            default:
                if (postBody.selectedValue && postBody.formValues) {
                    // if (!editOrder || !editOrder.data) {
                    await getDynamicForm(postBody);
                    // }
                }
                break;
        }
    }
    const getDynamicForm = async (postBody: GetProductFormRequestDto) => {
        try {
            const result = await ordersStore.getForm(postBody);
            setSubFormFields(result.formFields);
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const getProductsList = async () => {
        let ProductDataItems: any = [];
        const productsList = await ordersStore.getAllProducts({
            maxResultCount: 500,
            skipCount: 0,
            keyword: '',
            sorting: '',
        })
        //loop through fields
        productsList.items.map((productItem: any, index: any) => {
            ProductDataItems.push({ key: productItem.id, value: productItem.name || productItem.code });
        });
        dropDownItems.products = ProductDataItems;
        // setDropDownItems({ ...dropDownItems });

        return ProductDataItems;

    }

    const getSupporterList = async () => {
        // if (editOrder && editOrder.data) {
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetAllSupportersIncludingMe'
        }
        const supportersList = await ordersStore.GetComponentData(requestObj, '');

        let dataItemsRep: any = [];
        supportersList && supportersList.items && supportersList.items.map((supporterItem: any) => {
            dataItemsRep.push({ key: supporterItem.id, value: supporterItem.name, countryCode: supporterItem.countryCode });
        });
        dropDownItems.rep = dataItemsRep;
        // setDropDownItems({ ...dropDownItems });
        return dataItemsRep;
        // }
    }

    const getCampaignsList = async () => {
        // if (editOrder && editOrder.data) {
        let campaignDataItems: any = [];
        const campaignList = await ordersStore.getAllCampaigns({
            maxResultCount: 50,
            skipCount: 0,
            keyword: '',
            sorting: '',
        })
        //loop through fields
        campaignList.items.map((productItem: any, index: any) => {
            campaignDataItems.push({ key: productItem.id, value: productItem.name || productItem.code });
        });
        dropDownItems.campaign = campaignDataItems;
        // setDropDownItems({ ...dropDownItems });
        return campaignDataItems;
        // }
    }

    const onChangeRadio = (e: any) => {

        let completeForm = formList;
        let formIdValue = completeForm.formFields.find((item: any) => item.internalName == "formId");

        // campaign case
        if (e.target.value == 1) {
            formIdValue.dataItems = [];
            campaignDropdownOptions.validations[0].options[0].value = true;
            productDropdownOptions.formFields[0].validations[0].options[0].value = false;

            // product case
        } else if (e.target.value == 2) {

            formIdValue.dataItems = [];
            productDropdownOptions.formFields[0].validations[0].options[0].value = true;
            campaignDropdownOptions.validations[0].options[0].value = false;
        }

        setRadioGroupValue(e.target.value);
        formRef!.current!.setFieldsValue({ 'campaignId': null });
        formRef!.current!.setFieldsValue({ 'productId': null });
        setSubFormFields([]);
        formRef!.current!.setFieldsValue({ 'formId': null });

    };

    const changeSelectedValue = (key: any) => {

        if (radioGroupValue == 1) {  // came from campaign dropdown
            if (key.id > 0)
                onChangeCallback({ fieldId: "campaignId", formId: key.id });
        }
        else if (radioGroupValue == 2) {  // came from campaign dropdown
            if (key.id > 0)
                onChangeCallback({ fieldId: "productId", formId: key.id });
        }
    }

    const updateDefaultCountry = (completeForm: any, repId: any) => {

        try {

            //get countryCodeOfRep
            let countryCode = dropDownItems.rep.find((item: any) => item.key == repId)?.countryCode;
            // get phone contact field here ,
            let phoneField = completeForm.formFields.find((item: any) => item.type == 'CustomPhone');
            if (phoneField && countryCode)
                phoneField.defaultCountry = countryCode;

            if (!editOrder || !editOrder.data) {
                donorPhoneValue(countryCode);
            }
        } catch (ex) {
            console.log(`error: ${ex}`);
        }

    }

    return (<CustomModal {...modalOptions} className="order-modal-container">

        <CustomForm ref={formRef} onSubmit={onCreate} onCancel={onCancel}  {...formList} subFormFields={subFormFields} onChangeCallback={onChangeCallback}>
            <CustomCol key={1} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.LARGE)} className="radio-selection-wrapper">
                <Radio.Group onChange={onChangeRadio} value={radioGroupValue} disabled={hideStaticForm}  >
                    <Radio value={1}>Campaign</Radio>
                    <Radio value={2}>Special Service</Radio>
                </Radio.Group>
            </CustomCol>
            {!hideStaticForm && <CustomCol visible={hideStaticForm.toString()} key={2} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>
                {/* <Form.Item label={L(LocalizationKeys.ERP_LblCampaign.key)} name={"campaignId"} hidden={radioGroupValue == 2} rules={radioGroupValue == 2 ? [] : rules.required}>
                    <Select optionFilterProp="children" filterOption={(input, option: any) => option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0 || option.value.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                    } showSearch disabled={false} placeholder="--- Please select ---" onChange={changeSelectedValue}  >
                        {dropDownItems.campaign.map((item: any) => (
                            <Option value={item.key} key={item.key}  >{item.value} </Option>
                        ))}
                    </Select>
                </Form.Item> */}
                {radioGroupValue == 1 && <CustomAutoComplete {...campaignDropdownOptions} onSelectItem={changeSelectedValue} ></CustomAutoComplete>}

                {radioGroupValue == 2 && <CustomAutoComplete {...productDropdownOptions.formFields[0]} onSelectItem={changeSelectedValue} ></CustomAutoComplete>}

                {/* <Form.Item label={L(LocalizationKeys.ERP_LblSpecialService.key)} name={"productId"} hidden={radioGroupValue == 1} rules={radioGroupValue == 1 ? [] : rules.required}>
                    <Select optionFilterProp="children" filterOption={(input, option: any) => option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0 || option.value.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                    } showSearch disabled={false} placeholder="--- Please select ---" onChange={changeSelectedValue} >
                        {dropDownItems.products.map((item: any) => (
                            <Option value={item.key} key={item.key}  >{item.value} </Option>
                        ))}
                    </Select>
                </Form.Item>
                 */}
            </CustomCol>}
        </CustomForm>

    </CustomModal>
    )
}

export default CreateOrUpdateOrder;