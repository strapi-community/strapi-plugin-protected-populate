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
import SelectRender from '../SelectRender';
function DynamicZoneList({
  item,
  targetUid,
  isFromDynamicZone,
  components,
  contentTypes,
  selectedRows,
  updateSelectedRows
}) {
  let data = []
  data.schema = {}
  data.schema.attributes = {}
  item.components.map((component, i) => {
    console.log(component)
    data.schema.attributes[component] = {
      "type": "component",
      "repeatable": false,
      "component": component,
      "required": false
    }
  })
  return (
    <Tr isChildOfDynamicZone={isFromDynamicZone} className="component-row">
      <td colSpan={12}>
        <SelectRender
          isMain={isMain}
          item={item}
          targetUid={targetUid}
          contentTypes={contentTypes}
          components={components}
          selectedRows={selectedRows}
          updateSelectedRows={updateSelectedRows}
        />
      </td>
    </Tr>
  );
}

export default DynamicZoneList;
