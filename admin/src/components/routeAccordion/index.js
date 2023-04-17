/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useState } from 'react';
import {
  Select,
  Box,
  Accordion,
  AccordionToggle,
  AccordionContent,
  Stack,
  IconButton,
  BaseCheckbox,
  AccordionGroup,
  Flex,
  TextButton,
  Typography,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@strapi/design-system';
import { Trash, Plus } from '@strapi/icons';
import List from '../List';
import RoleAccordion from '../roleAccordion';
import Option from './Option';
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
    <Accordion expanded={expandedID === name} onToggle={handleToggle(name)} size="S">
      <AccordionToggle
        action={
          <Stack horizontal spacing={0}>
            <IconButton
              onClick={() => {
                if (!autoReload) {
                  return;
                }
                delete selectedCheckboxes[routeName];
                updateSelectedCheckboxes();
              }}
              label="Delete"
              icon={<Trash />}
            />
          </Stack>
        }
        title={name}
        togglePosition="left"
      />
      <AccordionContent>
        <Box padding={3} style={{ maxHeight: '100%' }}>
          <Select
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
            {contentTypeNames.map((object, i) => {
              if (!autoReload && selectedCheckboxes[routeName]['content-type'] !== object) {
                return;
              }
              return (
                <Option value={object} key={i}>
                  {object}
                </Option>
              );
            })}
          </Select>
          <br />
          <Typography variant="sigma">Enable roles from user and permissions</Typography>
          <BaseCheckbox
            name="Enable roles form user and permissions"
            onValueChange={() => changeRolesEnabled()}
            value={rolesEnabled}
          />
          <br />
          {rolesEnabled ? (
            <>
              <AccordionGroup label="Roles">
                {isVisible && (
                  <ModalLayout
                    onClose={() => handleSetIsVisible((prev) => !prev)}
                    labelledBy="title"
                  >
                    <ModalHeader>
                      <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
                        Clone Menu
                      </Typography>
                    </ModalHeader>
                    <ModalBody>
                      <Select
                        label="select roles to clone to"
                        value={modelRolesCloneTo}
                        onChange={(value) => {
                          setModelRolesCloneTo(value);
                        }}
                        multi
                        withTags
                      >
                        {roles.map(function (role) {
                          if (role.type !== modelRoleCloneFrom) {
                            return (
                              <Option value={role.type} key={role.type}>
                                {role.name}
                              </Option>
                            );
                          }
                        })}
                      </Select>
                    </ModalBody>
                    <ModalFooter
                      startActions={
                        <Button
                          onClick={() => handleSetIsVisible((prev) => !prev)}
                          variant="tertiary"
                        >
                          Cancel
                        </Button>
                      }
                      endActions={
                        <Button
                          disabled={modelRoleCloneFrom === '' || modelRolesCloneTo.length === 0}
                          onClick={() => handleFinish()}
                        >
                          Finish
                        </Button>
                      }
                    />
                  </ModalLayout>
                )}
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
              </AccordionGroup>
            </>
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
      </AccordionContent>
    </Accordion>
  );
};

export default RouteAccordion;
