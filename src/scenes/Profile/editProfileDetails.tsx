import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';

import {  CustomModal } from '../../components/CustomControls';
import CustomForm, { FormModes } from '../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';
import { L } from '../../lib/abpUtility';
import { UpdateSupporterProfileRequestDto } from '../../services/user/dto/createOrUpdateUserInput';
import SessionStore from '../../stores/sessionStore';
import LocalizationKeys from '../../lib/localizationKeys';

export interface ICreateOrUpdateSupporterProfile {
    visible?: boolean;
    onCancel: any;
    supporterProfile: any;
    formFields: any;
  }


const EditProfileDetails = (props: ICreateOrUpdateSupporterProfile) => {

    const { visible, onCancel, supporterProfile, formFields } = props;
    const { supportersStore } = useAppStores();
    const [fieldsList, setFieldsList] = useCompState([]);
    const [currentLoginInfo] = useAppState(SessionStore.AppStateKeys.CURRENT_LOGIN);

    useEffect(() => {
        populateForm();
    }, [formFields]);

    const populateForm = () => {
        try {
            let countries = abp['countries'];
            let countryList: any = [];
            countries && countries.length > 0 && countries.map((item: any, index: any) => {
                countryList.push({ key: item.id, value: item.code + ' - ' + item.name });
            });

            let fields = formFields?.formFields.map((object: any) => ({ ...object }));
            let field = fields?.find((item: any) => item.internalName == 'country');
            if (field) {
                field.defaultValue = supporterProfile?.country?.id;
                field.dataItems = countryList;
            }
            setFieldsList(fields);
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }

    }


    const updateProfile = async (values: any) => {
        try {
            let requestObj: UpdateSupporterProfileRequestDto = {
                contactNumber: values.contactNumber,
                countryId: values.country,
                dateOfBirth: values.dateOfBirth,
                email: values.email,
                gender: values.gender,
                name: values.name,
                userId: currentLoginInfo.user.id,
            }
            await supportersStore.updateSupporterProfile(requestObj);
            onCancel();

        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    let modalOptions = {
        "visible": visible,
        "width": '35%',
        "title": L(LocalizationKeys.ERP_HdrUpdateProfile.key),
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"
    }

    return (
        <CustomModal {...modalOptions} className="order-modal-container">
            <div >
                <Card className='card-grid'>
                    <CustomForm onSubmit={updateProfile} onChangeCallback={() => { }} onCancel={onCancel} formFields={fieldsList} formMode={FormModes.Add} ></CustomForm>
                </Card>
            </div>
        </CustomModal>
    )
}

export default EditProfileDetails;