import React, { useEffect, useRef, useState } from 'react';
import CustomHeading from '../../../../components/CustomWebControls/CustomHeading';
import { useCompState } from '../../../../hooks/appStoreHooks';
import { Card, Table } from 'antd';
import TransferStore from '../../../../stores/transferStore';
import LocalizationKeys from '../../../../lib/localizationKeys';
import { L } from '../../../../lib/abpUtility';



export interface ITransferPackageContentsProps {
    visible?: boolean;
    data: any;


}
const TransferPackageContents = (props: ITransferPackageContentsProps) => {

    const { data } = props;



    const [compState, setCompState] = useCompState({ dataList: [] });

    const columns = [
        {
            title: 'Category Name - Currency',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Transfer Amount',
            dataIndex: 'transferAmount',
            width: '30%',
            key: 'transferAmount',
        },
    ];

    useEffect(() => {
        initializePendingTransferData();
    }, [data])

    const initializePendingTransferData = () => {
        let dataList: any = [];
        if (data.packageContents && data.packageContents.length > 0) {
            data.packageContents.map((transferItem: any,index:any) => {
                let currency = data.currencyList.find((cur: any) => cur.code == transferItem.currency);
                dataList.push({
                    key:index,
                    categoryName: transferItem.currency + ' - ' + currency.name,
                    amount: currency.symbol + ' ' + transferItem.pendingAmount,
                    transferAmount: currency.symbol + ' ' + transferItem.amount,

                });
            });
            compState.dataList = dataList;
            setCompState({ ...compState });
        }
    }

    return (
        <>
            <Card className="custom-card payment-content" title={L(LocalizationKeys.ERP_HdrSelectedPackageContents.key)}>
                {compState.dataList && <Table
                    columns={columns}
                    dataSource={compState.dataList}
                    pagination={false}
                />
                }
            </Card>
        </>
    )



}
export default TransferPackageContents;