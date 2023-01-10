import './App.css';

import React, { useEffect } from 'react';

import Router from './components/Router';
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper';
import { withStore } from 'react-context-hook'
import { useAppStores } from './hooks/appStoreHooks';
const App = (props: any) => {
  const { sessionStore } = useAppStores()
  //TODOKH:
  const onCompLoad = async () => {
    await sessionStore.getCurrentLoginInformations();
    console.log(sessionStore.currentLogin);
    //TODOKH: Feature based enabling
    if (!!sessionStore.currentLogin.user && sessionStore.currentLogin.application.features['SignalR']) {
      if (sessionStore.currentLogin.application.features['SignalR.AspNetCore']) {
        SignalRAspNetCoreHelper.initSignalR();
      }
    }
  }
  useEffect(() => {
    //comp load
    onCompLoad();
  }, []);

  return <Router />;
}

export default withStore(App);
