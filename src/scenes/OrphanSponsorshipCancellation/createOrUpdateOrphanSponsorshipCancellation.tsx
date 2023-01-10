import { FormInstance, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { CustomModal } from '../../components/CustomControls';
import CustomForm, { FormModes } from '../../components/CustomForm';
import { L } from '../../lib/abpUtility';
import LocalizationKeys from '../../lib/localizationKeys';


export interface ICreateOrUpdateTransferProps {
    visible?: boolean;
    onCancel: any;
    modalType?: string;
    onCreate: any;
    dataFields: [];
}
const CreateOrUpdateOrphanSponsorshipCancellation = (props: ICreateOrUpdateTransferProps) => {

    const { visible, onCancel, dataFields, onCreate } = props;
 
    let modalOptions = {
        "visible": visible,
        "width": '30%',
        "height": '500px',
        "title": L(LocalizationKeys.ERP_HdrRecordSponsorShipCancellationRequest.key),
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"

    }

    const callBack = () => {

    }

    return (<CustomModal className="custom-modal" {...modalOptions}>

        <CustomForm formMode={FormModes.Add} formFields={dataFields} onSubmit={onCreate} onCancel={onCancel} onChangeCallback={callBack} />

    </CustomModal>
    )
}

export default CreateOrUpdateOrphanSponsorshipCancellation;