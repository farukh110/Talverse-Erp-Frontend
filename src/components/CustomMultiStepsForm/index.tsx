import React, { forwardRef, useState } from 'react';
import { Steps, message, Form } from 'antd';
import './index.less';

import { CustomButton, CustomCol, CustomRow } from '../CustomControls';
import { useCompState } from '../../hooks/appStoreHooks';
import { L } from '../../lib/abpUtility';
import LocalizationKeys from '../../lib/localizationKeys';


const { Step } = Steps;
export interface IStep {
    title: string,
    content: JSX.Element
}
export interface ICustomMultiStepsFormProps {
    steps: IStep[];
    onFinish?: (formValues: any) => void;
    onNext?: (currentStep: number, formValues: any) => boolean;
    onPrevious?: (currentStep: number, formValues: any) => boolean;
    nextButtonText?: string;
    prevButtonText?: string;
    finishButtonText?: string;
    
}
// export interface ICustom
const CustomMultiStepsForm = forwardRef((props: ICustomMultiStepsFormProps, ref: any) => {
    const { steps } = props;
    const [formRef] = Form.useForm();
    const [currentStep, setCurrentStep] = useCompState(0);

    const validateAndGetValues = (callBackFunc: (formValues: any) => any) => {
        const form = formRef;
        try {
            form!.validateFields().then(async (values: any) => {
                 callBackFunc(getNormalizedValues());
               // callBackFunc(values);
            });
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const getValues = (callBackFunc: (formValues: any) => any) => {
        try {
             callBackFunc(getNormalizedValues());
            //callBackFunc(formRef.getFieldsValue(true));
        }
        catch (ex) {
            console.log(`error: ${ex}`);
        }
    }

    const getNormalizedValues = () => {
        let normalizedValues = {};
        try {
            let values = formRef.getFieldsValue(true);
            // normalizedValues = values;
            //write logic here
            let index = 0;
            let indexUseCount = 0;
            for (const property in values) {
                try {
                    if (property.startsWith('arr')) {
                        let temp = property.split('_')
                        if (temp.length == 4) {
                            //temp[0] -- arr
                            //temp[1] -- propertyname
                            //temp[2] -- id
                            //temp[3] -- fieldname
                            //console.log(temp);
                            //console.log(`${property}: ${sourceValues[property]}`);
                            let groupPropName = temp[1];
                            // let arrayItemIndex = parseInt(temp[2]) - 1;
                            let arrayItemIndex = index;

                            let fieldName = temp[3];
                            if (!normalizedValues[groupPropName])
                                normalizedValues[groupPropName] = []//initialize array for holding grouped values
                            if (!normalizedValues[groupPropName][arrayItemIndex] || normalizedValues[groupPropName][arrayItemIndex] == undefined) {
                                normalizedValues[groupPropName].push({})
                            }
                            normalizedValues[groupPropName][arrayItemIndex][fieldName] = values[property];
                            indexUseCount++;
                            if(indexUseCount == 5){
                                index++;
                                indexUseCount = 0;
                            }

                        }
                        else {
                            normalizedValues[property] = values[property]
                        }
                    }
                    else if (property) {
                        normalizedValues[property] = values[property]
                    }
                }

                catch (err) {
                    console.log(err, property);
                }
            }
        }
        catch (ex) {
            console.log('Caught exception : getValues() : CustomMultiStepsForm ', ex)
        }

        return normalizedValues;
    }
    const finish = () => {
        //finish event
        validateAndGetValues((formValues: any) => {
            if (props.onFinish) {
                props.onFinish(formValues);
                //formRef.resetFields();
            }
            else
                message.success('Processing complete!')
        });
    }
    const next = () => {
        validateAndGetValues((formValues: any) => {
            if (!props.onNext)
                setCurrentStep(currentStep + 1);//if no callback defined for onnext and change step automatically

            if (props.onNext && typeof props.onNext == "function" && props.onNext(currentStep, formValues))
                setCurrentStep(currentStep + 1);
        });
    };

    const prev = () => {
        getValues((formValues: any) => {
            if (!props.onPrevious)
                setCurrentStep(currentStep - 1);//if no callback defined for onnext and change step automatically

            if (props.onPrevious && typeof props.onNext == "function" && props.onPrevious(currentStep, formValues))
                setCurrentStep(currentStep - 1);
        });
    };


    return (
        <>
            <Form ref={ref} form={formRef} layout="vertical" className="custom-form">
                <Steps current={currentStep}>
                    {steps.map((item: any) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                {/* {steps.map((item: any, $index: number) => (
                   $index == currentStep && <div key={'dv' + $index} className="steps-content steps-main-area"  >{React.cloneElement(item.content, { ...{ formRef: formRef } })}</div>
                ))} */}
                {/* <div className="steps-content steps-main-area">{React.cloneElement(steps[currentStep].content, {...{formRef:formRef}})}</div> */}
                <div className="steps-content steps-main-area">{steps[currentStep].content}</div>

                <div className="steps-action">

                    <CustomRow>

                        <CustomCol span={12}>

                            {currentStep > 0 && (
                                <CustomButton style={{ margin: '0 8px' }} onClick={() => prev()}>
                                    {props.prevButtonText || L(LocalizationKeys.ERP_LblPrevious.key)}
                                </CustomButton>
                            )}
                        </CustomCol>

                        <CustomCol span={12}>

                            {currentStep < steps.length - 1 && (

                                <CustomButton className="btn-right" type="primary" onClick={() => next()}>
                                    {props.nextButtonText || L(LocalizationKeys.ERP_LblNext.key)}
                                </CustomButton>

                            )}

                            {currentStep === steps.length - 1 && (
                                <CustomButton type="primary" className="btn-right" onClick={() => finish()}>
                                    {props.finishButtonText || L(LocalizationKeys.ERP_LblDispatch.key)}
                                </CustomButton>
                            )}
                        </CustomCol>
                    </CustomRow>
                </div>
            </Form>
        </>
    )
})

export default CustomMultiStepsForm;
