import './index.less';

import React, { useEffect, useRef } from 'react';

import { Avatar, Card, Checkbox, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';
import { Link, Redirect } from 'react-router-dom';
import rules from './index.validation';
import { useAppStores } from '../../hooks/appStoreHooks';
import LocalizationKeys from '../../lib/localizationKeys';
import { CustomButton, CustomCol, CustomRow } from '../../components/CustomControls';
import AbpLogo from '../../images/tv-logo.png';

const FormItem = Form.Item;
declare var abp: any;
export interface ILoginProps {
  history: any;
  location: any;
}

const Login = (props: ILoginProps) => {
  const formRef = useRef<FormInstance>(null);
  const { authenticationStore } = useAppStores();

  const handleSubmit = async (values: any) => {
    const { loginModel } = authenticationStore!;
    await authenticationStore!.login(values);
    sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
    const { state } = props.location;
    window.location = state ? state.from.pathname : '/';
  };

  let { from } = props.location.state || { from: { pathname: '/' } };
  if (authenticationStore!.isAuthenticated) return <Redirect to={from} />;

  const { loginModel } = authenticationStore!;


  return (
    <Form className="" onFinish={handleSubmit} ref={formRef}>

      <div className='outer-container'>

        <div className='middle-container'>

          <div className='inner-container'>

            <CustomRow className="account-content">
              <CustomCol

                xs={{ span: 20, offset: 2 }}
                sm={{ span: 16, offset: 4 }}
                md={{ span: 15, offset: 4 }}
                lg={{ span: 10, offset: 7 }}
                xl={{ span: 8, offset: 8 }}
                xxl={{ span: 6, offset: 9 }}
              >

                <Card className='box-shadow'>
                  <div style={{ textAlign: 'center' }}>

                    <Avatar shape="square" style={{ height: 50, width: 160 }} src={AbpLogo} />

                    <br /><br />

                    <h3>{L(LocalizationKeys.ERP_HdrWelcomeMessage.key)}</h3>
                  </div>


                  <FormItem name={'userNameOrEmailAddress'} rules={rules.userNameOrEmailAddress}>
                    <Input placeholder={L(LocalizationKeys.ERP_LblUserNameOrEmail.key)} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  </FormItem>

                  <FormItem name={'password'} rules={rules.password}>
                    <Input placeholder={L(LocalizationKeys.ERP_LblPassword.key)} prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
                  </FormItem>

                  <CustomRow align="middle" className="account-container">

                    <CustomCol
                      className="forget-pass-content"
                      xs={{ span: 24, offset: 0 }}
                      sm={{ span: 8, offset: 0 }}
                      md={{ span: 9, offset: 0 }}
                      lg={{ span: 9, offset: 0 }}
                      xl={{ span: 9, offset: 0 }}
                      xxl={{ span: 9, offset: 0 }}
                    >

                      {/* <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe} style={{ paddingRight: 8 }} />
                      {L(LocalizationKeys.ERP_LblRememberMe.key)} */}

                      <Link className='link-forgot-pass' to='/user/forgotPassword'> 
                      
                      <CustomButton
                        appearance={CustomButton.appearances.ForgetPass}
                        htmlType={'button'}>
                        {L(LocalizationKeys.ERP_LblForgotPassword.key)}
                      
                      </CustomButton>

                      </Link>

                    </CustomCol>

                    <CustomCol

                      xs={{ span: 0, offset: 0 }}
                      sm={{ span: 8, offset: 0 }}
                      md={{ span: 7, offset: 0 }}
                      lg={{ span: 7, offset: 0 }}
                      xl={{ span: 7, offset: 0 }}
                      xxl={{ span: 7, offset: 0 }}>


                    </CustomCol>

                    <CustomCol
                      className="margin-top-15px"
                      xs={{ span: 24, offset: 0 }}
                      sm={{ span: 8, offset: 0 }}
                      md={{ span: 8, offset: 0 }}
                      lg={{ span: 8, offset: 0 }}
                      xl={{ span: 8, offset: 0 }}
                      xxl={{ span: 8, offset: 0 }}>

                      <CustomButton
                        appearance={CustomButton.appearances.Login}
                        htmlType={'submit'}>
                        {L(LocalizationKeys.ERP_LblLogIn.key)}
                      </CustomButton>

                    </CustomCol>
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


export default Login;
