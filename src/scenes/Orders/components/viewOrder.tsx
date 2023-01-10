import React, { useEffect, useRef, useState } from 'react';
import rules from './createOrUpdateOrder.validation';
import { isGranted, L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import CustomForm, { FormModes } from '../../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { CustomButton, CustomCol, CustomModal, CustomRow } from '../../../components/CustomControls';
import OrdersStore from '../../../stores/ordersStore';
import utils from '../../../utils/utils';
import { GetProductFormRequestDto } from '../../../services/ProductForm/dto/getProductFormRequestDto';
import { CustomTable } from '../../../components/CustomGrid';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import AppConsts from '../../../lib/appconst';
import Loading from '../../../components/Loading';
import LocalizationKeys from '../../../lib/localizationKeys';
import { Modal } from 'antd';

export interface ICreateOrUpdateOrderProps {
    visible?: boolean;
    onCancel(): any;
    formRef?: React.RefObject<FormInstance>;
    orderNumber?: any;
}

const confirm = Modal.confirm;

const ViewOrder = (props: ICreateOrUpdateOrderProps) => {

    const { visible, onCancel, orderNumber } = props;

    const [formList, setFormList] = useCompState({});
    const formRef = useRef<FormInstance>();
    const { ordersStore } = useAppStores();
    const [subFormFields, setSubFormFields] = useCompState([]);
    const [viewOrder] = useAppState(OrdersStore.AppStateKeys.VIEW_ORDER);
    const [orders] = useAppState(OrdersStore.AppStateKeys.ORDERS, {});
    const [countryInvoices, setCountryInvoices] = useCompState(null);
    const [loadingStatus, setLoadingStatus] = useCompState(false);

    useEffect(() => {
        setSubFormFields([]);
        populateFormFields();
    }, [viewOrder]);

    const populateFormFields = () => {
        if (viewOrder != undefined && viewOrder.id != 0) {
            let data = viewOrder.data;
            let formfields = viewOrder.dataFields;
            let renderObj: any = {
                formFields: []
            }
            let additionalData = data.additionalData
            let formId = additionalData.find((item: any) => item.key == 'FormId')?.value;
            if (formId) {
                getDynamicForm({
                    formId: formId,
                    formValues: additionalData
                });
            }
            Object.keys(data).forEach(function (key) {

                let field = formfields.find((item: any) => item.internalName == key || item.componentName == key);
                if (field) {
                    field.mode = "ReadOnly";
                    field.defaultValue = data[key];
                    renderObj.formFields.push(field);
                }
            });

            let subFormFields = formfields.find((item: any) => item.internalName == "subFormsId");
            if (subFormFields) {
                renderObj.formFields.push(subFormFields);
            }
            setFormList(renderObj);
            loadCountryInvoices(viewOrder.data.id, viewOrder.data.currency);
        }
    }


    const loadCountryInvoices = async (orderId: Number, currency: string) => {

        try {
            let requestObj: ContentRequestDto = {
                ComponentIdOrName: 'GetOrderCountryInvoices',
                Parameters: [{
                    key: "orderId",
                    value: orderId
                }]
            }
            const responseInvList = await ordersStore.GetComponent(requestObj, '');

            if (responseInvList && responseInvList.data && responseInvList.dataFields) {
                responseInvList.dataFields.map((item: any, index: any) => {
                    responseInvList.dataFields[index]['render'] = (text: string) => <div>{text}</div>;
                });
                responseInvList.data.map((item: any, index: any) => {
                    responseInvList.data[index]['amount'] = `${currency} ${item['amount']}`;
                });

                setCountryInvoices(responseInvList);
            }
            else {
                setCountryInvoices(null);
            }
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    let modalOptions = {
        "visible": visible,
        "width": '60%',
        "title": L(LocalizationKeys.ERP_HdrViewOrder.key) + " : " + orderNumber,
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"
    }

    const onChangeCallback = async (postBody: GetProductFormRequestDto) => {
    }
    const getDynamicForm = async (postBody: GetProductFormRequestDto) => {
        try {
            const result = await ordersStore.getForm(postBody);
            // perform prefix work here and hide the prefix field
            if (result && result.formFields.length > 0) {
                for (let i = 0; i < result.formFields.length; i++) {
                    if (result.formFields[i].options?.prefixField) {
                        let prefixFieldInternalName = result.formFields[i].options['prefixField'];
                        let prefixField = result.formFields.find((item: any) => item.internalName == prefixFieldInternalName);
                        result.formFields[i].defaultValue = prefixField.defaultValue + ' ' + result.formFields[i].defaultValue;
                        prefixField.visible = false;
                    }
                    result.formFields[i].mode = "ReadOnly";
                }
            }
            setSubFormFields(result.formFields);
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const downloadInvoiceClick = async (item: any, actionName?: any) => {
        try {
            // make mechanism of download or view of invoice 
            // download work here when invoice path available
            setLoadingStatus(true);
            let invoicePath = item.listDocumentDetails; //JSON.parse(item.invoicePath);
            if (invoicePath && invoicePath.length > 0) {
                await ordersStore.forceDownload(`${AppConsts.remoteServiceBaseUrl}/Document/View?key=${invoicePath[0].documentKey}&${AppConsts.authorization.appAccessKey}=${AppConsts.erpApps.ERPPortal.accessKey}`, invoicePath[0].documentName);
            }
            setTimeout(() => {
                setLoadingStatus(false);
            }, 2000);
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            setLoadingStatus(false);
        }

    }

    const voidInvoiceClick = async (record: any) => {
    
        try {
            setLoadingStatus(true);
            confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmDeleteRecord.key),
                async onOk() {
                    let result: any = await ordersStore.voidCountryInvoice(record.invoiceNumber);

                    if (result && result.invoiceVoidStatus)
                        loadCountryInvoices(viewOrder.data.id, viewOrder.data.currency);
                    else {
                        utils.getAlertMessage(AppConsts.alertMessageTypes.error, "Something Went wrong");
                    }
                    setLoadingStatus(false);
                },
                onCancel() {
                    // console.log('Cancel');
                    setLoadingStatus(false);
                },

            });

        }
        catch (ex) {
            console.log(`error: ${ex}`);
            setLoadingStatus(false);
        }
    }

    let tableOptions = {
        "rowKey": (record: any) => record.invoiceNumber.toString(),
        "bordered": true,
        "columns": countryInvoices?.dataFields ? countryInvoices.dataFields : [],
        "pagination": false,
        "loading": (countryInvoices === undefined ? true : false),
        "dataSource": (countryInvoices === (undefined || null) ? [] : countryInvoices.data),
        "onChange": () => { },
        "actionsList": [
            {
                "actionName": 'Downlad',
                "actionCallback": downloadInvoiceClick,
                "appearance": CustomButton.appearances.Download
            },
            {
                "actionName": 'Void',
                "actionCallback": voidInvoiceClick,
                "appearance": CustomButton.appearances.Void,
                "isVisible": (record: any) => {
                    return ((record.status != AppConsts.invoiceStatuses.VOID) && isGranted(AppConsts.permissionNames.Invoice_Void))
                },
            }
        ],
        "getGridData": () => { },
        "enableSorting": false,
    }

    let headerOptions = {
        "createOrUpdateModalOpen": () => { },
        "headerTitle": L(LocalizationKeys.ERP_HdrInvoiceList.key),
        "enableButton": false
    }

    let searchOptions = {
        "onSearch": () => { },
        "placeholder": L(LocalizationKeys.ERP_LblFilter.key),
        "enableSearch": false
    }

    return (<CustomModal {...modalOptions} className="order-modal-container">
        <Loading spinning={loadingStatus}>
            <CustomForm formMode={FormModes.Display} ref={formRef} onCancel={onCancel} hideButtons={true}  {...formList} subFormFields={subFormFields} onChangeCallback={onChangeCallback}>

            </CustomForm>

            {countryInvoices && countryInvoices.data && <CustomRow style={{ marginTop: 20 }}>

                <CustomCol
                    xs={{ span: 24, offset: 0 }}
                    sm={{ span: 24, offset: 0 }}
                    md={{ span: 24, offset: 0 }}
                    lg={{ span: 24, offset: 0 }}
                    xl={{ span: 24, offset: 0 }}
                    xxl={{ span: 24, offset: 0 }}
                >

                    <CustomTable
                        options={tableOptions}
                        searchOptions={searchOptions}
                        headerOptions={headerOptions}
                    />

                </CustomCol>
            </CustomRow>}
        </Loading>
    </CustomModal>
    )
}

export default ViewOrder;