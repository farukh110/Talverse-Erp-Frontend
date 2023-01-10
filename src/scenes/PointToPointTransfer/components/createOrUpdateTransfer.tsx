import React, { useEffect, useRef } from 'react';

import { L } from '../../../lib/abpUtility';
import step1Rules from './Step1/step1.validation';
import step2Rules from './Step2/step2.validation';
import step3Rules from './Step3/step3.validation';
import step4Rules from './Step4/step4.validation';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import { CustomModal } from '../../../components/CustomControls';
import CustomMultiStepsForm, { IStep } from '../../../components/CustomMultiStepsForm';
import StartOriginOrDestination from './Step1/selectOriginDestination';
import SelectPayment from './Step2/selectPayment';
import ReviewPackage from './Step3/reviewPackage';
import Dispatch from './Step4/dispatch';
import { FormInstance, message, Modal } from 'antd';
// import { CreateSubmitTransferInput } from '../../../services/transfer/dto/transferDto';
import utils from '../../../utils/utils';
import PointToPointTransferSore from '../../../stores/pointToPointTransferSore';
import { ContentRequestDto } from '../../../services/Content/dto/contentRequestDto';
import { CreateSubmitTransferInput } from '../../../services/pointToPointTransfer/dto/pointToPointTransferDto';
import Loading from '../../../components/Loading';
import LocalizationKeys from '../../../lib/localizationKeys';
import AppConsts from '../../../lib/appconst';
export interface ICreateOrUpdateTransferProps {
    visible?: boolean;
    onCancel: any;
    modalType?: string;
    onCreate: any;
}

