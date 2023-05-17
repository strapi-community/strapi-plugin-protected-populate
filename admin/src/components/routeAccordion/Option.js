import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Typography, Flex } from '@strapi/design-system';
import checkmarkIcon from '@strapi/design-system/BaseCheckbox/assets/checkmark.svg';
import checkmarkIconDisabled from '@strapi/design-system/BaseCheckbox/assets/checkmark-black.svg';
const CheckMark = styled.div`
  border: 1px solid
    ${({ theme, selected, indeterminate }) =>
      selected || indeterminate ? theme.colors.primary600 : theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius};
  height: 18px;
  width: 18px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  background-color: ${({ theme, selected, indeterminate }) =>
    selected || indeterminate ? theme.colors.primary600 : theme.colors.neutral0};
  ${({ theme, indeterminate }) =>
    indeterminate &&
    `&::after {
      content: '';
      display: block;
      position: relative;
      color: white;
      height: 2px;
      width: 10px;
      background-color: ${theme.colors.neutral0};
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  `}
  ${({ selected }) =>
    selected &&
    `  
    &::after {
      content: '';
      background: url(${checkmarkIcon}) no-repeat no-repeat center center;
      width: 100%;
      height: 100%;
      position: absolute;
    }
  `}
`;

const CheckMarkDisabled = styled.div`
  border: 1px solid
    ${({ theme, selected, indeterminate }) =>
      selected || indeterminate ? theme.colors.neutral400 : theme.colors.neutral400};
  border-radius: ${({ theme }) => theme.borderRadius};
  height: 18px;
  width: 18px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  background-color: ${({ theme, selected, indeterminate }) =>
    selected || indeterminate ? theme.colors.neutral200 : theme.colors.neutral200};
  ${({ theme, indeterminate }) =>
    indeterminate &&
    `&::after {
      content: '';
      display: block;
      position: relative;
      color: white;
      height: 2px;
      width: 10px;
      background-color: ${theme.colors.neutral500};
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  `}
  ${({ selected }) =>
    selected &&
    `  
    &::after {
      content: '';
      background: url(${checkmarkIconDisabled}) no-repeat no-repeat center center;
      width: 100%;
      height: 100%;
      position: absolute;
    }
  `}
`;

const OptionBox = styled(Box)`
  width: 100%;
  border: none;
  text-align: left;
  outline-offset: -3px;
  &.is-focused {
    background: ${({ theme }) => theme.colors.primary100};
  }
  &:hover {
    background: ${({ theme }) => theme.colors.primary100};
  }
`;

export default Option = ({
  selected,
  indeterminate,
  children,
  value,
  multi,
  disabled,
  isChild,
  startIcon,
  ...props
}) => {
  const optionRef = useRef(null);

  return (
    <OptionBox
      as="li"
      hasRadius
      paddingLeft={isChild ? 7 : 4}
      paddingRight={4}
      paddingTop={2}
      paddingBottom={2}
      ref={optionRef}
      role="option"
      aria-selected={selected}
      background="neutral0"
      data-strapi-value={value}
      {...props}
    >
      <Flex>
        {startIcon && (
          <Box paddingRight={2} aria-hidden>
            {startIcon}
          </Box>
        )}

        {multi && (
          <Box paddingRight={2} aria-hidden>
            {disabled ? (
              <CheckMarkDisabled selected={selected} indeterminate={indeterminate} />
            ) : (
              <CheckMark selected={selected} indeterminate={indeterminate} />
            )}
          </Box>
        )}
        <Typography
          textColor={selected ? 'primary600' : 'neutral800'}
          fontWeight={selected ? 'bold' : null}
        >
          {children}
        </Typography>
      </Flex>
    </OptionBox>
  );
};

Option.defaultProps = {
  isChild: false,
  multi: false,
  selected: false,
  startIcon: undefined,
  indeterminate: false,
};

Option.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  indeterminate: PropTypes.bool,
  isChild: PropTypes.bool,
  multi: PropTypes.bool,
  selected: PropTypes.bool,
  startIcon: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Option.displayName = 'Option';
