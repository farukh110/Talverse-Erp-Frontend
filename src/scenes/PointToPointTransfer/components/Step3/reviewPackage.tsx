import React, { useEffect, useState } from 'react';
import { L } from '../../../../lib/abpUtility';
import { CustomCol, CustomRow } from '../../../../components/CustomControls';
import '../../index.less';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import CustomDataRepeater from './CustomDataRepeater';
import PaymentListRenderer from './PaymentListRenderer';
import { Badge, Card } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import PointToPointTransferSore from '../../../../stores/pointToPointTransferSore';
import LocalizationKeys from '../../../../lib/localizationKeys';

export interface ITransferState {

    dataList: [],
    currenciesList: [],
    isSelect: boolean,
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    transferId: number;
    filter: string;
    sorting: string;
    exchangeList: [];
}

const ReviewPackage = (props: any) => {

    const { validations, transferPackageDetails, formRef ,packageId} = props;

    const initialState: ITransferState = {

        dataList: [],
        currenciesList: [],
        isSelect: false,
        modalVisible: false,
        maxResultCount: 50,
        skipCount: 0,
        transferId: 0,
        filter: '',
        sorting: '',
        exchangeList: []
    };

    const { transferStore } = useAppStores();
    const [compState, setCompState] = useCompState(initialState);
    const [exchangeList, setExchangeList] = useAppState(PointToPointTransferSore.AppStateKeys.TRANSFER_DETAILS);
    const [dataSource, setDataSource] = useAppState(PointToPointTransferSore.AppStateKeys.DATA_SOURCE_EXCHANGE, []);
    const [removeIcon, setRemoveIcon] = useCompState(false);
    const [dataSourceCounter, setdataSourceCounter] = useAppState(PointToPointTransferSore.AppStateKeys.EXCHANGE_COUNTER, 1);
    const [currentExchangeCurrency, setcurrentExchangeCurrency] = useCompState('');
    const [editTransfer] = useAppState(PointToPointTransferSore.AppStateKeys.EDIT_TRANSFER);
    const [retainTransferHistory, setRetainTransferHistory] = useAppState(PointToPointTransferSore.AppStateKeys.RETAIN_TRANSFER_DATA);

    const onLoad = () => {
        renderSelectedItems();
    }
    useEffect(onLoad, [transferPackageDetails]);

    const renderSelectedItems = () => {

        if (editTransfer != undefined && editTransfer.sourceTransferPointId && !retainTransferHistory) {

            compState.dataList = transferPackageDetails.packageContents.map((item: any) => {
                return {
                    amount: item.amount,
                    currency: transferPackageDetails.currencies.find((cur: any) => cur.code == item.currency)?.symbol
                }
            })
            compState.currencyList = transferPackageDetails.currencies.map((item: any) => {
                return { key: item.symbol, value: item.symbol + ' - ' + item.name }
            });
            setExchangeList(transferPackageDetails.transferDetails.map((object: any) => ({ ...object })));
            let exchangeHistory = transferPackageDetails.exchangeHisory.map((item: any, index: any) => {
                return {
                    id: index,//dataSource.length + 1,
                    fromCurrency: item.fromCurrency,
                    amount: item.fromAmount,
                    toCurrency: item.toCurrency,
                    toAmount: item.toAmount,
                    exchangeRate: item.exchangeRate,
                    isEditable: false,
                    maxAmount: item.fromAmount,
                    index: index
                }
            });
            setDataSource(exchangeHistory); // exchange History
        }
        else {
            if (transferPackageDetails && transferPackageDetails.transferDetails) {
                compState.dataList = transferPackageDetails.transferDetails;
                compState.currencyList = transferPackageDetails.currencies.map((item: any) => {
                    return { key: item.symbol, value: item.symbol + ' - ' + item.name }
                });
                if (!exchangeList || exchangeList.length === 0) {
                    setExchangeList(transferPackageDetails.transferDetails.map((object: any) => ({ ...object })));
                    setDataSource([]);
                }
            }
            setCompState({ ...compState });
        }

    }

    const onExchangeClick = (detail: any, index: any) => {
        if (detail) {
            const exchangeRecord = [
                // copy the current users state
                ...dataSource,
                // now you can add a new object to add to the array
                {
                    // using the length of the array for a unique id
                    id: dataSourceCounter,//dataSource.length + 1,
                    fromCurrency: detail.currency,
                    amount: detail.amount,
                    toCurrency: null,
                    toAmount: null,
                    exchangeRate: null,
                    isEditable: true,
                    maxAmount: detail.amount,
                    index: index
                }
            ];
            // update the state to the updatedUsers
            setdataSourceCounter(dataSourceCounter + 1);
            setDataSource(exchangeRecord);
            setRemoveIcon(true);
        }

    }

    const lockRow = (dataRow?: any) => {

        let exchangeItems: any[] = exchangeList.map((item: any) => ({ ...item }));
        let exchangedCurrency = exchangeItems.find((item: any) => item.currency == dataRow.fromCurrency);
        if (exchangedCurrency) {
            let leftAmount = Number(exchangedCurrency.amount) - Number(dataRow.fromAmount);
            if (leftAmount && leftAmount > 0) {
                exchangedCurrency.amount = leftAmount;
            }
            else {
                let index = exchangeItems.findIndex((item: any) => item.currency == dataRow.fromCurrency);
                if (index >= 0) {
                    exchangeItems.splice(index, 1);
                }
            }
        }
        let exchnangedToCurrency = exchangeItems.find((item: any) => item.currency == dataRow.toCurrency);
        if (exchnangedToCurrency) {
            exchnangedToCurrency.amount = Number(exchnangedToCurrency.amount) + Number(dataRow.toAmount);
        }
        else {
            exchangeItems.push({ currency: dataRow.toCurrency, amount: dataRow.toAmount })
        }
        setcurrentExchangeCurrency(dataRow.fromCurrency)
        setExchangeList(exchangeItems);
    }


    const revertExchnagedRow = (dataRow?: any) => {
        let exchangeItems: any[] = exchangeList.map((item: any) => ({ ...item }));
        let exchangedCurrency = exchangeItems.find((item: any) => item.currency == dataRow.fromCurrency);
        if (exchangedCurrency) {
            exchangedCurrency.amount = Number(exchangedCurrency.amount) + Number(dataRow.fromAmount);
        } else {
            exchangeItems.splice(dataRow.index, 0, { currency: dataRow.fromCurrency, amount: dataRow.fromAmount })
        }
        let exchnangedToCurrency = exchangeItems.find((item: any) => item.currency == dataRow.toCurrency);
        if (exchnangedToCurrency) {
            let leftAmount = Number(exchnangedToCurrency.amount) - Number(dataRow.toAmount); //Math.abs()
            if (leftAmount && leftAmount > 0) {
                exchnangedToCurrency.amount = leftAmount;
            }
            else {
                let index = exchangeItems.findIndex((item: any) => item.currency == dataRow.toCurrency);
                if (index >= 0) {
                    exchangeItems.splice(index, 1);
                }
            }
        }
        let index = dataSource.findIndex((rec: any) => rec.id === dataRow.id);
        dataSource.splice(index, 1);
        setDataSource([...dataSource]);
        setcurrentExchangeCurrency(dataRow.fromCurrency)
        setExchangeList(exchangeItems);
    }

    const removeRow = (record: any) => {
        let index = dataSource.findIndex((rec: any) => rec.id === record.id);
        dataSource.splice(index, 1);
        setcurrentExchangeCurrency(record.fromCurrency)
        setExchangeList([...exchangeList]);
        setDataSource([...dataSource]);
    }

    let paymentCol = 12;
    let equivalentCol = 8;

    return (
        <>
            <div className='record-view-padding'>

                <Badge.Ribbon className='custom-badge' text={`Package Id: ${packageId}`}>

                    <Card size="small">

                        <br />

                        <CustomRow className="record-view">
                            <CustomCol
                                xl={{ span: 10 }}
                                md={{ span: 10 }}
                                sm={{ span: 24 }}
                                xs={{ span: 24 }}>
                                <Card
                                    bodyStyle={{ height: '180px', minHeight: '216px', overflow: 'auto' }}
                                    className="custom-card select-payment"
                                    title={L(LocalizationKeys.ERP_LblSelectedPaymentsTotal.key)}>
                                    <PaymentListRenderer
                                        colWith={paymentCol}
                                        transferDetails={compState.dataList}
                                        currencies={transferPackageDetails.currencies}
                                        showButton={false}
                                    />
                                </Card>

                            </CustomCol>

                            <CustomCol
                                xl={{ span: 4 }}
                                md={{ span: 10 }}
                                sm={{ span: 24 }}
                                xs={{ span: 10 }}>

                                <DoubleRightOutlined className="transfer-icon" />

                            </CustomCol>

                            <CustomCol
                                xl={{ span: 10 }}
                                md={{ span: 10 }}
                                sm={{ span: 24 }}
                                xs={{ span: 24 }}>

                                <Card
                                    bodyStyle={{ height: '180px', minHeight: '216px', overflow: 'auto' }}
                                    className="custom-card"
                                    title={L(LocalizationKeys.ERP_LblEquivalentCurrencyAndAmount.key)}>

                                    <PaymentListRenderer
                                        colWith={equivalentCol}
                                        transferDetails={exchangeList}
                                        currencies={transferPackageDetails.currencies}
                                        showButton={true} onExchangeClick={onExchangeClick} currentCurrency={currentExchangeCurrency} />

                                </Card>
                            </CustomCol>

                        </CustomRow>

                    </Card>

                </Badge.Ribbon>

            </div>

            {dataSource && dataSource.length > 0 && <CustomRow className="top-margin-10px row-padding-15px">

                <Card className="custom-card exchange-payments" title={L(LocalizationKeys.ERP_LblSelectedPaymentsTotal.key)}>

                    <CustomCol span={24}>

                        <CustomRow gutter={[16, 16]} className="data-header">
                            <CustomCol span={4}>
                                <h4> From Currency </h4>
                            </CustomCol>
                            <CustomCol span={5}>
                                <h4> Amount </h4>
                            </CustomCol>
                            <CustomCol span={4}>
                                <h4> To Currency </h4>
                            </CustomCol>
                            <CustomCol span={5}>
                                <h4> Amount </h4>
                            </CustomCol>
                            <CustomCol span={3}>
                                <h4> Rate </h4>
                            </CustomCol>
                            <CustomCol span={3}>
                                <h4> Action </h4>
                            </CustomCol>
                        </CustomRow>
                        {
                            dataSource && compState.currencyList && compState.currencyList.length > 0 && dataSource.length > 0 && dataSource.map((dataRow: any, index: any) => (
                                <CustomDataRepeater key={index}
                                    currencyList={compState.currencyList}
                                    dataRow={dataRow}
                                    lockRow={lockRow}
                                    removeIcon={removeIcon}
                                    removeRow={removeRow}
                                    revertExchange={revertExchnagedRow}
                                    validations={validations} formRef={formRef} />

                            ))
                        }
                    </CustomCol>
                </Card>
            </CustomRow>}

        </>
    )
}

export default ReviewPackage;
