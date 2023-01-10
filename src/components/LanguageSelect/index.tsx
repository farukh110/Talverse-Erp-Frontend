import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';

import React, { useContext } from 'react';

import { Dropdown, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import { L } from '../../lib/abpUtility';
// import Stores from '../../stores/storeIdentifier';
import { useAppStores } from '../../hooks/appStoreHooks';
import classNames from 'classnames';
import LocalizationKeys from '../../lib/localizationKeys';
// import { inject } from 'mobx-react';

declare var abp: any;


// @inject(Stores.UserStore)
// class LanguageSelect extends React.Component<ILanguageSelectProps> {
const LanguageSelect = (props: any) => {
  const { userStore } = useAppStores()
  const languages = () => {
    return abp.localization.languages.filter((val: any) => {
      return !val.isDisabled;
    });
  }

  const changeLanguage = async (languageName: string) => {
    try {
      await userStore.changeLanguage(languageName);
    }
    catch (e) {
      console.log(`error: ${e}`);
    }
    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
      languageName,
      new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
      abp.appPath
    );

    window.location.reload();
  }

  const currentLanguage = () => {

    return abp.localization.currentLanguage;
  }


  const langMenu = (
    <Menu className={'menu'} selectedKeys={[currentLanguage.name]}>
      {languages().map((item: any) => (
        <Menu.Item key={item.name} onClick={() => changeLanguage(item.name)}>
          <i className={item.icon} /> {item.displayName}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      {/* <span className='selected-lang'>{abp.localization.currentLanguage.displayName}
       </span> */}
      {/* <Dropdown overlay={langMenu} placement="bottomRight">
        <div className={abp.localization.currentLanguage.icon}></div>
         */}
        {/* <GlobalOutlined className={classNames('dropDown', 'className')} title={L('ChangeLanguage')} /> */}
      {/* </Dropdown> */}
      {/* <span className='menu-sep-line'> | </span> */}
    </>);

}

export default LanguageSelect;
