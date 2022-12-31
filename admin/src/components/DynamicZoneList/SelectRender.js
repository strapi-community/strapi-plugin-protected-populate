/**
 *
 * List
 *
 */

/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import ComponentList from '../ComponentList';
import ListRow from '../ListRow';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function SelectRender({
  isMain,
  item,
  contentTypes,
  components,
  selectedRows,
  updateSelectedRows,
  autoReload,
}) {
  const { type, name } = item;
  let value =
    typeof selectedRows.on !== 'undefined' && typeof selectedRows.on[name] !== 'undefined';

  const setValue = (value) => {
    if (value == true) {
      if (typeof selectedRows.on == 'undefined') {
        selectedRows.on = {};
      }
      selectedRows.on[name] = {};
      updateSelectedRows();
    } else if (
      typeof selectedRows.on !== 'undefined' &&
      typeof selectedRows.on[name] !== 'undefined'
    ) {
      delete selectedRows.on[name];
      updateSelectedRows();
    }
  };
  if (value === false) {
    return (
      <React.Fragment key={name}>
        <ListRow
          {...item}
          isMain={isMain}
          value={value}
          setValue={setValue}
          autoReload={autoReload}
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment key={name}>
      <ListRow
        {...item}
        isMain={isMain}
        value={value}
        setValue={setValue}
        autoReload={autoReload}
      />

      {type === 'component' && (
        <ComponentList
          {...item}
          targetUid={item.component}
          contentTypes={contentTypes}
          components={components}
          selectedRows={selectedRows['on'][name]}
          updateSelectedRows={updateSelectedRows}
          autoReload={autoReload}
        />
      )}
    </React.Fragment>
  );
}

export default SelectRender;
