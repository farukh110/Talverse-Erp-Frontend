import React, { useEffect } from 'react';
import { CustomButton, CustomCol, CustomRow } from '../../../../components/CustomControls';
import { Upload, Form, Card, Badge } from 'antd';
import { L } from '../../../../lib/abpUtility';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import CustomDropdownInput from '../../../../components/CustomWebControls/CustomDropdown/customDropdownInput';
import CustomTextInput from '../../../../components/CustomWebControls/CustomTextbox/customTextInput';
import CustomDatepickerInput from '../../../../components/CustomWebControls/CustomDatePicker/customDatepickerInput';
import CustomMultlineInput from '../../../../components/CustomWebControls/CustomMultiLineTextbox/customMultlineInput';
import CustomRadioButtonInput from '../../../../components/CustomWebControls/CustomRadioButton/CustomRadioButtonInput';
import { useAppState, useAppStores, useCompState } from '../../../../hooks/appStoreHooks';
import { ContentRequestDto } from '../../../../services/Content/dto/contentRequestDto';
import AppConsts from '../../../../lib/appconst';
import CustomSubForm from '../../../../components/CustomForm/components/CustomSubForm/index';
import TransferStore from '../../../../stores/transferStore';
import PointToPointTransferSore from '../../../../stores/pointToPointTransferSore';
import LocalizationKeys from '../../../../lib/localizationKeys';


export interface ISupporterState {
    destinationList: [],
    destinationSelctedValue: string;
    dynamicForm: any[];
    showUploadComp: boolean;
    uploadCompValidation: [];
}


