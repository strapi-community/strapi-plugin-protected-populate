import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@strapi/design-system';

const DisplayedType = ({ type, customField, repeatable }) => {
  let readableType = type;

  if (['integer', 'biginteger', 'float', 'decimal'].includes(type)) {
    readableType = 'number';
  } else if (['string'].includes(type)) {
    readableType = 'text';
  }

  if (customField) {
    return <Typography>Custom field</Typography>;
  }

  return (
    <Typography>
      {type}
      &nbsp;
      {repeatable && '(repeatable)'}
    </Typography>
  );
};

DisplayedType.defaultProps = {
  customField: null,
  repeatable: false,
};

DisplayedType.propTypes = {
  type: PropTypes.string.isRequired,
  customField: PropTypes.string,
  repeatable: PropTypes.bool,
};

export default DisplayedType;
