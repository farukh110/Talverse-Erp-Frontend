import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';

const step1Rules = {

  selectOrigin: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectOrigin.key) }],
  selectDestination: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectDestination.key) }],
  selectOriginType: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldSelectOriginType.key) }],
  selectDestinationType: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldSelectDestinationType.key) }],
};

export default step1Rules;
