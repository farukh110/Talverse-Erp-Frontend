import { Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CustomCol, CustomRow } from '../../../../components/CustomControls';
import CustomHeading from '../../../../components/CustomWebControls/CustomHeading';
import { useCompState } from '../../../../hooks/appStoreHooks';
import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';
import TransferStore from '../../../../stores/transferStore';
import CustomDataRepeater from '../Step3/CustomDataRepeater';


export interface IExchangeHistoryProps {
    visible?: boolean;
    data: any;
}
const ExchangeHistory = (props: IExchangeHistoryProps) => {

    const { data } = props;
    const initialState: any = {
        currencyList: [],
        dataSource: []
    };
    const [compState, setCompState] = useCompState(initialState);

    useEffect(() => {
        loadExchangeDetails();
    }, [data]);

    const loadExchangeDetails = () => {
        const exchangeHisory = data.exchangeHisory;
        const currencyList = data.currencyList;
        if (exchangeHisory && exchangeHisory.length > 0) {
            compState.dataSource = exchangeHisory;
        }
        if (currencyList && currencyList.length > 0) {
            compState.currencyList = currencyList.map((item: any) => {
                return { key: item.symbol, value: item.symbol + ' - ' + item.name }
            });
        }
        setCompState({ ...compState });
    }

    return (
        <>

            {compState.dataSource && compState.dataSource.length > 0 &&
                <>

                    <Card className="custom-card payment-content" title={L(LocalizationKeys.ERP_HdrExchangeHistory.key)}>

                        <CustomRow gutter={[16, 16]} className="data-header">
                            <CustomCol key={1} span={5}>
                                <h4> From Currency </h4>
                            </CustomCol>
                            <CustomCol key={2} span={5}>
                                <h4> Amount </h4>
                            </CustomCol>
                            <CustomCol key={3} span={6}>
                                <h4> To Currency </h4>
                            </CustomCol>
                            <CustomCol key={4} span={5}>
                                <h4> Amount </h4>
                            </CustomCol>
                            <CustomCol key={5} span={3}>
                                <h4> Rate </h4>
                            </CustomCol>
                        </CustomRow>

                        {compState.currencyList && compState.currencyList.length > 0 && compState.dataSource && compState.dataSource.map((dataRow: any, index: any) => (
                            <CustomDataRepeater key={index}
                                currencyList={compState.currencyList}
                                dataRow={dataRow}
                                validations={[]}
                                viewMode={true} />
                        ))}

                    </Card>

                </>
            }

        </>
    )



}
export default ExchangeHistory;