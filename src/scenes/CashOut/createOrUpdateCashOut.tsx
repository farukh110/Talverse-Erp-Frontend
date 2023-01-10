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
import { CashOutRequestDto } from '../../services/cashOut/dto/cashOutRequestDto';
import CustomMultlineInput from '../../components/CustomWebControls/CustomMultiLineTextbox/customMultlineInput';


export interface ICreateOrUpdateCashOutProps {
    visible?: boolean;
    onCancel?: any;
    modalType?: string;
    onCreate?: any;
    balanceAmount: any;
    transferPointId: any
}

const confirm = Modal.confirm;
const CreateOrUpdateCashOut = (props: ICreateOrUpdateCashOutProps) => {

    // const [alreadySelectedRows, setAlreadySelectedRows] = useCompState([]);
    const [formRef] = Form.useForm();
    const [loadingStatus, setLoadingStatus] = useCompState(false);
    const { visible, balanceAmount, onCancel, transferPointId } = props;
    const [compState, setCompState] = useCompState({});
    const { cashOutStore } = useAppStores();

    const namePrefix = 'selectedItem_';
    const nameSuffix = '_transferAmount';



    useEffect(() => {
        initializePendingTransferData();
    }, [balanceAmount])

    const initializePendingTransferData = () => {
        let balanceAmounts = balanceAmount ? JSON.parse(balanceAmount) : [];
        let dataList: any = [];
        let index = 0;
        if (balanceAmounts && balanceAmounts && balanceAmounts.length > 0)
            balanceAmounts.map((cashOutItem: any) => {
                const rowId = `rw-${cashOutItem.CurrencyId}`;
                index++;
                dataList.push({
                    key: rowId,
                    categoryName: `${cashOutItem.CurrencyCode} -  `,
                    amount: cashOutItem.CurrencyCode + ' ' + cashOutItem.Amount,
                    transferAmount: <CustomNumberInput label={""}
                        value={0}
                        name={`${namePrefix}${cashOutItem.CurrencyId}${nameSuffix}`}
                        max={cashOutItem.Amount}
                        formRef={formRef} />,
                    comment: <CustomMultlineInput
                        label=''
                        name={`${namePrefix}${cashOutItem.CurrencyId}_comment`}
                        value=''

                    />
                });
            });
        compState.dataList = dataList;
        setCompState({ ...compState });
    }

    const closeModal = () => {
        formRef.resetFields();
        if (onCancel && typeof (onCancel) == 'function')
            onCancel();
    }


    const saveCashOut = async () => {
        try {
            formRef.validateFields().then(async (values: any) => {
                let revisedList = createCashOutobj(values);
                let listToProcess = revisedList.filter((item: any) => item.Amount != 0);
                if (listToProcess && listToProcess.length > 0) {
                    // perform further call to backend here 
                    await submitCashOut(listToProcess);
                    if (onCancel && typeof (onCancel) == 'function')
                        onCancel();
                }
                else {
                    message.error(L(LocalizationKeys.ERP_MsgPleaseEnterAmountForAtLeastOneCashOut.key));
                }

            });

        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const OkayClicked = async () => {
        try {
            confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmOperation.key),
                onOk() {
                    saveCashOut();
                },
                onCancel() {
                    console.log('Cancel');
                },
            });

        } catch (ex) {
            console.log(`error: ${ex}`);
        }


    }



    const createCashOutobj = (formValues: any) => {
        try {
            let balanceAmounts = balanceAmount ? JSON.parse(balanceAmount) : [];
            let transferSelectedItemsList = balanceAmounts;
            for (let i = 0; i < transferSelectedItemsList.length; i++) {
                let keyAmount = `${namePrefix}${transferSelectedItemsList[i].CurrencyId}${nameSuffix}`;
                let keyComment = `${namePrefix}${transferSelectedItemsList[i].CurrencyId}_comment`;
                transferSelectedItemsList[i]['Amount'] = formValues[keyAmount];
                transferSelectedItemsList[i]['comments'] = formValues[keyComment];
                transferSelectedItemsList[i]['transferPointId'] = transferPointId;

            }
            return transferSelectedItemsList;
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    let modalOptions = {
        "visible": visible,
        "width": '60%',
        "height": '400px',
        "title": L(LocalizationKeys.ERP_HdrCashOut.key),
        "destroyOnClose": true,
        "onCancel": closeModal,
        //"footer": null,
        "okText": L(LocalizationKeys.ERP_LblSave.key),
        "onOk": OkayClicked,
        theme: "danger"

    }

    const submitCashOut = async (cashOutList: CashOutRequestDto) => {
        try {
            return await cashOutStore.submitCashOut(cashOutList); //is it fine here or should we do it back in index.tsx AKA CashOut 
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }

    }

    const columns = [
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: '20%',
            key: 'amount',
        },
        {
            title: 'Transfer Amount',
            dataIndex: 'transferAmount',
            width: '30%',
            key: 'transferAmount',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            width: '50%',
            key: 'comment',
        },
    ];







    return (<CustomModal className="participants-modal" bodyStyle={{ overflow: 'auto' }} {...modalOptions}>
        <Loading spinning={loadingStatus}>

            <Form form={formRef} layout="vertical" className="custom-form">

                <Table
                    columns={columns} rowKey="key"
                    bordered
                    dataSource={compState.dataList}
                    pagination={false}
                    size="small"
                />

            </Form>


        </Loading>
    </CustomModal>
    )

}

export default CreateOrUpdateCashOut;