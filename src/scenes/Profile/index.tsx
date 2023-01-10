import React, { useEffect, useRef } from 'react';
import { Button, Card, Col, Image, Input, Modal, Row, Tag } from 'antd';

import { EntityDto } from '../../services/dto/entityDto';
import { isGranted, L } from '../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import { CustomButton, CustomCol, CustomRow } from '../../components/CustomControls';
import AppConsts from '../../lib/appconst';
import CustomCRUDComponent from '../../components/CustomCRUDComponent';
import CustomForm, { FormModes } from '../../components/CustomForm';
import EditProfileDetails from './editProfileDetails';
import { useAppStores, useCompState } from '../../hooks/appStoreHooks';
import ChangePassword from './changePassword';
import profileForm from './json/profileForm.json';
import './index.less';
import LocalizationKeys from '../../lib/localizationKeys';

const Profile = (props: any) => {

    const [editProfileVisible, setEditProfileVisible] = useCompState(false);
    const [changePasswordVisible, setchangePasswordVisible] = useCompState(false);
    const { supportersStore } = useAppStores();
    const [formFields, setFormFields] = useCompState({});
    const [supporterProfile, setsupporterProfile] = useCompState({});

    useEffect(() => {
        getSupporterProfile();
    }, []);


    const getSupporterProfile = async () => {
        try {
            let resp = await supportersStore.getSupporterProfile();
            setsupporterProfile({ ...resp });
            Object.keys(resp).forEach(function (key) {
                let field = profileForm.formFields.find((item: any) => item.internalName == key);
                if (field) {
                    field.defaultValue = field.internalName == 'country' ? resp[key]?.name : resp[key];
                }
            });
            setFormFields({ ...profileForm });
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    return (
        <div className='profile-container'>
            <Card className='card-grid'>

                <CustomRow>

                    <CustomCol span={12}>

                        <Card className='profile-form'>

                            <CustomForm
                                onSubmit={() => { }}
                                onChangeCallback={() => { }}
                                onCancel={() => { }}
                                formFields={formFields.formFields}
                                formMode={FormModes.Display}
                                hideCancelButton>
                            </CustomForm>

                            <CustomButton
                                appearance={CustomButton.appearances.EditProfile}
                                onClick={() => { setEditProfileVisible(true); }}>

                                {L(LocalizationKeys.ERP_BtnUpdateProfile.key)}

                            </CustomButton>

                            <CustomButton
                                appearance={CustomButton.appearances.ChangePass}
                                onClick={() => { setchangePasswordVisible(true); }}>
                                
                                {L(LocalizationKeys.ERP_BtnChangePassword.key)}

                            </CustomButton>

                        </Card>

                    </CustomCol>

                    <CustomCol span={12}>

                    </CustomCol>

                </CustomRow>

            </Card>

            <EditProfileDetails
                formFields={formFields}
                supporterProfile={supporterProfile}
                visible={editProfileVisible}
                onCancel={() => { setEditProfileVisible(false); getSupporterProfile(); }} />

            <ChangePassword
                visible={changePasswordVisible}
                onCancel={() => { setchangePasswordVisible(false); }} />

        </div>
    )
}

export default Profile;