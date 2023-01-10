import { Card, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomButton, CustomCol, CustomRow } from '../../../../../components/CustomControls';
import { useCompState } from '../../../../../hooks/appStoreHooks';
import { L } from '../../../../../lib/abpUtility';
import LocalizationKeys from '../../../../../lib/localizationKeys';

const PaymentListRenderer = (props: any) => {

    const { currencyList, validations, addRow, removeRow, removeIcon, dataRow, transferDetails, currencies, showButton, onExchangeClick, colWith, currentCurrency } = props;
    const [dataList, setDataList] = useCompState([]);

    useEffect(() => {
        if (transferDetails && transferDetails.length > 0) {
            let dataArr = [];
            for (let i = 0; i < transferDetails.length; i++) {
                let dataItem = transferDetails[i];
                if (dataItem) {
                    dataItem.currencyId = currencies.find((item: any) => item.symbol == dataItem.currency)?.id;
                    if (dataItem.isDisabled) {
                        if (dataItem.currency == currentCurrency) {
                            dataItem.isDisabled = false;
                        }
                    }
                    else {
                        dataItem.isDisabled = false;
                    }
                    dataArr.push(dataItem);
                }
            }
            setDataList(dataArr);
        }
    }, [transferDetails])


    const onButtonClick = (dataItem: any, index?: any) => {
        if (onExchangeClick && typeof (onExchangeClick) == 'function') {
            onExchangeClick(dataItem, index);
            dataList[index].isDisabled = true;
            setDataList(dataList);
        }
    }

    return (

        <>
            {transferDetails && transferDetails.map((dataItem: any, index: any) => (
                <div className="list-content" key={index}>
                    <CustomRow key={index}>
                        <CustomCol span={colWith}>
                            {index == 0 ? <h4 className="payment-title"> {L(LocalizationKeys.ERP_LblCurrency.key)} </h4> : null}
                            <Card.Grid hoverable={false}>
                                {currencies.find((item: any) => item.symbol == dataItem.currency)?.name}
                            </Card.Grid>
                        </CustomCol>
                        <CustomCol className="small-text-right" span={colWith}>
                            {index == 0 ? <h4 className="payment-title"> {L(LocalizationKeys.ERP_LblAmount.key)} </h4> : null}
                            <Card.Grid hoverable={false}>
                                {currencies.find((item: any) => item.symbol == dataItem.currency)?.symbol + ' ' + parseInt(dataItem.amount)}
                            </Card.Grid>
                        </CustomCol>
                        {showButton && <CustomCol className="small-text-right exchange-col" span={colWith}>
                            {index == 0 ? <h4 className="payment-title"> {L(LocalizationKeys.ERP_LblExchange.key)} </h4> : null}
                            <Card.Grid hoverable={false}>
                                <CustomButton className="exchange-icon" appearance={CustomButton.appearances.Exchange} onClick={() => onButtonClick(dataItem, index)} disabled={dataItem.isDisabled}>
                                </CustomButton>
                            </Card.Grid>
                        </CustomCol>}
                    </CustomRow>
                </div>
            ))}
        </>
    )
}

export default PaymentListRenderer;
