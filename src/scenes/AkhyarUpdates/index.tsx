import React, { useEffect, useRef } from 'react';
import { Card, FormInstance, Modal, } from 'antd';
import { CustomButton, CustomCol, CustomRow } from '../../components/CustomControls';
import CustomForm, { FormModes } from '../../components/CustomForm';
import { useAppStores, useCompState } from '../../hooks/appStoreHooks';
import akhyarUpdatesFormFields from './json/akhyarUpdatesFormFields.json'
// import './index.less';
import LocalizationKeys from '../../lib/localizationKeys';
import utils from '../../utils/utils';
import AppConsts from '../../lib/appconst';
import moment from 'moment';
import { PushCustomAppUpdateRequestDto } from '../../services/notifications/dto/notificationsRequestRespDto';
import { L } from '../../lib/abpUtility';
import { InfoCircleOutlined } from '@ant-design/icons';

const confirm = Modal.confirm;
const AkhyarUpdates = (props: any) => {

    const { notificationStore } = useAppStores();
    const [formFields, setFormFields] = useCompState({});
    const formRef = useRef<FormInstance>();
    const [isCampaign, setIsCampaign] = useCompState(true);
    const [isSaveButtonDisabled, setSaveButtonDisabled] = useCompState(true);

    useEffect(() => {
        onLoad();
    }, []);


    const onLoad = () => {
        let form: any = {
            formFields: []
        };
        form.formFields = akhyarUpdatesFormFields.formFields.map((object: any) => ({ ...object }));
        let campaignField = form.formFields.find((field: any) => field.componentName === 'campaignId');
        if (campaignField) {
            let queryFilter = campaignField.parameters!.find((item: any) => item.key == 'QueryFilters');
            if (queryFilter) {
                queryFilter.value['filters'].push({
                    "fieldName": "StartDate",
                    "operator": "<=",
                    "value": utils.getStartOfDate(moment.utc(new Date()), AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
                });
                queryFilter.value['filters'].push({
                    "fieldName": "EndDate",
                    "operator": ">=",
                    "value": utils.getEndOfDate(moment.utc(new Date()), AppConsts.DateUnits.DAY, 'YYYY-MM-DD HH:mm:ss')
                });
            }
        }


        // let translationsField = form.formFields.find((field: any) => field.internalName === 'translations');
        // if (translationsField) {
        //     let titleFields = translationsField.fields.filter((field: any) => field.internalName === 'title');

        //     if (titleFields) {
        //         titleFields.forEach((element: any) => {
        //             element.visible = true;
        //             element.validations = [
        //                 {
        //                     "name": "RequiredFieldValidation",
        //                     "options": [
        //                         {
        //                             "key": "isRequired",
        //                             "value": true,
        //                             "validationMessage": "ERP_Error_FieldPleaseEnterTitle"
        //                         }
        //                     ]
        //                 }
        //             ];

        //         });
        //     }
        // }

        setFormFields({ ...form });
    }


    const createNotification = (values: any) => {
        try {
            let notificationReqObj: PushCustomAppUpdateRequestDto = {
                appUpdateTypeId: values.appUpdateTypeId,
                sendNotificationNow: values.sendNotificationNow,
                translations: values.translations,
                landingType: values.landingType ? values.landingType : "",
                saveAppUpdate: values.saveAppUpdate,
                notificationRecipients: values.notificationRecipients
            }
            if (values.isCampaignSpecificNotification)
                notificationReqObj.campaignId = values.campaignId

            confirm({
                title: L(LocalizationKeys.ERP_MsgConfirmOperation.key),
                async onOk() {
                    let res = await notificationStore.sendCustomAppUpdate(notificationReqObj);
                    if (res && res.success)
                        resetForm();
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const onChangeCallback = (value: any) => {

        if (value && value.fieldId && value.fieldId == 'isCampaignSpecificNotification') {
            // when is campaign specific notification clicked 
            let campaignField = formFields.formFields.find((field: any) => field.componentName === 'campaignId');
            if (campaignField)
                campaignField.visible = value.state;

            let receipientsField = formFields.formFields.find((field: any) => field.componentName === 'notificationRecipients');

            if (receipientsField) {
                receipientsField.visible = !value.state;
            }

            let translationsField = formFields.formFields.find((field: any) => field.internalName === 'translations');
            if (translationsField) {
                let titleFields = translationsField.fields.filter((field: any) => field.internalName === 'title');
                if (titleFields) {
                    titleFields.forEach((element: any) => {
                        
                        element.visible = !value.state;
                        if (value.state)
                            element.validations = [];
                        else {
                            element.validations = [
                                {
                                    "name": "RequiredFieldValidation",
                                    "options": [
                                        {
                                            "key": "isRequired",
                                            "value": true,
                                            "validationMessage": "ERP_Error_FieldPleaseEnterTitle"
                                        }
                                    ]
                                }
                            ];

                        }
                    });
                }

            }
            setFormFields({ ...formFields });
            setIsCampaign(value.state);
        }


        let submitValue = formRef.current?.getFieldsValue(['saveAppUpdate', 'sendNotificationNow']);
        
        if (submitValue.saveAppUpdate || submitValue.sendNotificationNow) {
            //set state to true 
            setSaveButtonDisabled(false);
        }
        else {
            // set state to false
            setSaveButtonDisabled(true);
        }

    }

    const resetForm = () => {
        try {
            formRef.current!.resetFields();
            // show sucess message here 
            onLoad();

        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    return (
        <div className='profile-container'>
            <Card className='card-grid'>
                <CustomRow>
                    <CustomCol span={12}>
                        <CustomForm
                            onSubmit={createNotification}
                            onChangeCallback={onChangeCallback}
                            onCancel={() => { }}
                            formFields={formFields.formFields}
                            formMode={FormModes.Add}
                            hideCancelButton
                            ref={formRef}
                            disabledSaveButton={isSaveButtonDisabled}
                            saveButtontext={L(LocalizationKeys.ERP_BtnSend.key)}
                            saveButtonAppearance={CustomButton.appearances.Send}
                        >
                        </CustomForm>
                    </CustomCol>
                    <CustomCol span={12}>
                    </CustomCol>
                </CustomRow>
                {isCampaign && <p> <InfoCircleOutlined /> {L(LocalizationKeys.ERP_MsgAkhyarAppUpdateCampaignNote.key)}</p>}

                {!isCampaign && <p><InfoCircleOutlined /> {L(LocalizationKeys.ERP_MsgAkhyarAppUpdateNonCampaignNote.key)}</p>}
            </Card>

        </div>
    )
}

export default AkhyarUpdates;