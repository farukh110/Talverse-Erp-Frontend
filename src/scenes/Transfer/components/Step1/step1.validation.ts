import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';

const step1Rules = {

  selectOrigin: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectOrigin.key) }],
  selectDestination: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseSelectDestination.key) }],
};

export default step1Rules;
