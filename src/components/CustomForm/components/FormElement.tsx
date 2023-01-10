
import * as React from 'react';
import CustomTextbox from '../../CustomWebControls/CustomTextbox';
import CustomDropdown from '../../CustomWebControls/CustomDropdown';
import CustomNumberTextbox from '../../CustomWebControls/CustomNumberTextbox';
import CustomDatePicker from '../../CustomWebControls/CustomDatePicker'
import CustomMultiLineTextBox from '../../CustomWebControls/CustomMultiLineTextbox';
import CustomPasswordTextBox from '../../CustomWebControls/CustomPasswordTextbox';
import CustomCheckboxGroup from '../../CustomWebControls/CustomCheckboxGroup';
import CustomSwitch from '../../CustomWebControls/CustomSwitch';
import LanguageTranslations from './LanguageTranslations';
import CustomCalculatedControl from '../../CustomWebControls/CustomCalculatedControl';
import CustomSubForm from './CustomSubForm';
import CustomHeading from '../../CustomWebControls/CustomHeading';
import CustomLabel from '../../CustomWebControls/CustomLabel';
import { CustomAutoComplete } from '../../CustomWebControls/CustomAutoComplete';
import CustomRangePicker from '../../CustomWebControls/CustomRangePicker';
import CustomPhoneInput from '../../CustomWebControls/CustomPhoneInput';

// mapping of our components

const componentMapping = {
  Dropdown: CustomDropdown,
  Text: CustomTextbox,
  Checkbox: CustomSwitch,//CustomCheckbox,
  Number: CustomNumberTextbox,
  DatePicker: CustomDatePicker,
  Multiline: CustomMultiLineTextBox,
  Calculated: CustomCalculatedControl,
  Password: CustomPasswordTextBox,
  CheckboxGroup: CustomCheckboxGroup,
  LanguageTranslation: LanguageTranslations,
  CustomSubForm: CustomSubForm,
  CustomHeading: CustomHeading,
  Label: CustomLabel,
  AutoComplete: CustomAutoComplete,
  RangePicker:CustomRangePicker,
  CustomPhone: CustomPhoneInput
}

function FormElement(props: any) {
  // dynamically select a component from componentMapping object

  const Component = componentMapping[props.type]

  

  return (
    <>
      <Component {...props} />
    </>
  )
}

export default FormElement;