const confirm = Modal.confirm;
const CreateOrUpdateTransfer = (props: ICreateOrUpdateTransferProps) => {
    const { pointToPointTransfer } = useAppStores();
    const formRef = useRef<FormInstance>();
    const [alreadySelectedRows, setAlreadySelectedRows] = useAppState(PointToPointTransferSore.AppStateKeys.PENDING_TRANSFERS_SELECTED_KEYS);
    const [exchangeList, setExchangeList] = useAppState(PointToPointTransferSore.AppStateKeys.TRANSFER_DETAILS);
    const [pendingTransfersList, setPendingTransfersList] = useCompState([]);
    const [transferPackage, setTransferPackage] = useCompState({});
    const [subFormFields, setSubFormFields] = useAppState(PointToPointTransferSore.AppStateKeys.TRANSFER_DISPATCH_DYNAMIC_DETAILS);
    const [fileListState, setFileListState] = useAppState(PointToPointTransferSore.AppStateKeys.FILE_LIST);
    const [dataSourceCounter, setdataSourceCounter] = useAppState(PointToPointTransferSore.AppStateKeys.EXCHANGE_COUNTER);
    const [editTransfer, setEditTransfer] = useAppState(PointToPointTransferSore.AppStateKeys.EDIT_TRANSFER);
    // const [steps,setSteps] = useCompState([]);
    const [loadingStatus, setLoadingStatus] = useAppState(AppConsts.appState.FORM_LOADER, false); //useCompState(false);



    const [isInEditMode, setIsInEditMode] = useAppState(PointToPointTransferSore.AppStateKeys.RETAIN_TRANSFER_DATA);
    const initialState = {
        trackingNumber: '',
        transferDate: '',
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
        editMode: false,
        selectOrigOrDestObj: {
            origin: '',
            destination: '',
            destinationType: '',
            originTypeId: 0,
            destinationTypeId: 0,
            destinationId: 0,
            originId: 0

        }
    };
    const [compState, setCompState] = useCompState(initialState);

    useEffect(() => {
        populateComponentsForEdit();
    }, [editTransfer]);

    const populateComponentsForEdit = () => {
        if (editTransfer != undefined && editTransfer.sourceTransferPointId) {
            populateViewData();
        }
    }

    const populateViewData = () => {
        if (editTransfer != undefined && editTransfer.sourceTransferPointId) { // && some extra condition

            compState.trackingNumber = editTransfer.trackingNumber;
            compState.transferDate = utils.formattedDate(editTransfer.transferDate);
            compState.selectOrigOrDestObj = {
                origin: editTransfer.origin,
                destination: editTransfer.destination,
                destinationType: editTransfer.destinationType,
                originTypeId: editTransfer.sourceTypeId,
                destinationTypeId: editTransfer.destinationTypeId,
                destinationId: editTransfer.transferToId,
                originId: editTransfer.sourceTransferPointId
            };
            compState.status = editTransfer.status;
            compState.transferDetails = editTransfer.transferDetails;
            compState.exchangeHisory = editTransfer.exchangeHistory;
            compState.supportingDocument = editTransfer.supportingDocumentURLs;
            compState.currencies = editTransfer.currencies;
            compState.dynamicFormValues = editTransfer.additionalData;
            compState.dynamicFormFields = editTransfer.metadataFields;
            compState.destinationList = editTransfer.destinationList;
            compState.packageContents = editTransfer.paymentDetails;
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
    const getAllPendingTransfers = async (sourceTransferPoint: any) => {
        setLoadingStatus(true);
        setAlreadySelectedRows([]);

        // GetComponentData
        let requestObj: ContentRequestDto = {
            ComponentIdOrName: 'GetTransferPointBalanceAmounts',
            Parameters: [{
                key: "TransferPointId",
                value: sourceTransferPoint
            }]
        }

        const transferList = await pointToPointTransfer.GetComponentData(requestObj, '');
        if (editTransfer != undefined && editTransfer?.paymentDetails) {
            transferList.balanceAmount = pointToPointTransfer.setDefaultTransferAmount(transferList?.balanceAmount);
            let transferListNew: any = transferList?.balanceAmount;
            let currentList: any = transferListNew.map((object: any) => ({ ...object }));

            let selectedPaymentsList = editTransfer.paymentDetails;
            for (let i = 0; i < selectedPaymentsList.length; i++) {
                let similiarItem = currentList.find((item: any) => item.currencyCode == selectedPaymentsList[i].currency);
                if (similiarItem) {
                    similiarItem.isSelected = true;
                    similiarItem.amount = Number(similiarItem.amount) + Number(selectedPaymentsList[i].amount);
                    similiarItem.transferAmount = Number(selectedPaymentsList[i].amount);
                }
                else {
                    selectedPaymentsList[i].isSelected = true;
                    selectedPaymentsList[i].transferAmount = selectedPaymentsList[i].amount;
                    selectedPaymentsList[i].currencyCode = selectedPaymentsList[i].currency;
                    selectedPaymentsList[i].currencySymbol = compState.currencies.find((cur: any) => cur.code == selectedPaymentsList[i].currency)?.symbol;
                    currentList.push(selectedPaymentsList[i]);
                }
            }
            transferList.balanceAmount = currentList
            setPendingTransfersList(transferList);
        } else {
            let balanceAmountList = pointToPointTransfer.setDefaultSelectionColumn(transferList?.balanceAmount);
            transferList.balanceAmount = balanceAmountList
            setPendingTransfersList(transferList);
        }

        setLoadingStatus(false);
    }

    const GetTransferPackageDetails = async (requestObj: any, sourceTpId: Number) => {
        const transferPackageDetails = await pointToPointTransfer.getAllTransferPackageDetails(requestObj, 2, sourceTpId);
        compState.trackingNumber = transferPackageDetails.packageId;
        setExchangeList([]);
        setTransferPackage(transferPackageDetails);

    }

    const postTransfer = async (requestObj: CreateSubmitTransferInput) => {
        setLoadingStatus(true);
        const postedTransfer = await pointToPointTransfer.postTransfer(requestObj);
        return postedTransfer;

    }

    const { visible, onCreate, onCancel } = props;


    const onNextClick = (currentStep: number, formValues: any) => {
        //do whatever u want and decide do we need to move to next step or not

        switch (currentStep) {
            case 0:
                if (editTransfer != undefined && editTransfer.sourceTransferPointId) {
                    getAllPendingTransfers(formValues.selectOrigin);
                } else
                    getAllPendingTransfers(formValues.selectOrigin);
                break;

            case 1:
                if (editTransfer != undefined && editTransfer?.paymentDetails) {
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
                        message.error(LocalizationKeys.ERP_MsgPleaseSelectADonation.key);
                        return false;
                    }
                }
                break;

            case 2:
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
            //do whatever u want and decide do we need to move to next step or not
            console.log(formValues);
            // alert("Wow! thanks for filling form");
            console.log("Wow! thanks for filling form", formValues);
            // make final post call here of form-data
            let postValue = await pointToPointTransfer.getSubmitTransferPayload(formValues, subFormFields, pendingTransfersList, fileListState, transferPackage, exchangeList) // createTransferPostobj(formValues);
            let success = await postTransfer(postValue);
            if (success && success.packageId != '') {
                props.onCreate(formValues);
                // have resetting of fields based on sucess save payload.
                resetStateAndFields();
            }

            setLoadingStatus(false);

        } catch (ex) {
            console.log(ex);
            setLoadingStatus(false);
        }
    }

    const onFinish = async (formValues: any) => {

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

        // var gotSuccess = false;
        // return gotSuccess;
    }

    const getTransferPackage = (formValues: any) => {
        try {
            setLoadingStatus(true);
            let currentList: any = pendingTransfersList.balanceAmount.map((object: any) => ({ ...object }));
            let transferSelectedItemsList = pointToPointTransfer.createInputObjForGetTransferPackage(formValues, currentList, alreadySelectedRows);
            pendingTransfersList.balanceAmount = transferSelectedItemsList

            GetTransferPackageDetails(transferSelectedItemsList, formValues.selectOrigin);
            setPendingTransfersList({ ...pendingTransfersList });
            setLoadingStatus(false);
        }
        catch (ex) {
            console.log(`error: ${ex}`);
            setLoadingStatus(false);
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
        "height": '400px',
        "title": L(LocalizationKeys.ERP_HdrRecordANewTransfer.key),
        "destroyOnClose": true,
        "onCancel": closeModal,
        "footer": null,
        theme: "danger"

    }
    return (<CustomModal className="custom-modal" bodyStyle={{ overflow: 'auto' }} {...modalOptions}>
        <Loading spinning={loadingStatus}>
            <CustomMultiStepsForm ref={formRef} steps={steps} nextButtonText={L(LocalizationKeys.ERP_LblNext.key)} prevButtonText={L(LocalizationKeys.ERP_LblPrevious.key)} onNext={onNextClick} onPrevious={onPrevClick} onFinish={onFinish} />
        </Loading>
    </CustomModal>
    )
}

export default CreateOrUpdateTransfer;