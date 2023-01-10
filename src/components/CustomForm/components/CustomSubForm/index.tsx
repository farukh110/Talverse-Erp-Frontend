import React from 'react';
import { FormModes } from '../..';
import formUtils from '../../../../utils/formUtils';
import { CustomCol, CustomRow } from '../../../CustomControls';
import CustomHeading from '../../../CustomWebControls/CustomHeading';
import FormElement from '../FormElement';
import './index.less';

const CustomSubForm = (props: any) => {
    const { subFormFields, formRef, formFields, onReloadForm, displayName,formMode , hideHeading, onChangeCallback } = props;
    let allFields = formFields;
    if (allFields && subFormFields)
        allFields = allFields.concat(subFormFields);

    return (
        <>
            {subFormFields && subFormFields.length > 0 &&
                <div className="custom-sub-form">
                   { !hideHeading && <CustomHeading headingText={displayName} /> } 
                    <CustomRow gutter={[16]}>
                        {subFormFields.map((formField: any, $index: any) => (
                            formField.visible && formField.type && formField.type != 'Hidden' && <CustomCol key={$index} span={formUtils.getColumnSize(formField.size)}>
                                <FormElement  {...formField} type={(formMode == FormModes.Display || formField.mode == FormModes.Display) && formField.type != "CustomSubForm" && formField.type != "Dropdown" ? "Label" : formField.type} formRef={formRef} formFields={allFields} onReloadForm={onReloadForm} onChangeCallback={onChangeCallback} />
                            </CustomCol>
                        ))}
                    </CustomRow>
                </div>
            }
        </>
    )
}

export default CustomSubForm;
