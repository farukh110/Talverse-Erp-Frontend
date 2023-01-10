import React, { useEffect, useRef, useState } from 'react';
import CustomLabelText from '../../../../components/CustomWebControls/CustomLabel/customLabelText'
// '../CustomWebControls/CustomLabel/';
import { Card, Form } from 'antd';
import { CustomCol, CustomModal, CustomRow } from '../../../../components/CustomControls';
import { L } from '../../../../lib/abpUtility';
import formUtils from '../../../../utils/formUtils';
import AppConsts from '../../../../lib/appconst';
import TransferPackageContents from './transferPackageContents';
import SelectedAndEquivalentExchangedPayment from './selectedAndEquivalentExchangedPayment';
import ExchangeHistory from './exchangeHistory';
import TransferDetails from './transferDetails';
import { useAppState, useCompState } from '../../../../hooks/appStoreHooks';
import TransferStore from '../../../../stores/transferStore';
import utils from '../../../../utils/utils';
import './index.less';
import { Tabs } from 'antd';
import PaymentListRenderer from '../Step3/PaymentListRenderer';
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

    let paymentCol = 12;

    const [viewTransfer] = useAppState(TransferStore.AppStateKeys.TRANSFER_VIEW);

    const [compState, setCompState] = useCompState(initialState);

    useEffect(() => {
        populateViewData();
    }, [viewTransfer]);

    const { visible, onCancel } = props;

    const populateViewData = () => {
        if (viewTransfer != undefined && viewTransfer?.items.length > 0) {
            let details = viewTransfer.items;
            let packageContentsList = [];

            const { metadataFields, additionalData, trackingNumber, transferDate, origin, destination, destinationType, status, transferDetails, exchangeHistory, supportingDocumentURLs, currencies } = details[0];

            compState.trackingNumber = trackingNumber;
            compState.transferDate = utils.formattedDate(transferDate);
            compState.origin = origin;
            compState.destination = destination;
            compState.destinationType = destinationType;
            compState.status = status;
            compState.transferDetails = transferDetails;
            compState.exchangeHisory = exchangeHistory;
            compState.supportingDocument = supportingDocumentURLs;
            compState.currencyList = currencies;
            compState.dynamicFormValues = additionalData;
            compState.dynamicFormFields = metadataFields;

            for (let i = 0; i < details.length; i++) {
                packageContentsList.push(details[i].transferContents);
            }
            compState.packageContents = packageContentsList;
            setCompState({ ...compState });
        }
    }

    let modalOptions = {
        "visible": visible,
        "width": '75%',
        "title": L(LocalizationKeys.ERP_HdrTransferDetails.key) + " : " +compState.trackingNumber,
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
                                                    displayName={LocalizationKeys.ERP_LblOrigin.key}
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
                                                    displayName={LocalizationKeys.ERP_LblStatus.key}
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

                                    <CustomRow gutter={[16, 16]}>

                                        <CustomCol span={12}>

                                            <TransferPackageContents data={compState}></TransferPackageContents>

                                        </CustomCol>

                                        <CustomCol span={12}>

                                            <Card bodyStyle={{ height: '160px', minHeight: '150px', overflow: 'auto' }}
                                                className="custom-card payment-content"
                                                title={L(LocalizationKeys.ERP_LblEquivalentCurrencyAndAmount.key)}>

                                                <PaymentListRenderer colWith={paymentCol} transferDetails={compState.transferDetails} currencies={compState.currencyList} />
                                            </Card>


                                        </CustomCol>

                                    </CustomRow>

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