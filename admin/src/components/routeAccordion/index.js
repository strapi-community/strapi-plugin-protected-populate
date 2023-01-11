/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

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
} from '@strapi/design-system';
import { Trash, Plus } from '@strapi/icons';
import List from '../List';
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
  const publicRole = roles[roles.findIndex((role) => role.type === 'public')];
  const [values, setValues] = useState([]);

  const changeRolesEnabled = () => {
    if (rolesEnabled) {
      const publicIndex = selectedCheckboxes[routeName]['roles'].findIndex((data) => {
        if (typeof publicRole === 'undefined') {
          return false;
        }
        return data.ids.includes(publicRole.id);
      });

      selectedCheckboxes[routeName]['populate'] =
        selectedCheckboxes[routeName]['roles'][publicIndex]['populate'];
      selectedCheckboxes[routeName]['fields'] =
        selectedCheckboxes[routeName]['roles'][publicIndex]['fields'];
      delete selectedCheckboxes[routeName]['roles'];
    } else {
      //enable roles
      selectedCheckboxes[routeName]['roles'] = [
        {
          ids: [publicRole.id],
          populate: selectedCheckboxes[routeName]['populate'],
          fields: selectedCheckboxes[routeName]['fields'],
        },
      ];
      delete selectedCheckboxes[routeName]['populate'];
      delete selectedCheckboxes[routeName]['fields'];
    }
    updateSelectedCheckboxes();
  };
  const idsToNames = (ids) => {
    let names = [];
    ids.forEach((id) => {
      const index = roles.findIndex((role) => role.id === id);
      if (index !== -1) {
        names.push(roles[index].name);
      }
    });
    return names;
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
              <AccordionGroup
                label="Routes"
                footer={
                  <Flex justifyContent="center" height="48px" background="neutral150">
                    <TextButton
                      onClick={() => {
                        selectedCheckboxes[routeName]['roles'].push({ ids: [] });
                        updateSelectedCheckboxes();
                      }}
                      disabled={!autoReload}
                      startIcon={<Plus />}
                    >
                      Add a new roleGroup
                    </TextButton>
                  </Flex>
                }
              >
                {selectedCheckboxes[routeName]['roles'].map((data, index) => {
                  return (
                    <Accordion
                      expanded={values.includes(index)}
                      onToggle={() => {
                        if (values.includes(index)) {
                          setValues(values.filter((value) => value !== index));
                        } else {
                          setValues([index, ...values]);
                        }
                      }}
                      size="S"
                    >
                      <AccordionToggle
                        action={
                          <Stack horizontal spacing={0}>
                            {typeof publicRole !== 'undefined' &&
                              !data.ids.includes(publicRole.id) && (
                                <IconButton onClick={() => {}} label="Delete" icon={<Trash />} />
                              )}
                          </Stack>
                        }
                        title={idsToNames(data.ids).join()}
                        togglePosition="left"
                      />
                      <AccordionContent>
                        <Stack spacing={11}>
                          <Select
                            id="roleSelection"
                            label="Choose your roles"
                            placeholder="None"
                            onClear={() => {
                              let ids = [];
                              if (data.ids.includes(publicRole.id)) {
                                ids.push(publicRole.id);
                              }
                              selectedCheckboxes[routeName].roles[index].ids = ids;
                              updateSelectedCheckboxes();
                            }}
                            clearLabel="Clear the roles"
                            value={selectedCheckboxes[routeName].roles[index].ids}
                            onChange={(values) => {
                              if (
                                (data.ids.includes(publicRole.id) === true &&
                                  values.includes(publicRole.id) === false) ||
                                (data.ids.includes(publicRole.id) === false &&
                                  values.includes(publicRole.id) === true)
                              ) {
                                return;
                              }
                              let checkedIds = [];
                              let failed = false;
                              selectedCheckboxes[routeName]['roles'].map((roleIds, index2) => {
                                let ids = roleIds.ids;
                                if (index2 === index) {
                                  ids = values;
                                }
                                ids.forEach((id) => {
                                  if (checkedIds.indexOf(id) === -1) {
                                    checkedIds.push(id);
                                  } else {
                                    failed = true;
                                  }
                                });
                              });
                              if (failed === true) {
                                return;
                              }
                              selectedCheckboxes[routeName].roles[index].ids = values;
                              updateSelectedCheckboxes();
                            }}
                            disabled={!autoReload}
                            selectButtonTitle="Down Button"
                            multi
                            withTags
                          >
                            {roles.map((role) => {
                              const roleIndex = selectedCheckboxes[routeName]['roles'].findIndex(
                                (data) => data.ids.includes(role.id)
                              );
                              return (
                                <Option
                                  disabled={
                                    (roleIndex !== -1 && index !== roleIndex) ||
                                    role.id === publicRole.id
                                  }
                                  value={role.id}
                                >
                                  {role.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Stack>
                        <Box background="neutral0" shadow="filterShadow" hasRadius>
                          <List
                            items={typeInfo}
                            targetUid={typeInfo.uid}
                            contentTypes={contentTypes}
                            components={components}
                            isMain
                            selectedRows={selectedCheckboxes[routeName]['roles'][index]}
                            updateSelectedRows={updateSelectedCheckboxes}
                            autoReload={autoReload}
                          />
                        </Box>
                      </AccordionContent>
                    </Accordion>
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
                isMain
                selectedRows={selectedCheckboxes[routeName]}
                updateSelectedRows={updateSelectedCheckboxes}
                autoReload={autoReload}
              />
            </Box>
          )}
        </Box>
      </AccordionContent>
    </Accordion>
  );
};

export default RouteAccordion;
