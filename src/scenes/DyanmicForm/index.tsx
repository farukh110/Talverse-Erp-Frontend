import React, { useEffect, useRef } from 'react';
import CustomForm from '../../components/CustomForm';

import { useAppState, useAppStores, useCompState } from '../../hooks/appStoreHooks';

import { Button } from 'antd';
import { GetDynamicFormRequestDto } from '../../services/dynamicForm/dto/getDynamicFormRequestDto';



const DynamicForm = (props: any) => {

    const initialState = {
        counter: 1
    };

    const [compState, setCompState] = useCompState(initialState)
    const { dynamicFormStore } = useAppStores();
    const [formsList, setFormList] = useCompState([])//useAppState(DynamicFormStore.AppStateKeys.FORM, [])


    useEffect(() => {
        console.log("on load")
        getForm();
    }, []);



    const form = {
            "mode": "Edit",
            "size": "Large",
            "validations": null,
            "type": "LanguageTranslation",
            "defaultValue": "",
            "visible": true,
            "internalName": "isActive",
            "displayName": "Is Active",
            "value": "",
            "fields": [
                {
                  "mode": "Edit",
                  "size": "Large",
                  "validations": [
                    {
                      "name": "RequiredFieldValidation",
                      "options": [
                        {
                          "key": "isRequired",
                          "value": true,
                          "validationMessage": "Please enter Name!"
                        }
                      ]
                    }
                  ],
                  "type": "Text",
                  "defaultValue": "",
                  "visible": true,
                  "internalName": "name",
                  "displayName": "Name",
                  "value": ""
                },
                {
                  "mode": "Edit",
                  "size": "Large",
                  "validations": [
                    {
                      "name": "RequiredFieldValidation",
                      "options": [
                        {
                          "key": "isRequired",
                          "value": true,
                          "validationMessage": "Please enter Surname!"
                        }
                      ]
                    }
                  ],
                  "type": "Text",
                  "defaultValue": "",
                  "visible": true,
                  "internalName": "surname",
                  "displayName": "Surname",
                  "value": ""
                },
                {
                  "mode": "Edit",
                  "size": "Large",
                  "validations": [
                    {
                      "name": "RequiredFieldValidation",
                      "options": [
                        {
                          "key": "isRequired",
                          "value": true,
                          "validationMessage": "Please enter User Name!"
                        }
                      ]
                    }
                  ],
                  "type": "Text",
                  "defaultValue": "",
                  "visible": true,
                  "internalName": "userName",
                  "displayName": "user Name",
                  "value": ""
                },
                {
                  "mode": "Edit",
                  "size": "Large",
                  "validations": [
                    {
                      "name": "RequiredFieldValidation",
                      "options": [
                        {
                          "key": "isRequired",
                          "value": true,
                          "validationMessage": "Please enter Email!"
                        }
                      ]
                    },
                    {
                      "name": "EmailValidator",
                      "options": [
                        {
                          "key": "type",
                          "value": "email",
                          "validationMessage": "The input is not valid E-mail!"
                        }
                      ]
                    }
                  ],
                  "type": "Text",
                  "defaultValue": "",
                  "visible": true,
                  "internalName": "emailAddress",
                  "displayName": "Email",
                  "value": ""
                },
                {
                  "mode": "Edit",
                  "size": "Large",
                  "validations": null,
                  "type": "Checkbox",
                  "defaultValue": "",
                  "visible": true,
                  "internalName": "isActive",
                  "displayName": "Is Active",
                  "value": ""
                },
                {
                  "mode": "Edit",
                  "size": "Large",
                  "dataItems": [
                    {
                      "key": "ADMIN",
                      "value": "Admin"
                    },
                    {
                      "key": "REP",
                      "value": "Representative"
                    },
                    {
                      "key": "REPCO",
                      "value": "Representative Coordinator"
                    },
                    {
                      "key": "PROGMGR",
                      "value": "Program Manager"
                    }
                  ],
                  "validations": null,
                  "dynamicLogics": null,
                  "type": "CheckboxGroup",
                  "defaultValue": "",
                  "visible": true,
                  "internalName": "roleNames",
                  "displayName": "Roles",
                  "value": ""
                
                }
              ]          
        
      };
    const getForm = async () => {


        let formObj : GetDynamicFormRequestDto = { formId: compState.counter };
        let result = await dynamicFormStore.getForm(formObj);
        result = result ? result : [];
       //result.formFields.push(form);
        setFormList(result);
       

    }

    const changeForm = () => {
        compState.counter++;
        setCompState(compState);
        if (compState.counter <= 18)
            getForm();
        else {
            compState.counter = 1;
            setCompState(compState);
        }
    }

    return (
        <>
            <Button onClick={() => changeForm()}> PRESS ME</Button>
            <CustomForm {...formsList} formId={compState.counter} />
        </>
    )
}

export default DynamicForm;