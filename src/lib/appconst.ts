import LocalizationKeys from "./localizationKeys";


const AppConsts = {
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'ERP',
  },
  authorization: {
    encrptedAuthTokenName: 'enc_auth_token',
    sourceAppKey: 'SourceAppKey',
    appAccessKey: 'AppAccessKey',
    authorizationKey: 'authorizationkey',
  },
  appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
  remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
  anfReportBaseUrl: process.env.REACT_APP_ANF_REPORT_BASE_URL,

  formConstants: {
    columnSize: {
      SMALL: 'Small',
      MEDIUM: 'Medium',
      X_SMALL: 'xSmall',
      LARGE: 'Large'
    },
    fieldModes: {
      EDIT: "Edit",
      VIEW: "ReadOnly"
    }
  },
  actionNames: {
    EDIT: LocalizationKeys.ERP_LblEdit.key,
    DELETE: LocalizationKeys.ERP_LblDelete.key,
    DETAIL_VIEW: LocalizationKeys.ERP_LblDetailView.key,
    ACKNOWLEDGE_TRANSFER: LocalizationKeys.ERP_LblAcknowledgeTransfer.key,
    INVOICE_GENERATOR: LocalizationKeys.ERP_LblInvoiceGenerator.key,
    CREATE_CASHOUT: LocalizationKeys.ERP_LblCreateCashOut.key,
    VIEW_HISTORY: LocalizationKeys.ERP_LblViewHistory.key,
    SAVE: LocalizationKeys.ERP_LblSave.key,
    UPDATE_CAMPAIGN: LocalizationKeys.ERP_LblUpdateCampaign.key,
    MANAGE_BALANCE_AMOUNTS: LocalizationKeys.ERP_HdrManageBalanceAmount.key,
    PARTIAL_TRANSFER: LocalizationKeys.ERP_LblPartialTransfer.key,
    VIEW_BALANCE_AMOUNT: LocalizationKeys.ERP_LblViewBalanceAmounts.key,
    REMARKS_ORDER: LocalizationKeys.ERP_LblRemarksOrder.key,
    MARK_AS_DONE: LocalizationKeys.ERP_LblMarkAsDone.key
  },
  appState: {
    FORM_LOADER: "FORM_LOADER",
    // tabs
    SELCTED_LANG_TAB: "SELCTED_LANG_TAB"
  },

  staticFields: {
    ID: "id",
    CREATOR_USER_ID: "creatorUserId",
    CREATION_TIME: "creationTime",
    DELETER_USER_ID: "deleterUserId",
    DELETION_TIME: "deletionTime",
    LAST_MODIFICATION_TIME: "lastModificationTime",
    LAST_MODIFIER_USER_ID: "lastModifierUserId",

  },

  staticFieldsValues: {
    IS_SHOW: "show",
    IS_REQUIRED: "required"
  },

  erpApps: {
    ERPPortal: { accessKey: "RVJQUG9ydGFs" },
    AkhyaarApp: { accessKey: "QWtoeWFhckFwcA==" },
    NajfayiaApi: { authorizationKey: process.env.REACT_APP_ANF_AUTHORIZATION_KEY },


  },

  alertMessageTypes: {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
    loading: "loading",
    warn: "warn"
  },
  responseTypes: {
    success: "success",
    error: "error",
  },
  transferStatuses: {
    PENDING_ACK_CODE: 'Pending-Ack'
  },
  selectorModes: {
    MULTIPLE: 'multiple'

  },
  invoiceStatuses: {
    VOID: 'Void',
  },
  permissionNames: {

    Admin_Access: "Admin.Access",
    All_Content: "All.Contents",
    Pages_Roles: "Pages.Roles",
    Pages_Tenants: "Pages.Tenants",
    Data_NoFilter: "Data.NoFilter",

    // //Campaign Permissions
    Campaign_View: "Campaign.View",
    Campaign_Add: "Campaign.Add",
    Campaign_Edit: "Campaign.Edit",
    Campaign_Delete: "Campaign.Delete",
    Campaign_Participant: "Campaign.Participant",

    // //Product Permissions
    Product_View: "Product.View",
    Product_Add: "Product.Add",
    Product_Edit: "Product.Edit",
    Product_Delete: "Product.Delete",

    // //Orders Permissions
    Order_View: "Order.View",
    Order_Add: "Order.Add",
    Order_Edit: "Order.Edit",
    Order_Delete: "Order.Delete",
    Order_GenerateInvoice: "Order.GenerateInvoice",
    Order_Remarks: "Order.Remarks",
    Mark_as_Done: "Order.MarkAsDone",

    // //Transfer Permissions
    Transfer_View: "Transfer.View",
    Transfer_Add: "Transfer.Add",
    Transfer_Edit: "Transfer.Edit",
    Transfer_Delete: "Transfer.Delete",

    // //P2P Transfer Permissions
    P2PTransfer_View: "P2PTransfer.View",
    P2PTransfer_Add: "P2PTransfer.Add",
    P2PTransfer_Edit: "P2PTransfer.Edit",
    P2PTransfer_Delete: "P2PTransfer.Delete",

    // //Cashout Permissions
    Cashout_View: "Cashout.View",
    Cashout_Add: "Cashout.Add",

    // NRE-Report 
    NRE_REPORT_VIEW: "NREReport.View",
    SUPPORTERS_LIST_VIEW: "SupportersList.View",

    //Currency
    CURRENCY_EDIT: "Currency.Edit",

    // //Transfer Point  Permissions
    Transfer_Point_View: "TransferPoint.View",
    Transfer_Point_Add: "TransferPoint.Add",
    Transfer_Point_Edit: "TransferPoint.Edit",
    Transfer_Point_Delete: "TransferPoint.Delete",

    //Transfer Point Manage Balance Amount
    Transfer_Point_Manage_Balance_Amount: "TransferPoint.ManageBalance",

    //Transfer Point Acess Granting 
    Transfer_Point_Manage_Users: "TransferPoint.ManageUsers",

    //Reports
    Reports_Operations: "Reports.Operations",
    Reports_TransferPackageReport: "Reports.TransferPackageReport",
    Reports_AKH_Country_Rankings: "Reports.AKHCountryRankings",
    Reports_AKH_Rep_Progress: "Reports.AKHRepProgress",
    Reports_AKH_Khums_Report: "Reports.AKHKhumsReport",


    Reports_ANF_Operations: "Reports.ANFOperations",
    Reports_ANF_Khums_Report: "Reports.ANFKhumsReport",
    Reports_SDQ_Request_Report: "Reports.SDQRequestReport",

    //Notifications
    Notifications_Manage: "Notifications.Manage",

    // Invoice Void Permission
    Invoice_Void: "Invoice.Void"

  },
  DateUnits: {
    MONTH: 'month',
    YEAR: 'year',
    DAY: 'day',
    WEEK: 'week',
    DATE: 'date',
    HOUR: 'hour',
    MINUTE: 'minute'
  },

};
export default AppConsts;