const Dispatch = (props: any) => {

    const { supportersStore, contentStore } = useAppStores();
    const { validations, transferPoints, packageId, formRef } = props;

    const [fileListState, setFileListState] = useAppState(PointToPointTransferSore.AppStateKeys.FILE_LIST, { fileList: [] });
    const [subFormFields, setSubFormFields] = useAppState(PointToPointTransferSore.AppStateKeys.TRANSFER_DISPATCH_DYNAMIC_DETAILS, []);

    const initialState: ISupporterState = {
        destinationList: [],
        destinationSelctedValue: '',
        dynamicForm: [],
        showUploadComp: false,
        uploadCompValidation: []
    };


    const [compState, setCompState] = useCompState(initialState);

    const onLoad = () => {
        getDestinationList();
    }
    useEffect(onLoad, []);


    const handleChange = (value: any) => {

        // loading related dynamic form on change of destination Value
        if (transferPoints && transferPoints.length > 0) {
            let selectedTranferPoint = transferPoints.find((item: any) => item.id == value.key);
            if (selectedTranferPoint) {
                let dynamicForm = selectedTranferPoint.transferPointType?.metadataFields;
                updateStatesOnDestinationChange(dynamicForm);
            }
        }
        else if (transferPoints && transferPoints.length == undefined) {
            let selectedTranferPoint = transferPoints.destinationList.find((item: any) => item.id == value.key);
            if (selectedTranferPoint) {
                let dynamicForm = selectedTranferPoint?.metadataFields;
                updateStatesOnDestinationChange(dynamicForm);
            }
        }

    }
    const onChangeCheckobox = (obj: any) => {
        let fields = subFormFields;
        // chnaging show / hide for dependent fields
        let fieldsToHideOrShow = fields.filter((field: any) => field.internalName == "PersonContact" || field.internalName == "PersonName");
        if (fieldsToHideOrShow && fieldsToHideOrShow.length > 0) {
            for (let i = 0; i < fieldsToHideOrShow.length; i++) {
                fieldsToHideOrShow[i].visible = obj.state;
            }
            setSubFormFields([...fields]);
        }
    }

    const getDestinationList = async () => {
        compState.destinationSelctedValue = formRef?.getFieldValue(PointToPointTransferSore.AppStateKeys.originOrDestination.SELECT_DESTINATION);
        if (transferPoints && transferPoints.length > 0) {
            setNewTransferForm();
        }
        else if (transferPoints && transferPoints.length == undefined) {
            setEditTransferForm();
        }
    }

    const beforeUploadFile = (file: any) => {
        // Appending new file to exisiting file array
        fileListState.fileList = [...fileListState.fileList, file];
        setFileListState({ ...fileListState });
        return false;
    }
    const onRemoveFile = (file: any) => {
        // removing file from upload control
        const index = fileListState.fileList.indexOf(file);
        const newFileList = fileListState.fileList.slice();
        newFileList.splice(index, 1);
        fileListState.fileList = newFileList;
        setFileListState({ ...fileListState });
    }


    //#region Dispatch transfer Setup Functions 
    const populateDestinationList = (source: any, destinationList: any) => {
        try {
            source.map((item: any, index: any) => {
                destinationList.push({ key: item.id, value: item.name });
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const setNewTransferForm = () => {
        try {
            let destinationList: any = [];
            let selectedTranferPoint = transferPoints.find((item: any) => item.id == compState.destinationSelctedValue);
            if (!subFormFields || subFormFields.length == 0) {
                if (selectedTranferPoint) {
                    let dynamicForm = selectedTranferPoint.transferPointType?.metadataFields;
                    // setting size and visibilty of some fields 
                    setFieldsSizeAndVisibility(dynamicForm);
                    setSubFormFields([...dynamicForm]);
                }
            }
            // populating data items for Destination dropDown
            populateDestinationList(transferPoints, destinationList);
            compState.destinationList = destinationList.filter((item: any) => item.key != formRef.getFieldValue(PointToPointTransferSore.AppStateKeys.originOrDestination.SELECT_ORIGIN));
            compState.destinationSelctedValue = formRef?.getFieldValue(PointToPointTransferSore.AppStateKeys.originOrDestination.SELECT_DESTINATION);
            let fields = subFormFields && subFormFields.length > 0 ? subFormFields : selectedTranferPoint.transferPointType?.metadataFields;
            compState.showUploadComp = showUploadComponent(fields);
            setCompState({ ...compState });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }

    }

    const setEditTransferForm = () => {
        try {
            let destinationList: any = [];
            if (!subFormFields || subFormFields.length == 0) {
                //make all fields size 
                let dynamicForm = transferPoints.dynamicFormFields;
                for (let i = 0; i < transferPoints.dynamicFormValues.length; i++) {
                    let field = dynamicForm.find((item: any) => item.internalName == transferPoints.dynamicFormValues[i].key);
                    if (field) {
                        field.defaultValue = transferPoints.dynamicFormValues[i].value;
                    }
                }
                setFieldsSizeAndVisibility(dynamicForm);
                setSubFormFields(dynamicForm);
            }
            populateDestinationList(transferPoints.destinationList, destinationList);
            compState.destinationList = destinationList.filter((item: any) => item.key != formRef.getFieldValue(PointToPointTransferSore.AppStateKeys.originOrDestination.SELECT_ORIGIN));
            compState.destinationSelctedValue = formRef?.getFieldValue(PointToPointTransferSore.AppStateKeys.originOrDestination.SELECT_DESTINATION);
            let fields = subFormFields && subFormFields.length > 0 ? subFormFields : transferPoints.dynamicFormFields;
            compState.showUploadComp = showUploadComponent(fields);
            setCompState({ ...compState });
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const showUploadComponent = (dynamicForm: any) => {
        try {
            let uploadComp = dynamicForm.find((item: any) => item.internalName == "SupportedAttachments");
            if (uploadComp) {
                compState.uploadCompValidation = uploadComp.validations;
                return true;
            }
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
        return false;
    }

    const setFieldsSize = (dynamicForm: any) => {
        try {
            for (let i = 0; i < dynamicForm.length; i++) {
                // setting size for dynamic form fields
                if (dynamicForm[i].type == 'Multiline') {
                    dynamicForm[i].size = AppConsts.formConstants.columnSize.LARGE;
                } else {
                    dynamicForm[i].size = AppConsts.formConstants.columnSize.MEDIUM;
                }
            }
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const setFieldsVisibility = (dynamicForm: any) => {
        try {
            let checkBoxField = dynamicForm.find((field: any) => field.type == 'Checkbox');
            if (checkBoxField) {
                if (!checkBoxField.value) {
                    // checkBoxField['onChangeCallback'] = onChangeCheckobox;
                    let fieldsToHideOrShow = dynamicForm.filter((field: any) => field.internalName == "PersonContact" || field.internalName == "PersonName");
                    if (fieldsToHideOrShow && fieldsToHideOrShow.length > 0) {
                        for (let i = 0; i < fieldsToHideOrShow.length; i++) {
                            fieldsToHideOrShow[i].visible = false;
                        }
                    }
                }
            }
        } catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const setFieldsSizeAndVisibility = (dynamicForm: any) => {
        try {
            setFieldsVisibility(dynamicForm);
            setFieldsSize(dynamicForm);
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }

        return dynamicForm;
    }
    const updateStatesOnDestinationChange = (dynamicForm: any) => {
        try {
            setFieldsSizeAndVisibility(dynamicForm);
            compState.dynamicForm = dynamicForm;
            setSubFormFields([...dynamicForm]);
            compState.showUploadComp = showUploadComponent(dynamicForm);
            setCompState({ ...compState });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }


    //#endregion

    return (
        <>
            <div className='record-view-padding'>

                <Badge.Ribbon className='custom-badge' text={`Package Id: ${packageId}`}>

                    <Card>
                        <CustomRow className="record-view-padding-0" gutter={[40, 16]}>
                            <CustomCol className="form-area" span={14}>
                                <CustomDropdownInput
                                    dataItems={compState.destinationList}
                                    onChange={handleChange}
                                    label={L(LocalizationKeys.ERP_LblSelectDestination.key)}
                                    name={PointToPointTransferSore.AppStateKeys.originOrDestination.SELECT_DISPATCH_DESTINATION}
                                    rules={validations.selectDestination}
                                    value={compState.destinationSelctedValue}
                                    formRef={formRef} />
                                <CustomRow>
                                    <CustomSubForm subFormFields={subFormFields} hideHeading={true} onChangeCallback={onChangeCheckobox} />
                                </CustomRow>
                            </CustomCol>

                            {compState.showUploadComp && <CustomCol span={10}>
                                <h4> {L(LocalizationKeys.ERP_HdrSupportingDocuments.key)} </h4>
                                <Form.Item name={"UploadFiles"} rules={compState.uploadCompValidation}>
                                    <Upload.Dragger maxCount={5} multiple beforeUpload={beforeUploadFile} onRemove={onRemoveFile} fileList={fileListState.fileList}  >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined className="large-icon" />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Support for a single or bulk upload. Strictly prohibit <br /> from uploading company data or other
                                            band files
                                        </p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </CustomCol>}
                            {transferPoints.supportingDocument && transferPoints.supportingDocument.length > 0 && transferPoints.supportingDocument.map((item: any, index: any) => {
                                return <CustomCol className="transfer-details-col" key={index} span={6}>
                                    <h4> {L(LocalizationKeys.ERP_HdrSupportingDocuments.key)} </h4>
                                    <div ><a target="_blank" href={`${AppConsts.remoteServiceBaseUrl}/Document/View?key=${item.documentKey}&${AppConsts.authorization.sourceAppKey}=${AppConsts.erpApps.ERPPortal.accessKey}`}>{item.documentName}</a></div>
                                </CustomCol>
                            })}

                        </CustomRow>
                    </Card>

                </Badge.Ribbon>
            </div>
        </>
    )
}

export default Dispatch;
