/*
 *
 * HomePage
 *
 */
import { useState } from 'react';
import { useAppInfo, useFetchClient } from '@strapi/strapi/admin';
import {
  Box,
  Loader,
  Alert,
  Accordion,
  Modal,
  Button,
  Combobox,
  ComboboxOption,
  Flex,
  TextButton,
  Typography,
} from '@strapi/design-system';
import { Plus, Check } from '@strapi/icons';
import RouteAccordion from '../../components/RouteAccordion';
import serverRestartWatcher from '../../utils/serverRestartWatcher';
import { Layouts } from '@strapi/admin/strapi-admin';
import { useQuery } from 'react-query';

export default function HomePage() {
  //const { lockAppWithAutoreload, unlockAppWithAutoreload } = useAutoReloadOverlayBlocker();
  const { get, put } = useFetchClient();
  const autoReload = useAppInfo('ProtectedPopulate', (state) => state.autoReload);
  const [expandedID, setExpandedID] = useState(null);

  const [modelRoute, setModelRoute] = useState('');
  const [modelContentType, setModelContentType] = useState('');
  const [oldData, setOldData] = useState('{}');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState('{}');
  function updateSelectedCheckboxes() {
    const json = JSON.stringify(selectedCheckboxesClone);
    setSelectedCheckboxes(json);
  }
  const routesData = useQuery(['protected-routes'], async () => {
    const res = await get('/protected-populate/routes');
    const { data } = res;
    data.sort((a, b) => {
      const nameA = a.methods.at(-1) + ' ' + a.path;
      const nameB = b.methods.at(-1) + ' ' + b.path;
      return nameA.localeCompare(nameB);
    });
    return data;
  });
  const contenttypesData = useQuery(['protected-content-types'], async () => {
    const res = await get('/protected-populate/content-types');
    const { data } = res;
    return data;
  });
  const contenttypes2Data = useQuery(['protected-content-types2'], async () => {
    const res = await get('/content-type-builder/content-types');
    const { data } = res;
    return data.data;
  });
  const componentsData = useQuery(['protected-components'], async () => {
    const res = await get('/content-type-builder/components');
    const { data } = res;
    return data.data;
  });
  const dataData = useQuery(['protected-data'], async () => {
    const res = await get('/protected-populate/data');
    const { data } = res;
    setSelectedCheckboxes(JSON.stringify(data));
    setOldData(JSON.stringify(data));
    return data;
  });
  const roleData = useQuery(['protected-roles'], async () => {
    const res = await get('/users-permissions/roles');
    const { data } = res;
    return data;
  });

  if (
    routesData.isError ||
    contenttypesData.isError ||
    contenttypesData.isError ||
    contenttypes2Data.isError ||
    componentsData.isError ||
    dataData.isError ||
    roleData.isError
  ) {
    return (
      <Alert closeLable="Close alert" title="Error fetching routes" variant="danger">
        {error.toString()}
      </Alert>
    );
  }
  if (
    routesData.isLoading ||
    contenttypesData.isLoading ||
    contenttypesData.isLoading ||
    contenttypes2Data.isLoading ||
    componentsData.isLoading ||
    dataData.isLoading ||
    roleData.isLoading
  )
    return <Loader />;
  let selectedCheckboxesClone = JSON.parse(selectedCheckboxes);
  const handleToggle = (id) => () => {
    setExpandedID((s) => (s === id ? null : id));
  };
  const handleFinish = () => {
    let data = JSON.parse(selectedCheckboxes);
    data[modelRoute] = {};
    data[modelRoute]['content-type'] = modelContentType;
    setSelectedCheckboxes(JSON.stringify(data));
    setModelContentType('');
    setModelRoute('');
  };
  const submitData = async () => {
    //lockAppWithAutoreload();
    await put('/protected-populate/data', JSON.parse(selectedCheckboxes))
      .then(() => {
        setOldData(selectedCheckboxes);
      })
      .catch((error) => {
        setError(error);
      });
    // Make sure the server has restarted
    await serverRestartWatcher(true);

    // Unlock the app
    //await unlockAppWithAutoreload();
  };
  //console.log(autoReload)
  console.log(roleData.data.roles);
  return (
    <div>
      <Layouts.Header
        primaryAction={
          <Flex horizontal spacing={2}>
            <Button
              startIcon={<Check />}
              onClick={() => submitData()}
              type="submit"
              disabled={oldData === selectedCheckboxes || !autoReload}
            >
              Save
            </Button>
          </Flex>
        }
        title="Protected Routes"
        as="h2"
      />
      <Modal.Root>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add a new protected route</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Typography>select route</Typography>
            <Combobox
              value={modelRoute}
              onChange={(value) => {
                setModelRoute(value);
              }}
            >
              {routesData.data.map(function (route, i) {
                const name = route.methods.at(-1) + ' ' + route.path;
                if (typeof selectedCheckboxesClone[name] === 'undefined') {
                  return (
                    <ComboboxOption value={name} key={i}>
                      {name}
                    </ComboboxOption>
                  );
                }
              })}
            </Combobox>
            <br />
            <Typography>select content type used</Typography>
            <Combobox
              label="select content type used"
              value={modelContentType}
              onChange={(value) => {
                setModelContentType(value);
              }}
            >
              {contenttypesData.data.map(function (contentType, i) {
                return (
                  <ComboboxOption value={contentType} key={i}>
                    {contentType}
                  </ComboboxOption>
                );
              })}
            </Combobox>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary">Cancel</Button>
            </Modal.Close>
            <Button onClick={() => handleFinish()}>Confirm</Button>
          </Modal.Footer>
        </Modal.Content>
        <Layouts.Content>
          <Box padding={8} background="neutral0">
            <Accordion.Root label="Routes">
              {Object.keys(selectedCheckboxesClone).map(function (key, i) {
                return (
                  <RouteAccordion
                    autoReload={autoReload}
                    updateSelectedCheckboxes={updateSelectedCheckboxes}
                    selectedCheckboxes={selectedCheckboxesClone}
                    handleToggle={handleToggle}
                    expandedID={expandedID}
                    routeName={key}
                    components={componentsData.data}
                    contentTypes={contenttypes2Data.data}
                    contentTypeNames={contenttypesData.data}
                    roles={roleData.data.roles}
                    key={i}
                  />
                );
              })}
              <Accordion.Item>
                <Flex justifyContent="center" height="48px" background="neutral150">
                  <Modal.Trigger>
                    <TextButton disabled={!autoReload} startIcon={<Plus />}>
                      Add a new protected route
                    </TextButton>
                  </Modal.Trigger>
                </Flex>
              </Accordion.Item>
            </Accordion.Root>
          </Box>
        </Layouts.Content>
      </Modal.Root>
    </div>
  );
}
