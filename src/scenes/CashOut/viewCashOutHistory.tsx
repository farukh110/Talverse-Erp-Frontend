
import React, { useEffect, useRef } from 'react';

import { L } from '../../lib/abpUtility';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { CustomModal } from '../../components/CustomControls';
import { Form, FormInstance, message, Modal, Table } from 'antd';
// import { CreateSubmitTransferInput } from '../../../services/transfer/dto/transferDto';
import utils from '../../utils/utils';
import Loading from '../../components/Loading';
import LocalizationKeys from '../../lib/localizationKeys';
import CustomNumberInput from '../../components/CustomWebControls/CustomNumberTextbox/customNumberInput';
import CustomMultiLineTextBox from '../../components/CustomWebControls/CustomMultiLineTextbox';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
import './index.less';

export interface IViewCashOutProps {
    visible?: boolean;
    onCancel?: any;
    modalType?: string;
    onCreate?: any;
    transferPointId: Number;

}



const ViewCashOutHistory = (props: IViewCashOutProps) => {

    const { visible, onCancel ,transferPointId} = props;


    let modalOptions = {
        "visible": visible,
        "width": '50%',
        "height": '400px',
        "title": L(LocalizationKeys.ERP_HdrCashOutHistory.key), 
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"

    }


    const columns = [
        { title: L(LocalizationKeys.ERP_LblCurrencyCode.key), dataIndex: 'currencyCode', sorter: true, key: 'currencyCode', width: 50, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblAmount.key), dataIndex: 'amount', sorter: true, key: 'amount', width: 50, render: (text: string) => <div>{text}</div> },
        { title: L(LocalizationKeys.ERP_LblComments.key), dataIndex: 'comments', sorter: true, key: 'comments', width: 350, render: (text: string) => <div>{text}</div> },
       
    ];


    let params = [
        {
            key: "SelectFields",
            value: "Id,CurrencyCode, Amount,Comments  "
        },
        {
          key: "QueryFilters",
          value: {
            fieldName:"TransferPointId",
            operator:"=",
            value:transferPointId
          }
        }
    ];

    return (
        <>


            <CustomModal className="custom-crud" bodyStyle={{ overflow: 'auto' }} {...modalOptions}>

                <CustomCRUDComponent tableName='cashOutHistory'
                    parameters={params}
                    enableDownloadCsv={false} 
                    enableSearch={false} 
                    isNewRecordDisable={true}
                    tableColumns={columns}
                    actionsList={[]}
                    overrideActions={true}
                    hideHeading={true}
                
                />

            </CustomModal>


        </>
    )
}

export default ViewCashOutHistory;