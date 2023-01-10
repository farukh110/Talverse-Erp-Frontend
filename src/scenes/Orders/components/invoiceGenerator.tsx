import React, { useEffect, useRef, useState } from 'react';
import rules from './createOrUpdateOrder.validation';
import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import CustomForm, { FormModes } from '../../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { CustomButton, CustomCol, CustomModal, CustomRow } from '../../../components/CustomControls';
import OrdersStore from '../../../stores/ordersStore';
import utils from '../../../utils/utils';
import { GetProductFormRequestDto } from '../../../services/ProductForm/dto/getProductFormRequestDto';
import { Form } from 'antd';
import formUtils from '../../../utils/formUtils';
import CustomTextInput from '../../../components/CustomWebControls/CustomTextbox/customTextInput';
import CustomDropdownInput from '../../../components/CustomWebControls/CustomDropdown/customDropdownInput';
import CustomNumberInput from '../../../components/CustomWebControls/CustomNumberTextbox/customNumberInput';

import Rules from './invoiceGenerator.validation';
import { CustomTable } from '../../../components/CustomGrid';
import { CountryInvoiceDto } from '../../../services/orders/dto/ordersDto';
import Loading from '../../../components/Loading';
import AppConsts from '../../../lib/appconst';
import { EntityDto } from '../../../services/dto/entityDto';
import LocalizationKeys from '../../../lib/localizationKeys';

export interface IInvoiceGeneratorProps {
    visible?: boolean;
    onCancel(): any;
    formRef?: React.RefObject<FormInstance>;
    itemValues?: any;
}
const InvoiceGenerator = (props: IInvoiceGeneratorProps) => {
    const [formRef] = Form.useForm();
    const [countriesList, setCountriesList] = useCompState({});
    const [orders] = useAppState(OrdersStore.AppStateKeys.ORDERS, {});
    const [loadingStatus, setLoadingStatus] = useCompState(false);
    const { ordersStore } = useAppStores();
    const { visible, onCancel, itemValues } = props;
    const [invoiceMaxAmount, setInvoiceMaxAmount] = useCompState(null);


    useEffect(() => {
        populateFormFields();
    }, [itemValues]);

    const populateFormFields = async () => {
        try {
            let countries = abp['countries'];
            let countryList: any = [];
            countries && countries.length > 0 && countries.map((item: any, index: any) => {
                countryList.push({ key: item.id, value: item.code + ' - ' + item.name });
            });
            setCountriesList(countryList);

            if (itemValues) {


                let dto: EntityDto = {
                    id: itemValues.orderId
                };
                let resp = await ordersStore.get(dto);
                if (resp) {
                    let obj = {
                        donorName: itemValues.placedFor,
                        amount: resp.remainingAmountForInvoice
                    };
                    formRef.setFieldsValue(obj);
                }
            }



        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const onGenerateClick = async () => {
        setLoadingStatus(true);
        try {
            formRef!.validateFields().then(async (values: any) => {
                setLoadingStatus(true);
                const result = await ordersStore.countryInvoiceRequestCreate(itemValues.orderId, values);
                if (result && result.imageUrl) {
                    closePopup();
                }
                setLoadingStatus(false);
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            setLoadingStatus(false);
        }
    }

    console.log(itemValues);

    const onGenerateAndDownloadClick = async () => {
        try {
            formRef!.validateFields().then(async (values: any) => {
                setLoadingStatus(true);
                const result = await ordersStore.countryInvoiceRequestCreate(itemValues.orderId, values);
                if (result && result.pdfUrl) {
                    let fileName = result.pdfUrl.split('?key=');
                    await ordersStore.forceDownload(`${AppConsts.remoteServiceBaseUrl}/Document/View?key=${fileName[1]}&${AppConsts.authorization.appAccessKey}=${AppConsts.erpApps.ERPPortal.accessKey}`, fileName[1]);
                    // forceDownload(result.imageUrl+'&SourceAppKey=RVJQUG9ydGFs', fileName[1]);
                    closePopup();

                }
                setLoadingStatus(false);
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            setLoadingStatus(false);
        }

    }

    const closePopup = () => {
        formRef.resetFields();
        onCancel();
    }


    let modalOptions = {
        "visible": visible,
        "width": '60%',
        "title": L(LocalizationKeys.ERP_HdrGenerateInvoice.key),
        "destroyOnClose": true,
        "onCancel": closePopup,
        "footer": null,
        theme: "danger"
    }


    return (<CustomModal {...modalOptions} className="order-modal-container">
        <Loading spinning={loadingStatus}>
            <Form form={formRef} layout="vertical" className="custom-form"  >
                <CustomRow gutter={[16]}>
                    <CustomCol key={0} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.MEDIUM)}>
                        <CustomTextInput name={'donorName'} label={LocalizationKeys.ERP_LblDonorName.key} rules={Rules.donorName}   ></CustomTextInput>
                    </CustomCol>
                    <CustomCol key={2} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.MEDIUM)}>
                        <CustomDropdownInput name={'country'} label={LocalizationKeys.ERP_LblCountry.key} rules={Rules.country} dataItems={countriesList} ></CustomDropdownInput>
                    </CustomCol>


                </CustomRow>

                <CustomRow gutter={[16]}>

                    <CustomCol key={3} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.MEDIUM)}>
                        <CustomNumberInput formRef={formRef} prefix={itemValues?.symbol} name={'amount'} label={LocalizationKeys.ERP_LblAmount.key} rules={Rules.amount}   ></CustomNumberInput>
                    </CustomCol>
                </CustomRow>


                <Form.Item className="button-wrapper">
                    <CustomButton onClick={() => onGenerateClick()} appearance={CustomButton.appearances.Save} >
                        {L(LocalizationKeys.ERP_BtnGenerate.key)}
                    </CustomButton>
                    <CustomButton onClick={() => onGenerateAndDownloadClick()} appearance={CustomButton.appearances.Save}>
                        {L(LocalizationKeys.ERP_BtnGenrateAndDownload.key)}
                    </CustomButton>
                </Form.Item>

            </Form>
        </Loading>

    </CustomModal>
    )
}

export default InvoiceGenerator;