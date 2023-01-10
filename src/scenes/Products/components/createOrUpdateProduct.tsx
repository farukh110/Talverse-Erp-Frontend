import React, { useEffect } from 'react';

import { L } from '../../../lib/abpUtility';
import { FormInstance } from 'antd/lib/form';
import CustomForm from '../../../components/CustomForm';
import { useAppState, useAppStores, useCompState } from '../../../hooks/appStoreHooks';
import createProductForm from '../json/createProductForm.json';
import updateProductForm from '../json/updateProductForm.json';
import ProductsStore from '../../../stores/productsStore';
import { CustomModal } from '../../../components/CustomControls';
import LocalizationKeys from '../../../lib/localizationKeys';

export interface ICreateOrUpdateProductProps {
    visible?: boolean;
    onCancel: any;
    modalType?: string;
    onCreate: any;
    formRef?: React.RefObject<FormInstance>;
}

const CreateOrUpdateProduct = (props: ICreateOrUpdateProductProps) => {

    const [formList, setFormList] = useCompState({})
    const [editProduct] = useAppState(ProductsStore.AppStateKeys.EDIT_PRODUCT)
    useEffect(() => {
        populateFormFields();
    }, [editProduct]);

    const populateFormFields = () => {

        if (editProduct != undefined && editProduct.id != 0) {
            Object.keys(editProduct).forEach(function (key) {

                let field = updateProductForm.formFields.find((item: any) => item.internalName == key);
                if (field)
                    field.defaultValue = editProduct[key];
            });
            setFormList(updateProductForm);
        }
        else {
            setFormList(createProductForm);
        }
    }

    const { visible, onCreate, onCancel } = props;

    let modalOptions = {

        "visible": visible,
        "width": '40%',
        "title": L(LocalizationKeys.ERP_HdrProducts.key),
        "destroyOnClose": true,
        "onCancel": onCancel,
        "footer": null,
        theme:"danger",
    }

    return (<CustomModal {...modalOptions}>
        <CustomForm onSubmit={onCreate} onCancel={onCancel}  {...formList} ></CustomForm>
    </CustomModal>
    )
}

export default CreateOrUpdateProduct;