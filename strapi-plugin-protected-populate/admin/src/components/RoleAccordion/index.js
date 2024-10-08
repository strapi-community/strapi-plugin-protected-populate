import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Accordion,
  AccordionToggle,
  AccordionContent,
  Stack,
  IconButton,
} from '@strapi/design-system';
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
    <Accordion expanded={expandedID === role.type} onToggle={handleToggle(role.type)} size="S">
      <AccordionToggle
        action={
          <Stack horizontal spacing={0}>
            <IconButton
              onClick={() => handleSetIsVisible(true, role.type)}
              label="Clone"
              icon={<Duplicate />}
            />
          </Stack>
        }
        title={role.name}
        togglePosition="left"
      />
      <AccordionContent>
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
      </AccordionContent>
    </Accordion>
  );
};

export default RoleAccordion;
