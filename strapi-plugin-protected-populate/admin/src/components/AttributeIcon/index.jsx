import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system';
import {
  ComponentField,
  CollectionType,
  DateField,
  BooleanField,
  DynamicZoneField,
  EmailField,
  EnumerationField,
  JsonField,
  MediaField,
  PasswordField,
  RelationField,
  SingleType,
  TextField,
  UidField,
  NumberField
} from '@strapi/icons/symbols';
import { useStrapiApp  } from '@strapi/admin/strapi-admin';
// TODO ADD BLOCKS field
const iconByTypes = {
  biginteger: NumberField,
  boolean: BooleanField,
  collectionType: CollectionType,
  component: ComponentField,
  contentType: CollectionType,
  date: DateField,
  datetime: DateField,
  decimal: NumberField,
  dynamiczone: DynamicZoneField,
  email: EmailField,
  enum: EnumerationField,
  enumeration: EnumerationField,
  file: MediaField,
  files: MediaField,
  float: NumberField,
  integer: NumberField,
  json: JsonField,
  JSON: JsonField,
  blocks: JsonField,
  media: MediaField,
  number: NumberField,
  password: PasswordField,
  relation: RelationField,
  richtext: TextField,
  singleType: SingleType,
  string: TextField,
  text: TextField,
  time: DateField,
  timestamp: DateField,
  uid: UidField,
  id: UidField,
};

const IconBox = styled(Box)`
  width: ${32 / 16};
  height: ${24 / 16};
  box-sizing: content-box;
`;

const AttributeIcon = ({ type, customField, ...rest }) => {
  //const customFieldsRegistry = useStrapiApp('ProtectedPopulate', (state) => state.customFields);

  let Compo = iconByTypes[type];

  if (customField) {
    const { icon } = customFieldsRegistry.get(customField);

    if (icon) {
      Compo = icon;
    }
  }

  if (!iconByTypes[type]) {
    return null;
  }

  return <IconBox as={Compo} {...rest} aria-hidden />;
};

AttributeIcon.defaultProps = {
  customField: null,
};

AttributeIcon.propTypes = {
  type: PropTypes.string.isRequired,
  customField: PropTypes.string,
};

export default AttributeIcon;
