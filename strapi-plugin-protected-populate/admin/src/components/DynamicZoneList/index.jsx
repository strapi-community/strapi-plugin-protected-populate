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
import SelectRender from './SelectRender';
import BoxWrapper from './BoxWrapper';
import { Box } from '@strapi/design-system';
function DynamicZoneList({
  item,
  targetUid,
  isFromDynamicZone,
  components,
  contentTypes,
  selectedRows,
  updateSelectedRows,
  autoReload,
}) {
  let data = [];
  data.schema = {};
  data.schema.attributes = {};
  return (
    <Tr isChildOfDynamicZone={isFromDynamicZone} className="component-row">
      <td colSpan={12}>
        <BoxWrapper>
          <Box paddingLeft={6}>
            <table>
              <tbody>
                {item.components.map((component, i) => {
                  const data = {
                    type: 'component',
                    repeatable: false,
                    component: component,
                    required: false,
                    name: component,
                  };
                  return (
                    <SelectRender
                      item={data}
                      targetUid={component}
                      contentTypes={contentTypes}
                      components={components}
                      isSub
                      selectedRows={selectedRows}
                      updateSelectedRows={updateSelectedRows}
                      autoReload={autoReload}
                    />
                  );
                })}
              </tbody>
            </table>
          </Box>
        </BoxWrapper>
      </td>
    </Tr>
  );
}

export default DynamicZoneList;
