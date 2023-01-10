import { L } from '../../../../lib/abpUtility';
import LocalizationKeys from '../../../../lib/localizationKeys';

const step2Rules = {
  amount: [{ required: true, message: L(LocalizationKeys.ERP_Error_FieldPleaseEnterAmount.key ) }],
};

export default step2Rules;
