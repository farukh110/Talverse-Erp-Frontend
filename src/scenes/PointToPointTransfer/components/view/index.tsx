import React, { useEffect, useRef, useState } from 'react';
import CustomLabelText from '../../../../components/CustomWebControls/CustomLabel/customLabelText'
// '../CustomWebControls/CustomLabel/';
import { Form } from 'antd';
import { CustomCol, CustomModal, CustomRow } from '../../../../components/CustomControls';
import { L } from '../../../../lib/abpUtility';
import formUtils from '../../../../utils/formUtils';
import AppConsts from '../../../../lib/appconst';
import TransferPackageContents from './transferPackageContents';
import SelectedAndEquivalentExchangedPayment from './selectedAndEquivalentExchangedPayment';
import ExchangeHistory from './exchangeHistory';
import TransferDetails from './transferDetails';
import { useAppState, useCompState } from '../../../../hooks/appStoreHooks';
// import TransferStore from '../../../../stores/transferStore';
import utils from '../../../../utils/utils';
import './index.less';
import { Tabs } from 'antd';
import PointToPointTransferSore from '../../../../stores/pointToPointTransferSore';
import LocalizationKeys from '../../../../lib/localizationKeys';

const { TabPane } = Tabs;

export interface IViewProps {
    visible: boolean;
    onCancel(): any;

}
const View = (props: IViewProps) => {

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
        currencyList: []

    };

    const [viewTransfer] = useAppState(PointToPointTransferSore.AppStateKeys.TRANSFER_VIEW);

    const [compState, setCompState] = useCompState(initialState);

    useEffect(() => {
        populateViewData();
    }, [viewTransfer]);

    const { visible, onCancel } = props;

    const populateViewData = () => {

        console.log('viewTransferviewTransfer',viewTransfer);

        if (viewTransfer != undefined && viewTransfer?.items.length > 0) {

            console.log('REACHED HERE WITH ITEMS ',viewTransfer);

            let details = viewTransfer.items;
            let packageContentsList = [];
            compState.trackingNumber = details[0].trackingNumber;
            compState.transferDate = utils.formattedDate(details[0].transferDate);
            compState.origin = details[0].origin;
            compState.destination = details[0].destination;
            compState.destinationType = details[0].destinationType;
            compState.status = details[0].status;
            compState.transferDetails = details[0].transferDetails;
            compState.exchangeHisory = details[0].exchangeHistory;
            compState.supportingDocument = details[0].supportingDocumentURLs;
            compState.currencyList = details[0].currencies;
            compState.dynamicFormValues = details[0].additionalData;
            compState.dynamicFormFields = details[0].metadataFields;
            compState.packageContents = details[0].paymentDetails;
            setCompState({ ...compState });

            console.log(compState,'COmpstate');
        }
    }

    let modalOptions = {
        "visible": visible,
        "width": '60%',
        "title": L(LocalizationKeys.ERP_HdrTransferDetails.key),
        "destroyOnClose": true,
        "onCancel": () => { setCompState(initialState); onCancel(); },
        "footer": null,
        theme: "danger"
    }

    return (
        <>

            <CustomModal {...modalOptions} className="order-modal-container">
                <Form layout="vertical" className="custom-form">

                    <CustomRow>
                        <CustomCol span={24}>
                            <Tabs className="custom-tabs" defaultActiveKey={'0'}>
                                <TabPane tab="Package Detail" key="1">

                                    <CustomRow className="tabular-row">

                                        <CustomCol className="tabular-col" key={1} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-name">

                                                <CustomLabelText
                                                    displayName={L(LocalizationKeys.ERP_LblTrackingNumber.key)}
                                                    internalName="trackingNumber"
                                                    value={' '}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={2} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-value">

                                                <CustomLabelText
                                                    internalName="trackingNumber"
                                                    value={compState.trackingNumber}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={3} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-name">

                                                <CustomLabelText
                                                    displayName="Origin"
                                                    internalName="origin"
                                                    value={' '}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={4} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-value">

                                                <CustomLabelText
                                                    internalName="origin"
                                                    value={compState.origin}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                    </CustomRow>

                                    <CustomRow className="tabular-row">

                                        <CustomCol className="tabular-col" key={1} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-name">

                                                <CustomLabelText
                                                    displayName={L(LocalizationKeys.ERP_LblTransferDate.key)}
                                                    internalName="transferDate" value={' '}
                                                    visible={true}></CustomLabelText>

                                            </div>


                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={2} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-value">

                                                <CustomLabelText
                                                    internalName="transferDate" value={compState.transferDate}
                                                    visible={true}></CustomLabelText>


                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={3} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-name">

                                                <CustomLabelText
                                                    displayName={L(LocalizationKeys.ERP_LblDestination.key)}
                                                    internalName="destination"
                                                    value={' '}
                                                    visible={true}></CustomLabelText>


                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={4} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-value">

                                                <CustomLabelText
                                                    internalName="destination"
                                                    value={compState.destination}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                    </CustomRow>

                                    <CustomRow className="tabular-row">

                                        <CustomCol className="tabular-col" key={1} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-name">

                                                <CustomLabelText
                                                    displayName="Status"
                                                    internalName="status"
                                                    value={' '}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={2} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow">

                                                <CustomLabelText
                                                    internalName="status"
                                                    value={compState.status}
                                                    visible={true}></CustomLabelText>


                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={3} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow display-name">

                                                <CustomLabelText
                                                    displayName={L(LocalizationKeys.ERP_LblDestinationType.key)}
                                                    internalName="destinationType"
                                                    value={' '}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                        <CustomCol className="tabular-col" key={4} span={formUtils.getColumnSize(AppConsts.formConstants.columnSize.X_SMALL)}>

                                            <div className="custom-shadow">

                                                <CustomLabelText
                                                    internalName="destinationType"
                                                    value={compState.destinationType}
                                                    visible={true}></CustomLabelText>

                                            </div>

                                        </CustomCol>

                                    </CustomRow>

                                    <br />

                                    <TransferPackageContents data={compState} ></TransferPackageContents>

                                    <br />

                                    <TransferDetails data={compState} ></TransferDetails>

                                </TabPane>
                                <TabPane tab="Additional Information" key="2">
                                    <SelectedAndEquivalentExchangedPayment data={compState} ></SelectedAndEquivalentExchangedPayment>
                                    <br />
                                    <ExchangeHistory data={compState} ></ExchangeHistory>


                                </TabPane>
                            </Tabs>
                        </CustomCol>
                    </CustomRow>
                </Form>
            </CustomModal>

        </>
    )

}
export default View;