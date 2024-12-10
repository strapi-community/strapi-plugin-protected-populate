import React, { useState } from 'react';
import ComponentList from '../ComponentList';
import ListRow from '../ListRow';
import DynamicZoneList from '../DynamicZoneList';


function SelectRender({
  isMain,
  item,
  contentTypes,
  components,
  selectedRows,
  updateSelectedRows,
  autoReload,
}) {
  let value;
  const { type, name } = item;
  if (['component', 'relation', 'dynamiczone', 'media'].includes(type)) {
    value =
      typeof selectedRows.populate !== 'undefined' &&
      typeof selectedRows.populate[name] !== 'undefined';
  } else {
    value =
      typeof selectedRows.fields !== 'undefined' &&
      selectedRows.fields.findIndex((field) => field === name) !== -1;
  }
  const setValue = (value) => {
    if (['component', 'relation', 'dynamiczone', 'media'].includes(type)) {
      if (value == true) {
        if (typeof selectedRows.populate == 'undefined') {
          selectedRows.populate = {};
        }
        selectedRows.populate[name] = {};
        if (type === 'dynamiczone') {
          selectedRows.populate[name]['on'] = {};
        }
        updateSelectedRows();
      } else if (
        typeof selectedRows.populate !== 'undefined' &&
        typeof selectedRows.populate[name] !== 'undefined'
      ) {
        delete selectedRows.populate[name];
        if (selectedRows.populate.length === 0) {
          delete selectedRows.populate;
        }
        updateSelectedRows();
      }
    } else {
      if (value == true) {
        if (typeof selectedRows.fields == 'undefined') {
          selectedRows.fields = [];
        }
        selectedRows.fields.push(name);
        updateSelectedRows();
      } else if (
        typeof selectedRows.fields !== 'undefined' &&
        selectedRows.fields.findIndex((field) => field === name) !== -1
      ) {
        var index = selectedRows.fields.indexOf(name);
        if (index !== -1) {
          selectedRows.fields.splice(index, 1);
        }
        if (selectedRows.fields.length === 0) {
          delete selectedRows.fields;
        }
        updateSelectedRows();
      }
    }
  };
  if (type === 'relation' && typeof item.target !== 'string') {
    return <></>;
  }

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
          selectedRows={selectedRows.populate[name]}
          updateSelectedRows={updateSelectedRows}
          autoReload={autoReload}
        />
      )}
      {type === 'relation' && (
        <ComponentList
          {...item}
          targetUid={item.target}
          contentTypes={contentTypes}
          components={components}
          selectedRows={selectedRows.populate[name]}
          updateSelectedRows={updateSelectedRows}
          autoReload={autoReload}
        />
      )}
      {type === 'media' && (
        <ComponentList
          {...item}
          targetUid={'plugin::upload.file'}
          contentTypes={contentTypes}
          components={components}
          selectedRows={selectedRows.populate[name]}
          updateSelectedRows={updateSelectedRows}
          autoReload={autoReload}
        />
      )}

      {type === 'dynamiczone' && (
        <DynamicZoneList
          item={item}
          selectedRows={selectedRows.populate[name]}
          updateSelectedRows={updateSelectedRows}
          contentTypes={contentTypes}
          components={components}
          autoReload={autoReload}
        />
      )}
    </React.Fragment>
  );
}

export default SelectRender;
