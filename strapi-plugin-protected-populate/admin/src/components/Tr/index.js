import { pxToRem } from '@strapi/helper-plugin';
import styled from 'styled-components';

// Keep component-row for css specificity
const Tr = styled.tr`
  &.component-row,
  &.dynamiczone-row {
    position: relative;
    border-top: none !important;

    table tr:first-child {
      border-top: none;
    }

    > td:first-of-type {
      padding: 0 0 0 ${pxToRem(20)};
      position: relative;

      &::before {
        content: '';
        width: ${pxToRem(4)};
        height: calc(100%);
        position: absolute;
        top: -7px;
        left: 1.625rem;
        border-radius: 4px;

        ${({ theme }) => {
          return `background: ${theme.colors.neutral150};`;
        }}
      }
    }
  }

  &.dynamiczone-row > td:first-of-type {
    padding: 0;
  }
`;

export default Tr;
