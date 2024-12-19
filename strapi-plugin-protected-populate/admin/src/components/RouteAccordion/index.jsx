/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useState } from 'react';
import { Select } from '@strapi/ui-primitives';
import {
  Box,
  Accordion,
  MultiSelect,
  MultiSelectOption,
  IconButton,
  Checkbox,
  Typography,
  Modal,
  Button,
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import List from '../List';
import RoleAccordion from '../RoleAccordion';
const RouteAccordion = ({
  autoReload,
  routeName,
  handleToggle,
  expandedID,
  contentTypes,
  components,
  contentTypeNames,
  updateSelectedCheckboxes,
  selectedCheckboxes,
  roles,
}) => {
  const [expandedIDRole, setExpandedIDRole] = useState(null);
  const handleToggleRole = (id) => () => {
    setExpandedIDRole((s) => (s === id ? null : id));
  };

  const [isVisible, setIsVisible] = useState(false);
  const [modelRoleCloneFrom, setModelRoleCloneFrom] = useState(null);
  const [modelRolesCloneTo, setModelRolesCloneTo] = useState([]);

  const handleSetIsVisible = (value, modelRoleCloneFrom) => {
    setModelRoleCloneFrom(modelRoleCloneFrom);
    setModelRolesCloneTo([]);
    setIsVisible(value);
  };
  const handleFinish = () => {
    for (const modelRole of modelRolesCloneTo) {
      selectedCheckboxes[routeName]['roles'][modelRole] = JSON.parse(
        JSON.stringify(selectedCheckboxes[routeName]['roles'][modelRoleCloneFrom])
      );
    }
    handleSetIsVisible(false);
  };

  const name = routeName;
  let typeInfo;
  if (selectedCheckboxes[routeName]['content-type'].includes('::')) {
    const index = contentTypes.findIndex(
      (data) => data.uid == selectedCheckboxes[routeName]['content-type']
    );
    typeInfo = contentTypes[index];
  } else {
    const index = components.findIndex(
      (data) => data.uid == selectedCheckboxes[routeName]['content-type']
    );
    typeInfo = components[index];
  }
  const rolesEnabled = typeof selectedCheckboxes[routeName]['roles'] !== 'undefined';

  const changeRolesEnabled = () => {
    console.log('Test123');
    if (rolesEnabled) {
      selectedCheckboxes[routeName]['populate'] =
        selectedCheckboxes[routeName]['roles']['public']['populate'];
      selectedCheckboxes[routeName]['fields'] =
        selectedCheckboxes[routeName]['roles']['public']['fields'];
      delete selectedCheckboxes[routeName]['roles'];
    } else {
      //enable roles
      selectedCheckboxes[routeName]['roles'] = {};
      for (const role of roles) {
        selectedCheckboxes[routeName]['roles'][role.type] = {};
        selectedCheckboxes[routeName]['roles'][role.type].populate =
          selectedCheckboxes[routeName]['populate'];
        selectedCheckboxes[routeName]['roles'][role.type].fields =
          selectedCheckboxes[routeName]['fields'];
      }
      delete selectedCheckboxes[routeName]['populate'];
      delete selectedCheckboxes[routeName]['fields'];
    }
    updateSelectedCheckboxes();
  };

  return (
    <Accordion.Item value={name} onToggle={handleToggle(name)} size="S">
      <Accordion.Header>
        <Accordion.Trigger description="Your personal information">{name}</Accordion.Trigger>
        <Accordion.Actions>
          <IconButton
            onClick={() => {
              if (!autoReload) {
                return;
              }
              delete selectedCheckboxes[routeName];
              updateSelectedCheckboxes();
            }}
            label="Delete"
          >
            <Trash />
          </IconButton>
        </Accordion.Actions>
      </Accordion.Header>
      <Accordion.Content>
        <Box padding={3} style={{ maxHeight: '100%' }}>
          <Select.Root
            label="select content type used"
            value={selectedCheckboxes[routeName]['content-type']}
            onChange={(value) => {
              if (!autoReload) {
                return;
              }
              selectedCheckboxes[routeName]['content-type'] = value;
              updateSelectedCheckboxes();
            }}
          >
            <Select.Content>
              {contentTypeNames.map((object, i) => {
                if (!autoReload && selectedCheckboxes[routeName]['content-type'] !== object) {
                  return;
                }
                return (
                  <Select.Item value={object} key={i}>
                    {object}
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>
          <br />
          <Typography variant="sigma">Enable roles from user and permissions</Typography>
          <Checkbox
            name="Enable roles form user and permissions"
            onCheckedChange={() => changeRolesEnabled()}
            checked={rolesEnabled}
            disabled={!autoReload}
          />
          <br />
          {rolesEnabled ? (
            <Modal.Root >
              <Accordion.Root label="Roles">
                  <Modal.Content>
                    <Modal.Header>
                      <Modal.Title>Clone Menu</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                      <MultiSelect
                        label="select roles to clone to"
                        value={modelRolesCloneTo}
                        onChange={(value) => {
                          setModelRolesCloneTo(value);
                        }}
                        multi
                        withTags
                      >
                        {autoReload &&
                          roles.map(function (role) {
                            if (role.type !== modelRoleCloneFrom) {
                              return (
                                <MultiSelectOption value={role.type} key={role.type}>
                                  {role.name}
                                </MultiSelectOption>
                              );
                            }
                          })}
                      </MultiSelect>
                    </Modal.Body>
                    <Modal.Footer>
                      <Modal.Close>
                        <Button variant="tertiary">Cancel</Button>
                      </Modal.Close>
                      <Button
                        disabled={modelRoleCloneFrom === '' || modelRolesCloneTo.length === 0}
                        onClick={() => handleFinish()}
                      >
                        Finish
                      </Button>
                    </Modal.Footer>
                    </Modal.Content>
                {roles.map((role, i) => {
                  return (
                    <RoleAccordion
                      role={role}
                      items={typeInfo}
                      targetUid={typeInfo.uid}
                      contentTypes={contentTypes}
                      components={components}
                      selectedRows={selectedCheckboxes[routeName]['roles']}
                      updateSelectedRows={updateSelectedCheckboxes}
                      autoReload={autoReload}
                      key={i}
                      handleToggle={handleToggleRole}
                      expandedID={expandedIDRole}
                      handleSetIsVisible={handleSetIsVisible}
                      isMain
                    />
                  );
                })}
              </Accordion.Root>
            </Modal.Root>
          ) : (
            <Box background="neutral0" shadow="filterShadow" hasRadius>
              <List
                items={typeInfo}
                targetUid={typeInfo.uid}
                contentTypes={contentTypes}
                components={components}
                selectedRows={selectedCheckboxes[routeName]}
                updateSelectedRows={updateSelectedCheckboxes}
                autoReload={autoReload}
                isMain
              />
            </Box>
          )}
        </Box>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default RouteAccordion;
