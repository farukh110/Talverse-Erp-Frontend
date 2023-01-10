import './index.less';

import React, { useRef } from 'react';

import { Avatar, Button, Card, Checkbox, Col, Form, Input, message, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';
import { Link, Redirect } from 'react-router-dom';
import rules from './index.validation';
import { useAppStores, useCompState } from '../../hooks/appStoreHooks';
import LocalizationKeys from '../../lib/localizationKeys';
import { CustomButton, CustomCol, CustomRow } from '../../components/CustomControls';
import CustomTextInput from '../../components/CustomWebControls/CustomTextbox/customTextInput';
import { ResetPasswordRequestDto } from '../../services/user/dto/createOrUpdateUserInput';
import CustomPasswordInput from '../../components/CustomWebControls/CustomPasswordTextbox/customPasswordInput';
import AbpLogo from '../../images/tv-logo.png';
import './index.less';

const ForgotPassword = (props: any) => {

    const [formRef] = Form.useForm();
    const { userStore } = useAppStores();

    const initialState = {
        headerMessage: '',
        buttonText: L(LocalizationKeys.ERP_BtnSendEmail.key),
        isEmailVerified: false,

    };

    const [compState, setCompState] = useCompState(initialState);

    const customValidationCallBack = (rule: any, value: any, callback: any) => {
        const form = formRef;
        let isValid = true;
        if (value && value !== form!.getFieldValue(rule.fieldToCompare)) {
            isValid = false;
        }
        return isValid ? Promise.resolve() : Promise.reject(rule.message);
    }
    const setRules = () => {
        try {
            let ru = rules.confirmPassword;
            let found = ru.find((item: any) => typeof (item.validator) == 'function');
            if (found) {
                found['validator'] = customValidationCallBack;
            }
            return ru;
        } catch (e) {
            console.log(`error: ${e}`);
            return [];
        }
    };
    let confirmPasswordRule: any = rules.confirmPassword ? setRules() : [];


    const onButtonClick = async () => {
        if (!compState.isEmailVerified) {
            formRef.validateFields().then(async (values: any) => {
                let resp = await userStore.sendForgotPasswordToken(values.userNameOrEmailAddress);
                if (resp && resp.success) {
                    message.info(resp.result);
                    compState.isEmailVerified = !compState.isEmailVerified;
                    compState.buttonText = L(LocalizationKeys.ERP_BtnResetPassword.key);
                    formRef.resetFields();
                    setCompState({ ...compState });
                }
            });
        }
        else {
            formRef.validateFields().then(async (values: any) => {
                let requestobj: ResetPasswordRequestDto = {
                    newPassword: values.newPassword,
                    token: values.Otp
                }
                let resp = await userStore.resetPassword(requestobj);
                if (resp && resp.success && resp.result) {
                    formRef.resetFields();
                    setCompState({ ...initialState });
                    message.info(L(LocalizationKeys.ERP_MsgPasswordChangedSuccessfully.key));

                    setTimeout(() => {
                        props.history.push("/user/login");
                    }, 1000);
                }
            });
        }
    }

    return (
        <Form className="" form={formRef}>

            <div className='outer-container'>

                <div className='middle-container'>

                    <div className='inner-container'>

                        <CustomRow>
                            <CustomCol

                                xs={{ span: 20, offset: 2 }}
                                sm={{ span: 16, offset: 4 }}
                                md={{ span: 15, offset: 4 }}
                                lg={{ span: 10, offset: 7 }}
                                xl={{ span: 8, offset: 8 }}
                                xxl={{ span: 6, offset: 9 }}
                            >

                                <Card className='box-shadow'>

                                    {!compState.isEmailVerified &&

                                        <CustomRow>

                                            <CustomCol

                                                xs={{ span: 24, offset: 0 }}
                                                sm={{ span: 14, offset: 0 }}
                                                md={{ span: 24, offset: 0 }}
                                                lg={{ span: 24, offset: 0 }}
                                                xl={{ span: 24, offset: 0 }}
                                                xxl={{ span: 24, offset: 0 }}
                                            >

                                                <Link to='/user/login'>

                                                    <CustomButton
                                                        appearance={CustomButton.appearances.BackToLogin}>
                                                    </CustomButton>

                                                </Link>


                                            </CustomCol>

                                        </CustomRow>
                                    }


                                    <div style={{ textAlign: 'center' }}>

                                        <Avatar shape="square" style={{ height: 50, width: 160 }} src={AbpLogo} />

                                        <br /><br />

                                        <h3>{L(LocalizationKeys.ERP_HdrWelcomeMessage.key)}</h3>
                                    </div>

                                    <CustomRow className="account-container account-content">

                                        {!compState.isEmailVerified &&

                                            <CustomCol

                                                xs={{ span: 24, offset: 0 }}
                                                sm={{ span: 14, offset: 0 }}
                                                md={{ span: 16, offset: 0 }}
                                                lg={{ span: 14, offset: 0 }}
                                                xl={{ span: 16, offset: 0 }}
                                                xxl={{ span: 16, offset: 0 }}
                                            >

                                                <>
                                                    <CustomTextInput name={'userNameOrEmailAddress'} label=''
                                                        rules={rules.userNameOrEmailAddress} placeholder={L(LocalizationKeys.ERP_LblUserName.key)}
                                                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                                </>


                                            </CustomCol>
                                        }
                                        {compState.isEmailVerified &&

                                            <CustomCol

                                                xs={{ span: 24, offset: 0 }}
                                                sm={{ span: 24, offset: 0 }}
                                                md={{ span: 24, offset: 0 }}
                                                lg={{ span: 24, offset: 0 }}
                                                xl={{ span: 24, offset: 0 }}
                                                xxl={{ span: 24, offset: 0 }}>

                                                <CustomTextInput name={'Otp'} label=''
                                                    rules={rules.otp} placeholder={L(LocalizationKeys.ERP_LblOTP.key)}
                                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                            </CustomCol>
                                        }

                                        {!compState.isEmailVerified && <CustomCol

                                            xs={{ span: 24, offset: 0 }}
                                            sm={{ span: 10, offset: 0 }}
                                            md={{ span: 8, offset: 0 }}
                                            lg={{ span: 10, offset: 0 }}
                                            xl={{ span: 8, offset: 0 }}
                                            xxl={{ span: 8, offset: 0 }}
                                        >

                                            <CustomButton
                                                appearance={CustomButton.appearances.Send}
                                                onClick={onButtonClick}>
                                                {L(compState.buttonText)}
                                            </CustomButton>

                                        </CustomCol>
                                        }

                                        <CustomCol span={24}>

                                            {compState.isEmailVerified &&

                                                <CustomRow className="password-row" gutter={[16, 0]}>

                                                    <CustomCol
                                                        className="margin-top-25px"
                                                        xs={{ span: 24, offset: 0 }}
                                                        sm={{ span: 12, offset: 0 }}
                                                        md={{ span: 12, offset: 0 }}
                                                        lg={{ span: 12, offset: 0 }}
                                                        xl={{ span: 12, offset: 0 }}
                                                        xxl={{ span: 12, offset: 0 }}
                                                    >

                                                        <CustomPasswordInput name={'newPassword'} label=''
                                                            rules={rules.password} placeholder={L(LocalizationKeys.ERP_LblNewPassword.key)}
                                                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                                    </CustomCol>

                                                    <CustomCol

                                                        xs={{ span: 24, offset: 0 }}
                                                        sm={{ span: 12, offset: 0 }}
                                                        md={{ span: 12, offset: 0 }}
                                                        lg={{ span: 12, offset: 0 }}
                                                        xl={{ span: 12, offset: 0 }}
                                                        xxl={{ span: 12, offset: 0 }}>

                                                        <CustomPasswordInput name={'confirmPassword'} label=''
                                                            rules={confirmPasswordRule} placeholder={L(LocalizationKeys.ERP_LblConfirmPassword.key)}
                                                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                                    </CustomCol>

                                                    <CustomCol

                                                        xs={{ span: 6, offset: 0 }}
                                                        sm={{ span: 12, offset: 0 }}
                                                        md={{ span: 12, offset: 0 }}
                                                        lg={{ span: 12, offset: 0 }}
                                                        xl={{ span: 12, offset: 0 }}
                                                        xxl={{ span: 12, offset: 0 }}>

                                                        <Link className='btn-back' to='/user/login'>

                                                            <CustomButton
                                                                appearance={CustomButton.appearances.BackToLogin}>
                                                            </CustomButton>

                                                        </Link>

                                                    </CustomCol>

                                                    <CustomCol

                                                        xs={{ span: 18, offset: 0 }}
                                                        sm={{ span: 12, offset: 0 }}
                                                        md={{ span: 12, offset: 0 }}
                                                        lg={{ span: 12, offset: 0 }}
                                                        xl={{ span: 12, offset: 0 }}
                                                        xxl={{ span: 12, offset: 0 }}>

                                                        <CustomButton
                                                            appearance={CustomButton.appearances.Send}
                                                            onClick={onButtonClick}>
                                                            {L(compState.buttonText)}
                                                        </CustomButton>

                                                    </CustomCol>


                                                </CustomRow>

                                            }
                                        </CustomCol>

                                        {!compState.isEmailVerified &&

                                            <CustomCol span={24}>

                                                <CustomRow align="middle">

                                                    <CustomCol span={24}>

                                                        <p>{L(LocalizationKeys.ERP_MsgResetPasswordNote.key)}</p>

                                                    </CustomCol>

                                                </CustomRow>


                                            </CustomCol>

                                        }
                                    </CustomRow>

                                </Card>
                            </CustomCol>
                        </CustomRow>

                    </div>

                </div>

            </div>

        </Form>
    );
}


export default ForgotPassword;
