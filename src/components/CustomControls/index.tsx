import * as React from 'react';
import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table, Tabs, Tag } from 'antd';
import { PlusOutlined, UpCircleOutlined, DollarCircleOutlined, LogoutOutlined, HistoryOutlined, MoneyCollectOutlined, EditOutlined, SaveOutlined, DeleteOutlined, FileSearchOutlined, FileTextOutlined, SearchOutlined, RetweetOutlined, UsergroupAddOutlined, CheckOutlined, DownloadOutlined, FileDoneOutlined, ClearOutlined, SecurityScanOutlined, SendOutlined, LockOutlined, UnlockOutlined, LeftOutlined, FilePdfOutlined, BlockOutlined, CommentOutlined } from '@ant-design/icons';
import { ModalProps } from 'antd/lib/modal';
import { ButtonProps } from 'antd/lib/button';
import LocalizationKeys from '../../lib/localizationKeys';
import { L } from '../../lib/abpUtility';

// start custom row
export const CustomRow = (props: any) => {

    return (
        <Row  {...props}>
            {props.children}
        </Row>
    )
}

// end custom row

// start custom column
export const CustomCol = (props: any) => {

    return (
        <Col {...props}>
            {props.children}
        </Col>
    )
}

// end custom column

// start custom button

const iconsList = {
    Edit: <EditOutlined />,
    Save: <SaveOutlined />,
    Delete: <DeleteOutlined />,
    Default: <SaveOutlined />,
    Detail: <FileSearchOutlined />,
    View: <SearchOutlined />,
    Invoice: <FileTextOutlined />,
    Exchange: <RetweetOutlined />,
    UserGroup: <UsergroupAddOutlined />,
    Check: <CheckOutlined />,
    Money: <LogoutOutlined />,
    History: <HistoryOutlined />,
    MoreInfo: <PlusOutlined />,//<UpCircleOutlined />,
    Download: <DownloadOutlined />,
    Generate: <FileDoneOutlined />,
    Clear: <ClearOutlined />,
    Search: <SearchOutlined />,
    ChangePass: <LockOutlined />,
    Send: <SendOutlined />,
    Login: <LockOutlined />,
    ForgetPass: <UnlockOutlined />,
    BackToLogin: <LeftOutlined />,
    Cash: <DollarCircleOutlined />,
    EditProfile: <EditOutlined />,
    ExportPdf: <FilePdfOutlined />,
    Void: <BlockOutlined />,
    RemarksOrder: <CommentOutlined />
}
const appearances = {
    Edit: 'Edit',
    Save: 'Save',
    Delete: 'Delete',
    Default: 'Default',
    Detail: 'View',
    View: 'View Detail',
    Invoice: 'Invoice View',
    Exchange: 'Exchange',
    UserGroup: 'UserGroup',
    Check: 'Check',
    Money: 'Money',
    History: 'History',
    MoreInfo: 'AdditionalTarget',
    Download: 'Download',
    Generate: 'Generate',
    Clear: 'Clear',
    Search: 'Search',
    ChangePass: 'ChangePass',
    Send: 'Send',
    Login: 'Login',
    ForgetPass: 'ForgetPass',
    BackToLogin: 'BackToLogin',
    Cash: 'Cash',
    EditProfile: 'EditProfile',
    ExportPdf: 'ExportPdf',
    Void: 'Void',
    RemarksOrder: 'RemarksOrder'
}
export interface IButtonProps extends ButtonProps {
    appearance?: any;
    actionIcon?: any;
    // type:any;
}
export const CustomButton = (props: IButtonProps) => {

    let btnProps = { ...props };
    let { actionIcon, appearance } = props;
    if (!actionIcon)
        actionIcon = iconsList.Default;
    btnProps.shape = "round";
    switch (appearance) {
        case appearances.Edit:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.Edit;
            break;
        case appearances.Save:
            btnProps.type = "primary";
            btnProps.icon = iconsList.Save;
            break;
        case appearances.Delete:
            btnProps.type = "primary";
            btnProps.shape = "circle";
            btnProps.className = "btn-danger";
            btnProps.danger = true;
            btnProps.icon = iconsList.Delete;
            break;
        case appearances.Detail:
            btnProps.type = "default";
            btnProps.shape = "circle";
            btnProps.className = "btn-success";
            btnProps.danger = false;
            btnProps.icon = iconsList.Detail;
            break;
        case appearances.View:
            btnProps.type = "primary";
            btnProps.shape = "circle";
            btnProps.className = "btn-success";
            btnProps.danger = false;
            btnProps.icon = iconsList.View;
            break;
        case appearances.Invoice:
            btnProps.type = "default";
            btnProps.shape = "circle";
            btnProps.className = "btn-light";
            btnProps.danger = false;
            btnProps.icon = iconsList.Invoice;
            break;
        case appearances.Exchange:
            btnProps.type = "default";
            btnProps.shape = "circle";
            btnProps.danger = true;
            btnProps.icon = iconsList.Exchange;
            break;
        case appearances.UserGroup:
            btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.className = "btn-light";
            btnProps.icon = iconsList.UserGroup;
            break;
        case appearances.Check:
            btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.icon = iconsList.Check;
            break;
        case appearances.MoreInfo:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.icon = iconsList.MoreInfo;
            break;
        case appearances.Money:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.icon = iconsList.Money;
            break;
        case appearances.History:
            btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.icon = iconsList.History;
            break;
        case appearances.Clear:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.icon = iconsList.Clear;
            break;
        case appearances.Download:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-secondary";
            btnProps.icon = iconsList.Download;
            break;
        case appearances.Void:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-danger";
            btnProps.icon = iconsList.Void;
            break;
        case appearances.ExportPdf:
            btnProps.type = "default";
            btnProps.shape = "circle";
            btnProps.className = "btn-success";
            btnProps.danger = false;
            btnProps.icon = iconsList.ExportPdf;
            break;
        case appearances.Generate:
            // btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.Generate;
            break;

        case appearances.Search:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.Search;
            break;
        case appearances.ChangePass:
            // btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-secondary";
            btnProps.icon = iconsList.ChangePass;
            break;
        case appearances.Send:
            // btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.Send;
            break;
        case appearances.Login:
            // btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.Login;
            break;
        case appearances.ForgetPass:
            // btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.className = "btn-outline-primary";
            btnProps.icon = iconsList.ForgetPass;
            break;
        case appearances.BackToLogin:
            btnProps.shape = "circle";
            btnProps.type = "default";
            btnProps.className = "btn-secondary";
            btnProps.icon = iconsList.BackToLogin;
            btnProps.title = L(LocalizationKeys.ERP_LblBackToLogin.key);
            break;
        case appearances.Cash:
            btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.Cash;
            break;
        case appearances.EditProfile:
            // btnProps.shape = "circle";
            btnProps.type = "primary";
            btnProps.className = "btn-primary";
            btnProps.icon = iconsList.EditProfile;
            break;
        case appearances.RemarksOrder:
            btnProps.type = "default";
            btnProps.shape = "circle";
            btnProps.className = "btn-light";
            btnProps.danger = false;
            btnProps.icon = iconsList.RemarksOrder;
            break;
    }

    return (
        <Button {...btnProps}>
            {props.children}
        </Button>
    )

}
CustomButton.actionIcons = iconsList;
CustomButton.appearances = appearances;

// end custom button

// start custom menu

export const CustomMenu = (props: any) => {

    return (
        <Menu {...props}>
            {props.children}
        </Menu>
    )
}

// end custom menu

// start custom menu item

export const CustomMenuItem = (props: any) => {

    return (
        <Menu.Item {...props}>
            {props.children}
        </Menu.Item>
    )
}

// end custom menu item

// start custom modal popup
export interface IModalProps extends ModalProps {
    children: any;
    theme: any;
}
export const CustomModal = (props: IModalProps) => {

    return (<Modal {...props} maskClosable={false} keyboard={false}>
        {props.children}
    </Modal>)
}

export const CustomTabs = (props: any) => {

    return (<Tabs {...props}>
        {props.children}
    </Tabs>)
}

export const CustomTabPane = (props: any) => {

    return (<Tabs.TabPane {...props}>
        {props.children}
    </Tabs.TabPane>)
}


// end custom modal popup