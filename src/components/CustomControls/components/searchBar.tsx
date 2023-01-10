import * as React from 'react';
import Search from 'antd/lib/input/Search';
import { useCompState } from '../../../hooks/appStoreHooks';

const SearchBar = (props: any) => {
  const { enableSearch } = props.searchOptions;

  let revisedProps = { ...props.searchOptions };

  delete revisedProps.enableSearch;
  delete revisedProps.advanceFilterFields;
  delete revisedProps.enableAdvanceSearch;

  return (
    <>
      {enableSearch &&
        <Search {...revisedProps} />}
    </>
  )
}

export default SearchBar;
