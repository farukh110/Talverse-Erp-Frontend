import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { CustomCol, CustomRow } from '../../../../../components/CustomControls';
import CustomDropdownInput from '../../../../../components/CustomWebControls/CustomDropdown/customDropdownInput';
import CustomLabelText from '../../../../../components/CustomWebControls/CustomLabel/customLabelText';
import CustomNumberInput from '../../../../../components/CustomWebControls/CustomNumberTextbox/customNumberInput';
import { useCompState } from '../../../../../hooks/appStoreHooks';
import { L } from '../../../../../lib/abpUtility';
import './index.less';

const CustomDataRepeater = (props: any) => {

    const { currencyList, validations, lockRow, removeRow, removeIcon, dataRow, formRef, revertExchange, viewMode, isPartialTransferAllowed } = props;
    const namePrefix = "arr_exchangeDetails_" + dataRow.id;
    const [dataItemRow, setdataItemRow] = useCompState(dataRow);

    const toCurrencyList = currencyList.map((object: any) => ({ ...object }));
    let indexToRemove = toCurrencyList.findIndex((item: any) => item.key == dataRow.fromCurrency);
    toCurrencyList.splice(indexToRemove, 1);


    const returnObject = () => {
        let returnObj = {
            fromCurrency: formRef?.getFieldValue(`${namePrefix}_fromCurrency`),
            fromAmount: formRef?.getFieldValue(`${namePrefix}_fromAmount`),
            toCurrency: formRef?.getFieldValue(`${namePrefix}_toCurrency`),
            toAmount: formRef?.getFieldValue(`${namePrefix}_toAmount`),
            exchangeRate: formRef?.getFieldValue(`${namePrefix}_exchangeRate`),
            id: dataRow.id,
            index: dataRow.index
        }
        return returnObj;
    }

    const onLockClick = () => {
        formRef!.validateFields([`${namePrefix}_fromCurrency`, `${namePrefix}_fromAmount`, `${namePrefix}_toCurrency`, `${namePrefix}_toAmount`, `${namePrefix}_exchangeRate`]).then(() => {
            // CREATE TRANSLATIONS OBJECT HERE  
            dataItemRow.isEditable = false;
            dataItemRow.isFinalized = true;
            setdataItemRow({ ...dataItemRow });
            if (lockRow && typeof (lockRow) == 'function') {
                lockRow(returnObject());
            }
        });
    }

    const revertExchangedItem = () => {
        if (revertExchange && typeof (revertExchange) == 'function') {
            revertExchange(returnObject());
            removeFormFields();
        }
    }

    const removeItem = () => {
        if (removeRow && typeof (removeRow) == 'function') {
            removeRow(returnObject());
            removeFormFields();

        }
    }

    const removeFormFields = () => {
        let values = formRef.getFieldsValue(true);
        delete values[`${namePrefix}_fromCurrency`];
        delete values[`${namePrefix}_fromAmount`];
        delete values[`${namePrefix}_toCurrency`];
        delete values[`${namePrefix}_toAmount`];
        delete values[`${namePrefix}_exchangeRate`];
        formRef.setFieldsValue(values);
    }

    const formula = {
        fromAmount: ` [${namePrefix}_toAmount] =  [${namePrefix}_fromAmount] * [${namePrefix}_exchangeRate] `,
        toAmount: ` [${namePrefix}_exchangeRate] =   [${namePrefix}_toAmount] / [${namePrefix}_fromAmount] `,
        rate: ` [${namePrefix}_toAmount] =  [${namePrefix}_fromAmount] * [${namePrefix}_exchangeRate] `
    };


    return (
        <>
            {!viewMode && <CustomRow gutter={[16, 16]} className="data-body">

                <CustomCol span={4}>

                    <CustomDropdownInput
                        label={""}
                        dataItems={currencyList}
                        name={`${namePrefix}_fromCurrency`}
                        rules={validations.fromCurrency} disable={true} value={dataRow.fromCurrency} formRef={formRef} />

                </CustomCol>

                <CustomCol span={5}>

                    <CustomNumberInput
                        label={""}
                        name={`${namePrefix}_fromAmount`}
                        rules={validations.firstAmount} value={formRef?.getFieldValue(`${namePrefix}_fromAmount`) ? formRef?.getFieldValue(`${namePrefix}_fromAmount`) : dataRow.amount} max={dataRow.maxAmount}
                        dynamicFormula={formula.fromAmount} formRef={formRef} disable={!dataItemRow.isEditable || !isPartialTransferAllowed} />

                </CustomCol>

                <CustomCol span={4}>

                    <CustomDropdownInput
                        label={""}
                        dataItems={toCurrencyList}
                        name={`${namePrefix}_toCurrency`}
                        rules={validations.toCurrency} disable={!dataItemRow.isEditable} formRef={formRef}
                        value={formRef?.getFieldValue(`${namePrefix}_toCurrency`) ? formRef?.getFieldValue(`${namePrefix}_toCurrency`) : dataRow.toCurrency} />

                </CustomCol>

                <CustomCol span={5}>

                    <CustomNumberInput
                        label={""}
                        name={`${namePrefix}_toAmount`}
                        rules={validations.secondAmount}
                        dynamicFormula={formula.toAmount} formRef={formRef} disable={!dataItemRow.isEditable}
                        value={formRef?.getFieldValue(`${namePrefix}_toAmount`) ? formRef?.getFieldValue(`${namePrefix}_toAmount`) : dataRow.toAmount} />

                </CustomCol>

                <CustomCol span={3}>

                    <CustomNumberInput
                        label={""}
                        name={`${namePrefix}_exchangeRate`}
                        rules={validations.rate}
                        dynamicFormula={formula.rate} formRef={formRef} disable={!dataItemRow.isEditable}
                        value={formRef?.getFieldValue(`${namePrefix}_exchangeRate`) ? formRef?.getFieldValue(`${namePrefix}_exchangeRate`) : dataRow.exchangeRate} />

                </CustomCol>


                <CustomCol span={3}>

                    <div className="data-icons-row">

                        {!dataItemRow.isEditable && !viewMode ? <CloseCircleOutlined onClick={revertExchangedItem} className="iconSize" /> : null}
                        {dataItemRow.isEditable && !viewMode ? <CheckCircleOutlined onClick={onLockClick} className="iconSize" /> : null}
                        {removeIcon && dataItemRow.isEditable && !viewMode ? <MinusCircleOutlined onClick={removeItem} className="iconSize" /> : null}

                    </div>

                </CustomCol>

            </CustomRow>}


            {viewMode && <CustomRow gutter={[16, 16]} className="data-body">

                <CustomCol span={5}>

                    <CustomLabelText
                        visible={true}
                        internalName={`${namePrefix}_fromCurrency`}
                        value={currencyList?.find((item: any) => item.key == dataRow.fromCurrency)?.value} />

                </CustomCol>

                <CustomCol span={5}>
                    <div className=""></div>

                    <CustomLabelText
                        visible={true}
                        internalName={`${namePrefix}_fromAmount`}
                        value={dataRow.fromCurrency + ' ' + dataRow.fromAmount} />


                </CustomCol>

                <CustomCol span={6}>

                    <CustomLabelText
                        visible={true}
                        internalName={`${namePrefix}_toCurrency`}
                        value={currencyList?.find((item: any) => item.key == dataRow.toCurrency)?.value} />

                </CustomCol>

                <CustomCol span={5}>

                    <CustomLabelText
                        visible={true}
                        internalName={`${namePrefix}_toAmount`}
                        value={dataRow.toCurrency + ' ' + dataRow.toAmount} />

                </CustomCol>

                <CustomCol span={3}>

                    <CustomLabelText
                        visible={true}
                        internalName={`${namePrefix}_exchangeRate`}
                        value={dataRow.exchangeRate} />

                </CustomCol>

            </CustomRow>}
        </>
    )
}

export default CustomDataRepeater;
