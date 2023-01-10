import { useStore } from 'react-context-hook'
import { useState, useContext } from 'react';
import AppContext from '../AppProvider';
import { IStoreInstances } from '../stores/storeInitializer';
export function useAppState(key: string, defaultValue?: any) {
    return useStore(key, defaultValue);
}
export function useCompState(initialValue: any) {
    return useState(initialValue);
}
export function useAppStores(): IStoreInstances {
    const appContext: IStoreInstances = useContext(AppContext) as IStoreInstances
    return appContext;
}