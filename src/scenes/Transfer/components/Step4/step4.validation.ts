import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';

const step4Rules = {
  destination: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectDestination.key) }],
  date: [{ required: true, message: L('PleaseSelectDate') }],
  sendParcel: [{ required: true, message: L('PleaseSelectOption') }],
  name: [{ required: true, message: L('PleaseEnterPersonName') }],
  phone: [{ required: true, message: L('PleaseEnterPhoneNumber') }],
  trackingId: [{ required: true, message: L('PleaseEnterTrackingId') }],
  uploadFiles: [{ required: true, message: L('PleaseUploadFiles') }],
  comments: [{ required: true, message: L('PleaseEnterComments') }],
  
};// might not need to localize as these are coming from backend for this screen

export default step4Rules;
