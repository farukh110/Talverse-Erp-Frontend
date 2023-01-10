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
        let index = 0;
        if (data.packageContents && data.packageContents.length > 0)
            data.packageContents.map((transferItem: any) => {
                const rowId = `rw-${transferItem.id}`;
                let currencySymbol = data.currencyList.find((cur: any) => cur.code == transferItem.currency)?.symbol
                index++;
                dataList.push({
                    key: rowId,
                    categoryName: transferItem.product + ' - ' + transferItem.currency,
                    amount: currencySymbol + ' ' + transferItem.pendingAmount,
                    transferAmount: currencySymbol + ' ' + transferItem.transferAmount,
                    children: transferItem.additionalData?.map((orderItem: any) => {
                        index++;
                        const cRowId = `rw-${transferItem.id}-${orderItem.orderDetailId}`;
                        return {
                            key: cRowId,
                            categoryName: orderItem.name,
                            amount: orderItem.currencySymbol + ' ' + orderItem.pendingAmount,
                            transferAmount: orderItem.currencySymbol + ' ' + orderItem.transferAmount
                        }
                    })
                });
            });

        compState.dataList = dataList;
        setCompState({ ...compState });
    }

    return (
        <>

            <Card
            bodyStyle={{ height: '160px', minHeight: '150px', overflow: 'auto' }}
            className="custom-card payment-content select-payment" 
            title={L(LocalizationKeys.ERP_HdrSelectedPackageContents.key)}>

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