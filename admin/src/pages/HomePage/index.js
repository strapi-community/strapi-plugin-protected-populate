/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {
  useAppInfos,
  useAutoReloadOverlayBlocker,
} from '@strapi/helper-plugin';
import { Box, Loader, Alert, AccordionGroup, HeaderLayout, ModalLayout, ModalBody, ModalHeader, ModalFooter, Button, ContentLayout, Stack, Typography, Select, Option, Flex, TextButton } from '@strapi/design-system';
import { Plus, Check } from '@strapi/icons';
import axios from '../../utils/axiosInstance';
import RouteAccordion from '../../components/routeAccordion';
import serverRestartWatcher from '../../utils/serverRestartWatcher';
const HomePage = () => {

  const { lockAppWithAutoreload, unlockAppWithAutoreload } = useAutoReloadOverlayBlocker();
  const { autoReload } = useAppInfos();
  const [routes, setRoutes] = useState([])
  const [contentTypeNames, setContentTypeNames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [expandedID, setExpandedID] = useState(null);

  const [modelRoute, setModelRoute] = useState("")
  const [modelContentType, setModelContentType] = useState("");

  const [contentTypes, setContentTypes] = useState([])
  const [components, setComponents] = useState([]);
  const [oldData, setOldData] = useState("{}");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState("{}");
  const [isVisible, setIsVisible] = useState(false);
  let selectedCheckboxesClone = JSON.parse(selectedCheckboxes)
  function updateSelectedCheckboxes() {
    const json = JSON.stringify(selectedCheckboxesClone)
    setSelectedCheckboxes(json)
  }
  useEffect(async () => {
    setLoading(true)
    await await Promise.all([axios.get("/protected-populate/routes").then(response => {
      response.data.sort((a, b) => {
        const nameA = a.methods.at(-1) + " " + a.path
        const nameB = b.methods.at(-1) + " " + b.path
        return nameA.localeCompare(nameB)
      })
      setRoutes(response.data)
    }).catch(error => {
      setError(error)
    })
    ], [
      axios.get("/protected-populate/content-types").then(response => {
        setContentTypeNames(response.data)
      }).catch(error => {
        setError(error)
      })], [
      axios.get("/content-type-builder/content-types").then(response => {
        setContentTypes(response.data.data)
      }).catch(error => {
        setError(error)
      })], [
      axios.get("/content-type-builder/components").then(response => {
        setComponents(response.data.data)
      }).catch(error => {
        setError(error)
      })], [
      axios.get("/protected-populate/data").then(response => {
        setOldData(JSON.stringify(response.data))
        setSelectedCheckboxes(JSON.stringify(response.data))
      }).catch(error => {
        setError(error)
      })])
    setLoading(false)
  }, [])
  if (error) {
    return <Alert closeLable="Close alert" title="Error fetching routes" variant="danger">
      {error.toString()}
    </Alert>
  }
  if (loading) return <Loader />

  const handleToggle = id => () => {
    setExpandedID(s => s === id ? null : id);
  };
  const handleSetIsVisible = (value) => {
    setModelContentType("")
    setModelRoute("")
    setIsVisible(value)
  }
  const handleFinish = () => {
    let data = JSON.parse(selectedCheckboxes)
    data[modelRoute] = {}
    data[modelRoute]["content-type"] = modelContentType
    setSelectedCheckboxes(JSON.stringify(data))
    setModelContentType("")
    setModelRoute("")
    setIsVisible(false)
  }
  const submitData =async () => {
    lockAppWithAutoreload();
    await axios.put("/protected-populate/data", selectedCheckboxes).then(() => {
      setOldData(selectedCheckboxes)
    }).catch(error => {
      setError(error)
    })
    // Make sure the server has restarted
    await serverRestartWatcher(true);

    // Unlock the app
    await unlockAppWithAutoreload();
  };
  return <div>
    <Box background="neutral100">
      <HeaderLayout primaryAction={
        <Stack horizontal spacing={2}>
          <Button
            startIcon={<Check />}
            onClick={() => submitData()}
            type="submit"
            disabled={oldData === selectedCheckboxes}
          >Save</Button>
        </Stack>} title="Protected Routes" as="h2" />
      {isVisible && <ModalLayout onClose={() => handleSetIsVisible(prev => !prev)} labelledBy="title">
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            Title
          </Typography>
        </ModalHeader>
        <ModalBody>
          <Select
            label="select route"
            value={modelRoute}
            onChange={(value) => {
              setModelRoute(value)
            }}>
            {routes.map(function (route, i) {
              const name = route.methods.at(-1) + " " + route.path
              if (typeof selectedCheckboxesClone[name] === "undefined") {
                return <Option value={name} key={i} >{name}</Option>;
              }
            })}
          </Select>
          <br />
          <Select
            label="select content type used"
            value={modelContentType}
            onChange={(value) => {
              setModelContentType(value)
            }}>
            {contentTypeNames.map(function (contentType, i) {
              return <Option value={contentType} key={i} >{contentType}</Option>;
            })}
          </Select>
        </ModalBody>
        <ModalFooter startActions={<Button onClick={() => handleSetIsVisible(prev => !prev)} variant="tertiary">
          Cancel
        </Button>} endActions={
          <Button disabled={modelContentType === "" || modelRoute === ""} onClick={() => handleFinish()}>Finish</Button>
        } />
      </ModalLayout>}
    </Box>;
    <ContentLayout>
      <Box padding={8} background="neutral0">
        <AccordionGroup label="Routes"
          footer={<Flex justifyContent="center" height="48px" background="neutral150">
            <TextButton onClick={() => handleSetIsVisible(true)} startIcon={<Plus />}>
              Add a new protected route
            </TextButton>
          </Flex>}>
          {Object.keys(selectedCheckboxesClone).map(function (key, i) {
            return <RouteAccordion autoReload={autoReload} updateSelectedCheckboxes={updateSelectedCheckboxes} selectedCheckboxes={selectedCheckboxesClone} handleToggle={handleToggle} expandedID={expandedID} routeName={key} components={components} contentTypes={contentTypes} contentTypeNames={contentTypeNames} key={i} />
          })}
        </AccordionGroup>
      </Box>
    </ContentLayout>
  </div>;
};

export default HomePage;
