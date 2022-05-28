import { render, screen } from '@testing-library/react';

import BuildingInformation from './BuildingInformation';
import type { BuildingInformationProps } from './BuildingInformation';

const defaultProps: BuildingInformationProps = {
  estate: {
    id: 123,
    type: 'building',
    cadastral_designation: '98940060012003',
    land_cadastral_designation: '98940060055',
    object_code: '5201011110',
    area: 120,
  },
};

describe('BuildingInformation', () => {
  it('renders the component with all the necessary data', () => {
    render(<BuildingInformation {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: 'Estate information' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Area:')).toBeInTheDocument();
    expect(
      screen.getByText('Estate cadastral designation:'),
    ).toBeInTheDocument();
    expect(screen.getByText('Land cadastral designation:')).toBeInTheDocument();
    expect(screen.getByText('Code:')).toBeInTheDocument();
    expect(screen.getByText(/^120/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '98940060012003' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '98940060055' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Surveyed building (Uzmērīta ēka; 5201011110)'),
    ).toBeInTheDocument();
  });
});
