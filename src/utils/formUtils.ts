import * as abpTypings from '../lib/abp';

import { L } from '../lib/abpUtility';
import { routers } from '../components/Router/router.config';



class FormUtils {

    getFormValidationObject(validaionsArray: any, customValidationCallback?: any) {

        let validationRules: any[] = [];
        if (validaionsArray) {
            validaionsArray.forEach((element: any) => {
                let rule = {};
                if (element.name == "RequiredFieldValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "isRequired") {
                            rule['required'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            validationRules.push(rule);
                        }
                    })
                }
                if (element.name == "MaxLengthValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "value") {
                            rule['max'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            validationRules.push(rule);
                        }
                    })
                }
                if (element.name == "MinLengthValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "value") {
                            rule['max'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            validationRules.push(rule);
                        }
                    })
                }
                if (element.name == "EmailValidator") {
                    element.options.forEach((option: any) => {
                        if (option.key == "type") {
                            rule['type'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            validationRules.push(rule);
                        }
                    })
                }
                if (element.name == "CompareValueValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "fieldToCompare") {
                            rule['validator'] = customValidationCallback;
                            rule['fieldToCompare'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            validationRules.push(rule);
                        }
                    })
                }
                if (element.name == "MinValueValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "value") {
                            rule['min'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            rule['type'] = 'number';
                            rule['required'] = true;
                            validationRules.push(rule);
                        }
                    })
                }
                if (element.name == "MaxValueValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "value") {
                            rule['max'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            rule['type'] = 'number';
                            rule['required'] = true;
                            validationRules.push(rule);
                        }
                    })
                }

                if (element.name == "DecimalPlacesValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "decimalCount") {
                            rule['message'] = L(option.validationMessage);
                            rule['pattern'] = new RegExp('^\\d+(\\.\\d{0,' + option.value + '})?$', 'gi');
                        }
                    })
                }

                if (element.name == "PhoneNumberValidation") {
                    element.options.forEach((option: any) => {
                        if (option.key == "isEnabled") {
                            rule['validator'] = customValidationCallback;
                            rule['value'] = option.value;
                            rule['message'] = L(option.validationMessage);
                            validationRules.push(rule);
                        }
                    })
                }

            });
        }

        return validationRules;
    }

    getColumnSize = (colSize: any) => {
        switch (colSize) {
            case "xxSmall":
                return 4;
            case "xSmall":
                return 6;
            case "Small":
                return 8;
            case "Medium":
                return 12;
            default:
                return 24;
        }
    }

    getDisabledStatus(mode: String) {

        let status = false;
        if (mode == 'ReadOnly') {
            status = true;
        }
        return status;
    }

    setFieldDataItems(formJson: any, fieldId: string, dataItems: any) {
        let fields = formJson.formFields;
        let Field = fields.find((f: any) => f.internalName == fieldId);
        if (Field) {
            Field.dataItems = dataItems;
        }
        return fields;
    }

}

export default new FormUtils();