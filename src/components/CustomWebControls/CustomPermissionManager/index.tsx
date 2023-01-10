import React, { forwardRef, useEffect } from 'react';
import { CustomTable } from '../../CustomGrid';
import { CustomAutoComplete } from '../CustomAutoComplete';
import { useAppState, useCompState } from '../../../hooks/appStoreHooks';
import FormElement from '../../CustomForm/components/FormElement';
import { CustomButton } from '../../CustomControls';
// import './index.less';
import { Card, Form, Modal } from 'antd';
import { L } from '../../../lib/abpUtility';
import LocalizationKeys from '../../../lib/localizationKeys';
// import { CustomeMultipleSelectAutoComplete } from '../CustomAutoComplete/CustomeMultipleSelectAutoComplete';
import formUtils from '../../../utils/formUtils';
import AppConsts from '../../../lib/appconst';

export interface ICustomItemSelectorOption {

    name: any,
    dataSource: boolean,
    dataTextField: string,
    dataValueField: string,
    parameters: any[],
    placeholder: string,
    heading: string
}

export interface ICustomPermissionManagerProps {

    onSelectItem: (value:any) => any
    onRemoved: (value:any) => any,
    userSelectedItems: [],
    rolesSelectedItems: [],
    permissionSelectedItems: [],
    userSelectorMode?: string,
    rolesSelectorMode?: string,
    permissionsSelectorMode?: string,

}

const CustomPermissionManager = forwardRef((props: ICustomPermissionManagerProps, ref: any) => {

    const [formRef] = Form.useForm();
    const { permissionsSelectorMode, rolesSelectorMode, userSelectorMode, userSelectedItems, rolesSelectedItems, permissionSelectedItems, onSelectItem,onRemoved } = props;



    // #region  Selector 1 , props , functions , states
    // selected items state 


    // currently all three pointinf to it , might add condition when needed 
    const onSelect = (value: any) => {
        if (value) {
            if (onSelectItem && typeof (onSelectItem) == 'function') {
                onSelectItem(value);
            }
        }
    }

    const onRemove = (value: any) => {
        try {
            if (value) {
                if (onRemoved && typeof (onRemoved) == 'function') {
                    onRemoved(value);
                }
            }
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    

    let usersOptionSelector = {
        "name": "ctrlUsers",
        "dataSource": "GetAllUsers",
        "dataTextField": "name",
        "dataValueField": "id",
        "parameters": [
            // {
            //   key: "CampaignId",
            //   value: campaignId
            // }
        ],
        "placeholder": "Please select users",
        "heading": "Supporter"
    }

    let roleOptionSelector = {
        "name": "ctrlRoles",
        "dataSource": "GetAllRoles",
        "dataTextField": "displayName",
        "dataValueField": "id",
        "parameters": [
            // {
            //   key: "CampaignId",
            //   value: campaignId
            // }
        ],
        "placeholder": "Please select Roles",
        "heading": "Supporter"
    }

    let permissionOptionSelector = {
        "name": "ctrlCampaignPermission",
        "dataSource": "GetAllPermissions",
        "dataTextField": "name",
        "dataValueField": "name",
        "parameters": [
            // {
            //   key: "CampaignId",
            //   value: campaignId
            // }
        ],
        "placeholder": "Please select Campaign",
        "heading": "Supporter"
    }




    

    return (
        <Form ref={ref} form={formRef} layout="vertical" className="custom-form">
            <div className="custom-item-form">

                <br></br>

                {userSelectorMode && <CustomAutoComplete
                    {...usersOptionSelector}
                    onSelectItem={(value: any) => onSelect(value)}
                    onRemove={onRemove}
                    selectedItems={userSelectedItems} formRef={formRef}
                    idField={1} disabled={formUtils.getDisabledStatus(userSelectorMode)}
                    selectedValues={userSelectedItems}
                    selectorMode={AppConsts.selectorModes.MULTIPLE}
                    componentName='ctrlCustomUserSelectorDropdown'
                    selectText={'Users'}
                />}

                <br></br>
                {rolesSelectorMode && <CustomAutoComplete
                    {...roleOptionSelector}
                    onSelectItem={(value: any) => onSelect(value)}
                    onRemove={onRemove}
                    selectedItems={rolesSelectedItems} formRef={formRef}
                    idField={2} disabled={formUtils.getDisabledStatus(rolesSelectorMode)}
                    selectedValues={rolesSelectedItems}
                    selectorMode={AppConsts.selectorModes.MULTIPLE}
                    componentName='ctrlCustomRolesSelectorDropdown'
                    selectText={'Roles'}
                />}


                <br></br>
                {permissionsSelectorMode && <CustomAutoComplete
                    {...permissionOptionSelector}
                    onSelectItem={(value: any) => onSelect(value)}
                    onRemove={onRemove}
                    selectedItems={permissionSelectedItems} formRef={formRef}
                    idField={3} disabled={formUtils.getDisabledStatus(permissionsSelectorMode)}
                    selectedValues={permissionSelectedItems}
                    selectorMode={AppConsts.selectorModes.MULTIPLE}
                    componentName='ctrlCustomPermissionSelectorDropdown'
                    selectText={'Permissions'}

                />}


             
            </div>
        </Form>
    )
})

export default CustomPermissionManager;
