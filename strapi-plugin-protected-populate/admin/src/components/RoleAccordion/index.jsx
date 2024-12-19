import React from 'react';
import { Box, Accordion, Modal, IconButton } from '@strapi/design-system';
import { Duplicate } from '@strapi/icons';
import List from '../List';
const RoleAccordion = ({
  role,
  isMain,
  items,
  targetUid,
  contentTypes,
  components,
  selectedRows,
  updateSelectedRows,
  autoReload,
  handleToggle,
  handleSetIsVisible,
  expandedID,
}) => {
  if (selectedRows[role.type] === null) {
    selectedRows[role.type] = {};
    selectedRows[role.type]['populate'] = {};
    selectedRows[role.type]['fields'] = {};
  }
  console.log(expandedID);
  console.log(role.type);
  return (
    <Accordion.Item value={role.type} onToggle={handleToggle(role.type)} size="S">
      <Accordion.Header>
        <Accordion.Trigger description="Your personal information">{role.name}</Accordion.Trigger>
        <Accordion.Actions>
          <Modal.Trigger>
          <IconButton onClick={() => handleSetIsVisible(true, role.type)} label="Clone">
            <Duplicate />
          </IconButton>
          </Modal.Trigger>
        </Accordion.Actions>
      </Accordion.Header>
      <Accordion.Content>
        <Box background="neutral0" shadow="filterShadow" hasRadius>
          <List
            items={items}
            targetUid={targetUid}
            contentTypes={contentTypes}
            components={components}
            selectedRows={selectedRows[role.type]}
            updateSelectedRows={updateSelectedRows}
            autoReload={autoReload}
            isMain={isMain}
          />
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default RoleAccordion;
