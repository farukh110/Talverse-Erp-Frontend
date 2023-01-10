import React, { useContext, useEffect } from 'react';
import { Tabs } from 'antd';
import FormElement from '../FormElement';
import { CustomCol, CustomRow } from '../../../CustomControls';
import { FormModes } from '../..';
import formUtils from '../../../../utils/formUtils';
import { useAppState } from '../../../../hooks/appStoreHooks';
import AppConsts from '../../../../lib/appconst';

const { TabPane } = Tabs;

declare var abp: any;

const LanguageTranslations = (props: any) => {




    const [languageSelectedTab, setLanguageSelectedTab] = useAppState(AppConsts.appState.SELCTED_LANG_TAB, "tb_en");
    const { fields, defaultValue, formMode } = props;



    useEffect(() => {
        setLanguageSelectedTab("tb_en");
    }, []);


    const languages = () => {
        return abp.localization.languages.filter((val: any) => {
            return !val.isDisabled;
        });
    }

    let translationObject = {};
    const translateLanguageArray = () => {
        try {
            languages().forEach((element: any) => {
                translationObject[element.name] = {};
            });
            if (defaultValue != "") {
                defaultValue.forEach((translation: any) => {
                    Object.keys(translation).forEach(function (key) {
                        if (key != "language" && translationObject[translation.language])
                            translationObject[translation.language][key] = translation[key];
                    })
                })
            }
        }
        catch (ex) {

            console.log(`error: ${ex}`);
        }
    }

    translateLanguageArray();

    const onTabChange = (key: any) =>{
        setLanguageSelectedTab(key);
    }

    // use tabs here 
    return (
        <Tabs  activeKey={languageSelectedTab} onTabClick={onTabChange} >

            {languages().map((lang: any, $index: any) => (
                <TabPane tab={<span><i className={lang.icon} /> {lang.displayName} </span>} key={`tb_${lang.name}`} forceRender={true}>
                    <CustomRow gutter={[16]}>

                        {fields.map((formField: any, $index: any) => (
                            <CustomCol key={$index} span={formUtils.getColumnSize(formField.size)}>
                                <FormElement key={$index} {...formField} dataType={formField.type} type={(formMode == FormModes.Display || formField.mode == FormModes.Display) ? "Label" : formField.type} defaultValue={translationObject[lang.name][formField.internalName]} internalName={`${formField.internalName}_${lang.name}`} />
                            </CustomCol>
                        ))}
                    </CustomRow>
                </TabPane>
            ))}
        </Tabs>
    )
}

export default LanguageTranslations;