/**
 *
 * List
 *
 */

/* eslint-disable import/no-cycle */
import React from 'react';
import { Box, Typography } from '@strapi/design-system';
import SelectRender from '../SelectRender';
import BoxWrapper from './BoxWrapper';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function List({
  isMain,
  items,
  targetUid,
  contentTypes,
  components,
  selectedRows,
  updateSelectedRows,
  autoReload,
}) {
  if (targetUid.includes('::')) {
    items.schema.attributes.createdAt = {
      type: 'datetime',
    };
    items.schema.attributes.updatedAt = {
      type: 'datetime',
    };
    items.schema.attributes.id = {
      type: 'id',
    };
    items.schema.attributes.documentId = {
      type: 'id',
    };
  }
  if (items.schema.populateCreatorFields) {
    (items.schema.attributes.createdBy = {
      type: 'relation',
      relation: 'oneToMany',
      target: 'admin::user',
    }),
      items.schema.attributes.updatedBy = {
        type: 'relation',
        relation: 'oneToMany',
        target: 'admin::user',
      };
  }
  if (items.schema.draftAndPublish) {
    items.schema.attributes.publishedAt = {
      type: 'datetime',
    };
  }
  if (items.schema?.pluginOptions?.i18n?.localized === true) {
    items.schema.attributes.localizations = {
      type: 'relation',
      relation: 'oneToMany',
      target: items.uid,
    };
    items.schema.attributes.locale = {
      type: 'text',
    };
  }
  return (
    <BoxWrapper>
      <Box
        paddingLeft={6}
        paddingRight={isMain ? 6 : 0}
        {...(isMain && { style: { overflowX: 'auto' } })}
      >
        <table>
          {isMain && (
            <thead>
              <tr>
                <th>
                  <Typography variant="sigma" textColor="neutral600">
                    Name
                  </Typography>
                </th>
                <th colSpan="2">
                  <Typography variant="sigma" textColor="neutral600">
                    Type
                  </Typography>
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {Object.entries(items.schema.attributes).map(([key, item]) => {
              item.name = key;
              item.plugin;
              return (
                <SelectRender
                  isMain={isMain}
                  item={item}
                  targetUid={targetUid}
                  contentTypes={contentTypes}
                  components={components}
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
  );
}

export default List;
