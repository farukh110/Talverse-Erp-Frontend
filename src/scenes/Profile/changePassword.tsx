import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import CustomForm, { FormModes } from '../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { ChangePasswordRequestDto } from '../../services/user/dto/createOrUpdateUserInput';
import SessionStore from '../../stores/sessionStore';
import chnagePasswordForm from './json/changePasswordForm.json';
import LocalizationKeys from '../../lib/localizationKeys';
import { CustomModal } from '../../components/CustomControls';
import { L } from '../../lib/abpUtility';


export interface IChangePassword {
    visible?: boolean;
    onCancel: any;
}

const ChangePassword = (props: IChangePassword) => {
    const { visible, onCancel } = props;
    const { userStore } = useAppStores();
    const [currentLoginInfo] = useAppState(SessionStore.AppStateKeys.CURRENT_LOGIN);
    const [formFields, setFormFields] = useCompState({});

    useEffect(() => {
        onLoad();
    }, [])

    const onLoad = () => {
        try {
            let field = chnagePasswordForm.formFields.find((item: any) => item.internalName == 'userName');
            if (field) {
                field.defaultValue = currentLoginInfo.user.name;
            }
            setFormFields({ ...chnagePasswordForm });
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const changePassword = async (values: any) => {
        try {
            let requestObj: ChangePasswordRequestDto = {
                currentPassword: values.password,
                newPassword: values.newPassword,
                userId: currentLoginInfo.user.id
            };
            await userStore.changePassword(requestObj);
            onCancel();
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    let modalOptions = {
        "visible": visible,
        "width": '40%',
        "title": L(LocalizationKeys.ERP_HdrChangePassword.key),
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"
    }


    return (
        <CustomModal {...modalOptions} className="order-modal-container">
            <div >
                <Card className='card-grid'>
                    <CustomForm onSubmit={changePassword} onChangeCallback={() => { }} onCancel={onCancel} formFields={formFields.formFields} formMode={FormModes.Add} ></CustomForm>
                </Card>
            </div>
        </CustomModal>
    )
}

export default ChangePassword;