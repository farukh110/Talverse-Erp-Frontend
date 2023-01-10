import React, { useEffect, useRef } from 'react';
import { Table, Form, Modal } from 'antd';
import LocalizationKeys from '../../../../lib/localizationKeys';
import { L } from '../../../../lib/abpUtility';
import { useAppStores } from '../../../../hooks/appStoreHooks';
import { Label } from 'recharts';

const confirm = Modal.confirm;
const ClearCache = (props: any) => {



    const { visible, onCancel, onOk, type } = props;
    const { sessionStore } = useAppStores();

    const handleOk = async () => {
        if (type == 'PermissionCache') {
            await sessionStore.resetPermissionCache();
        }
        else if (type == 'AllCache') {
            await sessionStore.resetAllCache();
        }

    };


    const confirmWork = () => {
        confirm({
            title: L(LocalizationKeys.ERP_MsgConfirmOperation.key),
            onOk() {
                handleOk();
                onOk();
            },
            onCancel() {
                if (onCancel && typeof (onCancel) == 'function')
                    onCancel();
                console.log('Cancel');
            },
        });

    }

    useEffect(() => {
        if (visible)
            confirmWork();
    }, [visible]);


    return (
        <></>
    )
}

export default ClearCache;