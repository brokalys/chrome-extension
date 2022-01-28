import { Heading, Link, Pane, ShareIcon, Strong, Text } from 'evergreen-ui';

import type { Building } from 'src/types';

export interface BuildingInformationProps {
  building: Building;
}

function useObjectCodeName(objectCode: string): string {
  const objectCodeMap = new Map([
    ['5201011110', 'Surveyed building (Uzmērīta ēka; 5201011110)'],
    ['5201011310', 'Vectorized building (Vektorizēta ēka; 5201011310)'],
    [
      '5201013110',
      'Surveyed underground building (Uzmērīta pazemes ēka; 5201013110)',
    ],
    [
      '5201013310',
      'Vectorized underground building (Vektorizēta pazemes ēka; 5201013310)',
    ],
  ]);

  return objectCodeMap.get(objectCode)!;
}

const BuildingInformation: React.FC<BuildingInformationProps> = ({
  building,
}) => {
  const objectCodeName = useObjectCodeName(building.object_code);

  return (
    <Pane elevation={0} paddingX={12} paddingY={6} backgroundColor="white">
      <Heading>Building information</Heading>

      <Pane display="flex" flexDirection="column" gap={3}>
        <Item title="Area:">
          {building.area.toFixed(2)} m<sup>2</sup>
        </Item>
        <Item title="Building cadastral designation:">
          <Link
            href={`https://www.kadastrs.lv/buildings?cad_num=${building.cadastral_designation}`}
            target="_blank"
            size={300}
          >
            {building.cadastral_designation} <ShareIcon size={10} />
          </Link>
        </Item>
        <Item title="Land cadastral designation:">
          <Link
            href={`https://www.kadastrs.lv/parcels?cad_num=${building.land_cadastral_designation}`}
            target="_blank"
            size={300}
          >
            {building.land_cadastral_designation} <ShareIcon size={10} />
          </Link>
        </Item>
        <Item title="Code:">{objectCodeName}</Item>
      </Pane>
    </Pane>
  );
};

const Item: React.FC<{ title: string }> = ({ title, children }) => (
  <Pane
    display="flex"
    justifyContent="space-between"
    alignItems="flex-end"
    gap={12}
  >
    <Strong size={300}>{title}</Strong>
    <Text size={300}>{children}</Text>
  </Pane>
);

export default BuildingInformation;
