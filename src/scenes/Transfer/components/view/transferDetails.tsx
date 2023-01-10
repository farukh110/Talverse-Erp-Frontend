import { Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CustomCol, CustomRow } from '../../../../components/CustomControls';
import CustomSubForm from '../../../../components/CustomForm/components/CustomSubForm';
import CustomHeading from '../../../../components/CustomWebControls/CustomHeading';
import CustomLabelText from '../../../../components/CustomWebControls/CustomLabel/customLabelText';
import { useCompState } from '../../../../hooks/appStoreHooks';
import { L } from '../../../../lib/abpUtility';
import AppConsts from '../../../../lib/appconst';
import LocalizationKeys from '../../../../lib/localizationKeys';
import TransferStore from '../../../../stores/transferStore';
import utils from '../../../../utils/utils';



export interface ITransferDetailsProps {
    visible?: boolean;
    data: any;
}
const TransferDetails = (props: ITransferDetailsProps) => {

    const { data } = props;
    const [compState, setCompState] = useCompState({ formfields: [] });
    useEffect(() => {
        assignValuesToFields();
    }, [data]);

    const assignValuesToFields = () => {
        if (data.dynamicFormValues && data.dynamicFormFields && data.dynamicFormValues.length > 0 && data.dynamicFormFields.length > 0) {
            for (let i = 0; i < data.dynamicFormValues.length; i++) {
                let field = data.dynamicFormFields.find((item: any) => item.internalName == data.dynamicFormValues[i].key);
                if (field) {
                    field.defaultValue = field.type == 'DatePicker' ? utils.formattedDate(data.dynamicFormValues[i].value) : data.dynamicFormValues[i].value;
                    field.type = 'Label';
                    field.size = AppConsts.formConstants.columnSize.SMALL;
                }
            }
            data.dynamicFormFields = data.dynamicFormFields.filter((item: any) => item.defaultValue != undefined);
            compState.formfields = data.dynamicFormFields;
            setCompState({ ...compState });
        }
    }


    return (
        <>

            <Card className="custom-card payment-content" title={L(LocalizationKeys.ERP_HdrTransferDetails.key)}>

                <CustomRow gutter={[16, 16]}>
                    <CustomCol className="transfer-details-col" span={18}>
                        <CustomSubForm subFormFields={compState.formfields} hideHeading={true} />
                    </CustomCol>

                    {data.supportingDocument && data.supportingDocument.length > 0 && data.supportingDocument.map((item: any, index: any) => {
                        return <CustomCol className="transfer-details-col" key={index} span={6}>
                            <h4>Supporting Documents</h4>
                            <div ><a target="_blank" href={`${AppConsts.remoteServiceBaseUrl}/Document/View?key=${item.documentKey}&${AppConsts.authorization.sourceAppKey}=${AppConsts.erpApps.ERPPortal.accessKey}`}>{item.documentName}</a></div>
                        </CustomCol>
                    })}

                </CustomRow>

            </Card>

        </>
    )


}
export default TransferDetails;