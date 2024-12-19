/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import * as React from 'react';
import pluginPermissions from '../../permissions';
import HomePage from '../HomePage';
import { Page } from '@strapi/strapi/admin';
const App = () => {
  return (
    (<Page.Protect permissions={pluginPermissions.main}>
      <HomePage/>
    </Page.Protect>)
  );
};

export default App;
