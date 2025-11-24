import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../app/(tabs)/index';

import { AppProviders } from '@/contexts/AppProviders';

describe('<App />', () => {
  it('renders correctly', () => {
    const tree = render(
      <AppProviders>
        <App />
      </AppProviders>
    ).toJSON();
    expect(tree).toBeTruthy();
  });
});
