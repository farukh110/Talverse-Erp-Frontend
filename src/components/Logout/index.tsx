import { useEffect, useContext } from 'react';

import AppContext from '../../AppProvider';
import { IStoreInstances } from '../../stores/storeInitializer'


// @inject(Stores.AuthenticationStore)
// class Logout extends React.Component<ILogoutProps> {
const Logout = (props: any) => {
  const appContext: IStoreInstances = useContext(AppContext) as IStoreInstances;

  useEffect(() => {
    appContext.authenticationStore!.logout();
    window.location.href = '/';
  }, []);


  return null;

}

export default Logout;
