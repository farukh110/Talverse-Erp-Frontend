import React, { useEffect, useRef } from 'react';

import { L } from '../../../lib/abpUtility';
import step1Rules from './Step1/step1.validation';
import step2Rules from './Step2/step2.validation';
import step3Rules from './Step3/step3.validation';
import step4Rules from './Step4/step4.validation';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import TransferStore from '../../../stores/transferStore';
import { CustomModal } from '../../../components/CustomControls';
import CustomMultiStepsForm, { IStep } from '../../../components/CustomMultiStepsForm';
import StartOriginOrDestination from './Step1/selectOriginDestination';
import SelectPayment from './Step2/selectPayment';
import ReviewPackage from './Step3/reviewPackage';
import Dispatch from './Step4/dispatch';
import { FormInstance, message, Modal } from 'antd';
import { CreateSubmitTransferInput } from '../../../services/transfer/dto/transferDto';
import utils from '../../../utils/utils';
import Loading from '../../../components/Loading';
import LocalizationKeys from '../../../lib/localizationKeys';
import AppConsts from '../../../lib/appconst';
import { error } from 'console';
export interface ICreateOrUpdateTransferProps {
    visible?: boolean;
    onCancel: any;
    modalType?: string;
    onCreate: any;
}

const confirm = Modal.confirm;
const CreateOrUpdateTransfer = (props: ICreateOrUpdateTransferProps) => {
    const { transferStore } = useAppStores();
    const formRef = useRef<FormInstance>();
    const [alreadySelectedRows, setAlreadySelectedRows] = useAppState(TransferStore.AppStateKeys.PENDING_TRANSFERS_SELECTED_KEYS);
    const [exchangeList, setExchangeList] = useAppState(TransferStore.AppStateKeys.TRANSFER_DETAILS);
    const [dataSource, setDataSource] = useAppState(TransferStore.AppStateKeys.DATA_SOURCE_EXCHANGE);
    const [pendingTransfersList, setPendingTransfersList] = useCompState([]);
    const [transferPackage, setTransferPackage] = useCompState({});
    const [subFormFields, setSubFormFields] = useAppState(TransferStore.AppStateKeys.TRANSFER_DISPATCH_DYNAMIC_DETAILS);
    const [fileListState, setFileListState] = useAppState(TransferStore.AppStateKeys.FILE_LIST);
    const [dataSourceCounter, setdataSourceCounter] = useAppState(TransferStore.AppStateKeys.EXCHANGE_COUNTER);
    const [editTransfer, setEditTransfer] = useAppState(TransferStore.AppStateKeys.EDIT_TRANSFER);
    const [isInEditMode, setIsInEditMode] = useAppState(TransferStore.AppStateKeys.RETAIN_TRANSFER_DATA);
    const [loadingStatus, setLoadingStatus] = useAppState(AppConsts.appState.FORM_LOADER, false);//useCompState(false);
    const initialState = {
        trackingNumber: '',
        transferDate: '',
        origin: '',
        destination: '',
        destinationType: '',
        status: '',
        packageContents: [],
        transferDetails: [],
        exchangeHisory: [],
        dynamicFormValues: [],
        supportingDocument: [],
        dynamicFormFields: [],
        currencies: [],
        transferFromId: 0,
        transferToId: 0,
        destinationList: [],
        editMode: false
    };
    const [compState, setCompState] = useCompState(initialState);

    useEffect(() => {
        populateComponentsForEdit();
    }, [editTransfer]);

    const populateComponentsForEdit = () => {
        if (editTransfer != undefined && editTransfer?.items?.length > 0) {
            populateViewData();
        }
    }

    const populateViewData = () => {
        if (editTransfer != undefined && editTransfer?.items?.length > 0) {
            let details = editTransfer.items;
            let packageContentsList = [];

            const { destinationList, transferToId, transferFromId, metadataFields, additionalData, trackingNumber, transferDate, origin, destination, destinationType, status, transferDetails, exchangeHistory, supportingDocumentURLs, currencies } = details[0];

            compState.trackingNumber = trackingNumber;
            compState.transferDate = utils.formattedDate(transferDate);
            compState.origin = origin;
            compState.destination = destination;
            compState.destinationType = destinationType;
            compState.status = status;
            compState.transferDetails = transferDetails;
            compState.exchangeHisory = exchangeHistory;
            compState.supportingDocument = supportingDocumentURLs;
            compState.currencies = currencies;
            compState.dynamicFormValues = additionalData;
            compState.dynamicFormFields = metadataFields;
            compState.transferFromId = transferFromId;
            compState.transferToId = transferToId;
            compState.destinationList = destinationList;
            for (let i = 0; i < details.length; i++) {
                packageContentsList.push(details[i].transferContents);
            }
            compState.packageContents = packageContentsList;
            compState.editMode = true;
            setCompState({ ...compState });
            return compState;
        }
    }


    const steps: IStep[] = [
        {
            title: 'Start Origin / Destination',
            content: <StartOriginOrDestination validations={step1Rules} formRef={formRef?.current} editData={compState} />,
        },
        {
            title: 'Select Payment',
            content: <SelectPayment validations={step2Rules} pendingTransfersList={pendingTransfersList} formRef={formRef?.current} editMode={compState.editMode} />,
        },
        {
            title: 'Review Package',
            content: <ReviewPackage validations={step3Rules} transferPackageDetails={transferPackage} formRef={formRef?.current} packageId={compState.trackingNumber} />,
        },
        {
            title: 'Dispatch',
            content: <Dispatch validations={step4Rules} formRef={formRef?.current} transferPoints={transferPackage?.transferPoints ? transferPackage.transferPoints : transferPackage} packageId={compState.trackingNumber} />,
        },
    ];
    useEffect(() => {
        if (isInEditMode == false && formRef.current?.getFieldValue('selectOrigin')) {
            try {
                resetFormValueOnPrefix('selectedPayments', formRef.current);
                getAllPendingTransfers(formRef.current?.getFieldValue('selectOrigin'))
            }
            catch (e) {
                console.log(`error: ${e}`);
            }
        }
    }, [isInEditMode])
    const getAllPendingTransfers = async (originId: any) => {
        setLoadingStatus(true);
        setAlreadySelectedRows([]);
        const transferList = await transferStore.getAllPendingTransfer(originId);
        if (editTransfer != undefined && editTransfer?.items?.length > 0) {

            let currentList = await transferStore.createCombinedPendingTransferList(transferList, compState);

            setPendingTransfersList(currentList);
        } else {
            setPendingTransfersList(transferList);
        }
        setLoadingStatus(false);
    }

    const GetTransferPackageDetails = async (requestObj: any, originId: string) => {
        const transferPackageDetails = await transferStore.getAllTransferPackageDetails(requestObj, originId, compState.trackingNumber);
        // setting package id 
        compState.trackingNumber = transferPackageDetails.packageId;
        setExchangeList([]);
        setTransferPackage(transferPackageDetails);

    }

    const postTransfer = async (requestObj: CreateSubmitTransferInput) => {
        const postedTransfer = await transferStore.postTransfer(requestObj);
        return postedTransfer;
    }

    const updateTransfer = async (requestObj: CreateSubmitTransferInput) => {
        const updatedTransfer = await transferStore.updateTransfer(requestObj);
        return updatedTransfer;
    }

    const { visible, onCreate, onCancel } = props;


    const onNextClick = (currentStep: number, formValues: any) => {
        //do whatever u want and decide do we need to move to next step or not

        switch (currentStep) {
            case 0:
                if (editTransfer != undefined && editTransfer?.items?.length > 0) {
                    getAllPendingTransfers(formValues.selectOrigin);
                } else
                    getAllPendingTransfers(formValues.selectOrigin);
                break;

            case 1:
                if (editTransfer != undefined && editTransfer?.items?.length > 0) {
                    if (!isInEditMode) {
                        setTransferPackage(compState);
                    }
                    else {
                        getTransferPackage(formValues);
                    }
                } else {
                    if (alreadySelectedRows && alreadySelectedRows.length > 0) {
                        // prepare data for ​/api​/Transfer​/GetTransferPackageDetails
                        // use formvalues and pendingTransfersList to finalize object 
                        getTransferPackage(formValues);
                    }
                    else {
                        utils.getAlertMessage("error",L(LocalizationKeys.ERP_MsgPleaseSelectADonation.key));
                        return false;
                    }
                }
                break;

            case 2:

                let allowForwrd = dataSource.find((item: any) => !item.isFinalized);

                if (allowForwrd) {

                    utils.getAlertMessage("error",L(LocalizationKeys.ERP_MsgFinalizeExchnageRows.key));
                    return false;
                }

                break;

            default:
                break;

        }
        var gotSuccess = true;
        return gotSuccess;
    }

    const onPrevClick = (currentStep: number, formValues: any) => {
        //do whatever u want and decide do we need to move to next step or not
        //alert("You can't go back");
        console.log("show data on previous click", formValues);
        var gotSuccess = true;
        return gotSuccess;
    }

    const saveTransfer = async (formValues: any) => {
        try {
            setLoadingStatus(true);

            // alert("Wow! thanks for filling form");
            console.log("Wow! thanks for filling form", formValues);

            // make final post call here of form-data
            let postValue = await transferStore.getSubmitTransferPayload(formValues, subFormFields, pendingTransfersList, fileListState, transferPackage, exchangeList, (editTransfer != undefined && editTransfer?.items?.length > 0));

            let success = null;
            if (editTransfer != undefined && editTransfer?.items?.length > 0) {
                success = await updateTransfer(postValue);
            } else {
                success = await postTransfer(postValue);
            }

            if (success && success.packageId != '') {
                props.onCreate(formValues);
                // have resetting of fields based on sucess save payload.
                resetStateAndFields();
            }
            let gotSuccess = false;
            // return gotSuccess;
            setLoadingStatus(false);

        } catch (ex) {
            console.log(`error: ${ex}`);
            setLoadingStatus(false);
        }
    }

    const onFinish = async (formValues: any) => {
        //do whatever u want and decide do we need to move to next step or not
        try {

            confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmOperation.key),
                onOk() {
                    saveTransfer(formValues);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });


        } catch (err) {
            console.log(`error: ${err}`);

        }

    }

    const getTransferPackage = (formValues: any) => {
        try {
            setLoadingStatus(true);
            let currentList: any = pendingTransfersList.map((object: any) => ({ ...object }));
            let transferSelectedItemsList = transferStore.createInputObjForGetTransferPackage(formValues, currentList, alreadySelectedRows);
            GetTransferPackageDetails(transferSelectedItemsList, formValues.selectOrigin);
            setPendingTransfersList(transferSelectedItemsList);
            setLoadingStatus(false);
        }
        catch (ex) {

            console.log(`error: ${ex}`);
        }
    }

    const resetStateAndFields = () => {

        formRef.current!.resetFields();
        setAlreadySelectedRows([]);
        setExchangeList([]);
        setPendingTransfersList([]);
        setTransferPackage({ ...{} });
        setSubFormFields([]);
        setFileListState({ ...{ fileList: [] } });
        setdataSourceCounter(1);
        setEditTransfer(undefined);
        setCompState({ ...{} });
        setIsInEditMode(false);

    }

    const closeModal = () => {
        resetStateAndFields();
        onCancel();
    }


    const resetFormValueOnPrefix = (prefix: any, formRef: any) => {
        try {
            let values = formRef.getFieldsValue(true);
            let resetFieldsArray = [];
            if (values) {
                for (const property in values) {
                    try {
                        if (property.startsWith(prefix)) {
                            resetFieldsArray.push(property)
                        }
                    }
                    catch (e) {
                        console.log(`error: ${e}`);
                    }
                }
                formRef.resetFields(resetFieldsArray)
            }
        }
        catch (ex) {

            console.log(`error: ${ex}`);

        }
    }
    let modalOptions = {

        "visible": visible,
        "width": '85%',
        "height": '500px',
        "title": editTransfer ? L(LocalizationKeys.ERP_LblEditTransfer.key) + " : " + compState.trackingNumber : L(LocalizationKeys.ERP_LblNewTransfer.key),
        "destroyOnClose": true,
        "onCancel": closeModal,
        "footer": null,
        theme: "danger"

    }

    return (<CustomModal className="custom-modal" {...modalOptions}>
        <Loading spinning={loadingStatus}>
            <CustomMultiStepsForm ref={formRef} finishButtonText={editTransfer ? L(LocalizationKeys.ERP_LblSave.key) : L(LocalizationKeys.ERP_LblDispatch.key)} steps={steps} nextButtonText={L(LocalizationKeys.ERP_LblNext.key)} prevButtonText={L(LocalizationKeys.ERP_LblPrevious.key)} onNext={onNextClick} onPrevious={onPrevClick} onFinish={onFinish} />
        </Loading>
    </CustomModal>
    )
}

export default CreateOrUpdateTransfer;