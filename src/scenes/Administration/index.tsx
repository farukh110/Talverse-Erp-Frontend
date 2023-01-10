import { ClearOutlined, ContactsOutlined, SettingOutlined, UnorderedListOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { CustomButton, CustomCol, CustomRow } from '../../components/CustomControls';
import { useCompState } from '../../hooks/appStoreHooks';
import { L } from '../../lib/abpUtility';
import LocalizationKeys from '../../lib/localizationKeys';
import ClearCache from './components/Cache';
import './index.less';


const Administration = () => {

    const [visible, setVisible] = useCompState(false);
    const [cacheType, SetCahceType] = useCompState('');

    const openModal = (type: String) => {
        setVisible(true);
        SetCahceType(type);
    }
    const contentList = [

        {
            link: '/administration/programCategories',
            name: L(LocalizationKeys.ERP_LblProgramCategory.key)
        },
        {
            link: '/administration/programs',
            name: L(LocalizationKeys.ERP_LblProgram.key)
        },
        {
            link: '/administration/products',
            name: L(LocalizationKeys.ERP_LblProduct.key)
        },
        {
            link: '/administration/productForms',
            name: L(LocalizationKeys.ERP_LblProductForms.key)
        },
        {
            link: '/administration/countries',
            name: L(LocalizationKeys.ERP_LblCountry.key)
        },
        {
            link: '/administration/currencies',
            name: L(LocalizationKeys.ERP_LblCurrency.key)
        },
        {
            link: '/administration/htmlTemplates',
            name: L(LocalizationKeys.ERP_LblHTMLTemplates.key)
        },
        {
            link: '/administration/status',
            name: L(LocalizationKeys.ERP_LblStatus.key)
        },
        {
            link: '/transferPoint',
            name: L(LocalizationKeys.ERP_LblTransferPoints.key)
        },
        {
            link: '/administration/allcontent',
            name: L(LocalizationKeys.ERP_LblAllContent.key)
        }
    ];

    const userManagementList = [

        {
            link: '/administration/users',
            name: L(LocalizationKeys.ERP_LblUsers.key)
        },
        {
            link: '/content?q=Permissions',
            name: L(LocalizationKeys.ERP_LblPermissions.key),
        },

    ];

    const settingList = [

        {
            link: '/content?q=UserSettings',
            name: L(LocalizationKeys.ERP_LblUserSettings.key)
        },
        {
            link: '/',
            name: L(LocalizationKeys.ERP_LblAppSettings.key),
        },

    ];

    const cacheList = [

        {
            link: '/',
            name: L(LocalizationKeys.ERP_LblClearPermission.key),
            type: 'PermissionCache'
        },
        {
            link: '/',
            name: L(LocalizationKeys.ERP_LblClearAllCache.key),
            type: 'AllCache'
        },
    ];

    return (
        <Card bordered={false}>
            <div className='administration-container'>
                <CustomRow gutter={[16, 16]}>

                    <CustomCol
                        xxl={{ span: 6, offset: 0 }}
                        xl={{ span: 6, offset: 0 }}
                        lg={{ span: 6, offset: 0 }}
                        md={{ span: 6, offset: 0 }}
                        sm={{ span: 6, offset: 0 }}
                        xs={{ span: 6, offset: 0 }}>

                        <div className='decoration-none'>

                            <div className="box bg-primary back-primary">

                                <UnorderedListOutlined className='custom-icon' />

                                <h3 className="text-center h2"> Content </h3>

                                <ul>

                                    {
                                        contentList.map((item, index) => (

                                            <li key={index}>
                                                <Link to={item.link}> <p className="text-left"> {item.name}  </p>
                                                </Link>
                                            </li>

                                        ))
                                    }

                                </ul>

                            </div>

                        </div>

                    </CustomCol>

                    <CustomCol
                        xxl={{ span: 6, offset: 0 }}
                        xl={{ span: 6, offset: 0 }}
                        lg={{ span: 6, offset: 0 }}
                        md={{ span: 6, offset: 0 }}
                        sm={{ span: 6, offset: 0 }}
                        xs={{ span: 6, offset: 0 }}>

                        <div className='decoration-none'>

                            <div className="box bg-danger back-danger">

                                <SettingOutlined className='custom-icon' />

                                <h3 className="text-center h2"> Settings </h3>

                                <ul>

                                    {
                                        settingList.map((item, index) => (

                                            <li key={index}>
                                                <Link to={item.link}> <p className="text-left"> {item.name}  </p>
                                                </Link>
                                            </li>

                                        ))
                                    }

                                </ul>
                            </div>

                        </div>

                    </CustomCol>

                    <CustomCol
                        xxl={{ span: 6, offset: 0 }}
                        xl={{ span: 6, offset: 0 }}
                        lg={{ span: 6, offset: 0 }}
                        md={{ span: 6, offset: 0 }}
                        sm={{ span: 6, offset: 0 }}
                        xs={{ span: 6, offset: 0 }}>

                        <div className='decoration-none'>

                            <div className="box bg-warning back-warning">

                                <UsergroupAddOutlined className='custom-icon' />

                                <h3 className="text-center h2"> User Management </h3>

                                <ul>

                                    {
                                        userManagementList.map((item, index) => (

                                            <li key={index}>
                                                <Link to={item.link}> <p className="text-left"> {item.name}  </p>
                                                </Link>
                                            </li>

                                        ))
                                    }

                                </ul>

                            </div>

                        </div>

                    </CustomCol>

                    <CustomCol
                        xxl={{ span: 6, offset: 0 }}
                        xl={{ span: 6, offset: 0 }}
                        lg={{ span: 6, offset: 0 }}
                        md={{ span: 6, offset: 0 }}
                        sm={{ span: 6, offset: 0 }}
                        xs={{ span: 6, offset: 0 }}>

                        <div className='decoration-none'>

                            <div className="box bg-success back-success">

                                <ClearOutlined className='custom-icon' />

                                <h3 className="text-center h2"> Cache </h3>

                                <ul>

                                    {
                                        cacheList.map((item, index) => (

                                            <li key={index}>
                                                <p className="text-left" onClick={(event:any)=>{openModal(item.type)}}>{item.name}</p>                                         
                                            </li>

                                        ))
                                    }

                                </ul>
                            </div>

                        </div>

                    </CustomCol>

                </CustomRow>

            </div>
            <ClearCache visible={visible} onCancel={() =>{setVisible(false);}} onOk={() =>{setVisible(false);}} type={cacheType}  />

        </Card>
    );

};

export default Administration;
