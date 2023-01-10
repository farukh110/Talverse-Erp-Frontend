import React, { useEffect } from 'react';

import { L } from '../../../lib/abpUtility';
import CustomForm, { FormModes } from '../../CustomForm';
import { CustomModal } from '../../CustomControls';
import { useCompState } from '../../../hooks/appStoreHooks';
import AppConsts from '../../../lib/appconst';

export interface IFormViewProps {
    visible?: boolean;
    onCancel?: any;
    modalType?: string;
    onCreate?: any;
    formFields: any[];
    formData: any;
    formMode: any;
    isCustomFormFields:boolean;
    modalWidth: any;
}

const FormView = (props: any) => {

    const { formFields, formData, formMode, popupHeading,isCustomFormFields, modalWidth } = props;

    const [compState, setCompState] = useCompState({ formFields: {} });
    const toggleFieldState = (fieldName: string, isVisible: boolean, isReadOnly: boolean) => {
        let field = formFields.formFields.find((formId: any) => {
            return formId.internalName == fieldName
        });
        if (field) {
            field.visible = isVisible;
            if (isReadOnly)
                field.mode = "ReadOnly";
        }

    }

    if (formFields && formFields.formFields && formFields.formFields.length > 0 && !isCustomFormFields) {
       

        switch (formMode) {
            case FormModes.Add:
                toggleFieldState(AppConsts.staticFields.ID, false, false);
                toggleFieldState(AppConsts.staticFields.CREATOR_USER_ID, true, true);
                toggleFieldState(AppConsts.staticFields.CREATION_TIME, true, true);
                toggleFieldState(AppConsts.staticFields.DELETER_USER_ID, false, false);
                toggleFieldState(AppConsts.staticFields.DELETION_TIME, false, false);
                toggleFieldState(AppConsts.staticFields.LAST_MODIFICATION_TIME, false, false);
                toggleFieldState(AppConsts.staticFields.LAST_MODIFIER_USER_ID, false, false);
                break;
            case FormModes.Edit:
                toggleFieldState(AppConsts.staticFields.ID, true, true);
                toggleFieldState(AppConsts.staticFields.CREATOR_USER_ID, false, false);
                toggleFieldState(AppConsts.staticFields.CREATION_TIME, false, false);
                toggleFieldState(AppConsts.staticFields.DELETER_USER_ID, false, false);
                toggleFieldState(AppConsts.staticFields.DELETION_TIME, false, false);
                toggleFieldState(AppConsts.staticFields.LAST_MODIFICATION_TIME, false, false);
                toggleFieldState(AppConsts.staticFields.LAST_MODIFIER_USER_ID, false, false);
                break;
            case FormModes.Display:
                toggleFieldState(AppConsts.staticFields.ID, true, true);
                break;
        }
    }

    useEffect(() => {

    }, [formData]);


    const { visible, onCreate, onCancel } = props;

    let modalOptions = {

        "visible": visible,
        "width": modalWidth ? modalWidth : '80%',
        "title": L(popupHeading.replace(/([a-z])([A-Z])/g, '$1 $2')),
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme: "danger"

    }

    return (<CustomModal {...modalOptions}>

        <CustomForm formMode={formMode} onSubmit={onCreate} onCancel={onCancel} {...formFields} postHiddenValues={true}></CustomForm>

    </CustomModal>
    )
}

export default FormView;