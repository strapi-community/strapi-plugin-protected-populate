/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

import { Select, Option, Box, Accordion, AccordionToggle, AccordionContent, Stack, IconButton } from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import List from '../List';
const RouteAccordion = ({autoReload, routeName, handleToggle, expandedID, contentTypes, components, contentTypeNames,updateSelectedCheckboxes,selectedCheckboxes}) => {
  const name = routeName
  let typeInfo
  if (selectedCheckboxes[routeName]["content-type"].includes("::")) {
    const index = contentTypes.findIndex((data) => data.uid ==  selectedCheckboxes[routeName]["content-type"])
    typeInfo = contentTypes[index]
  } else {
    const index = components.findIndex((data) => data.uid ==  selectedCheckboxes[routeName]["content-type"])
    typeInfo = components[index]
  }
  return (
    <Accordion expanded={expandedID === name} onToggle={handleToggle(name)} size="S">
      <AccordionToggle action={<Stack horizontal spacing={0}>
        <IconButton onClick={() => { 
          delete selectedCheckboxes[routeName]
          updateSelectedCheckboxes()
         }} label="Delete" icon={<Trash />} />
      </Stack>} title={name} togglePosition="left" />
      <AccordionContent>
        <Box padding={3} style={{ maxHeight: "100%" }}>
          <Select 
          label="select content type used" 
          value={selectedCheckboxes[routeName]["content-type"]} 
          onChange={(value) => {
            selectedCheckboxes[routeName]["content-type"] = value
            updateSelectedCheckboxes()
          }}>
            {contentTypeNames.map(function (object, i) {
              return <Option value={object} key={i} >{object}</Option>;
            })}
          </Select>
        </Box>
        { selectedCheckboxes[routeName]["content-type"] !== "" && <Box background="neutral0" shadow="filterShadow" hasRadius>
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
        </Box>}
      </AccordionContent>
    </Accordion>
  );
};

export default RouteAccordion;
