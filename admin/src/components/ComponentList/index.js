/**
 *
 * ComponentList
 *
 */
/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';
import List from '../List';
import Tr from '../Tr';

function ComponentList({
  targetUid,
  isFromDynamicZone,
  components,
  contentTypes,
  selectedRows,
  updateSelectedRows,
  autoReload,
}) {
  let typeInfo;
  if (targetUid.includes('::')) {
    const index = contentTypes.findIndex((data) => data.uid == targetUid);
    typeInfo = contentTypes[index];
  } else {
    const index = components.findIndex((data) => data.uid == targetUid);
    typeInfo = components[index];
  }
  return (
    <Tr isChildOfDynamicZone={isFromDynamicZone} className="component-row">
      <td colSpan={12}>
        <List
          items={typeInfo}
          targetUid={targetUid}
          contentTypes={contentTypes}
          components={components}
          isSub
          selectedRows={selectedRows}
          updateSelectedRows={updateSelectedRows}
          autoReload={autoReload}
        />
      </td>
    </Tr>
  );
}

ComponentList.defaultProps = {
  component: null,
  customRowComponent: null,
  firstLoopComponentUid: null,
  isFromDynamicZone: false,
  isNestedInDZComponent: false,
};

ComponentList.propTypes = {
  component: PropTypes.string,
  customRowComponent: PropTypes.func,
  firstLoopComponentUid: PropTypes.string,
  isFromDynamicZone: PropTypes.bool,
  isNestedInDZComponent: PropTypes.bool,
};

export default ComponentList;
