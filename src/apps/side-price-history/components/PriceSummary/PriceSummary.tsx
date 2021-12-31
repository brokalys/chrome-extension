import { Pane, Text } from 'evergreen-ui';
import React from 'react';

interface PriceSummaryProps {
  prices: number[];
  pricesPerSqm: number[];
}

function average(dataPoints: number[], round: boolean = false): number {
  const sum = dataPoints.reduce((carry, num) => carry + num, 0);
  const avg = sum / dataPoints.length;
  return round ? Math.round(avg) : parseFloat(avg.toFixed(2));
}

const PriceSummary: React.FC<PriceSummaryProps> = (props) => {
  if (props.prices.length === 0) {
    return null;
  }

  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      gap={24}
    >
      <Item>
        <Text>Min</Text>
        <Text size={600}>
          {Math.min.apply(this, props.prices).toLocaleString()} €
        </Text>
        <Text size={300}>
          ({Math.min.apply(this, props.pricesPerSqm).toLocaleString()} €/m
          <sup>2</sup>)
        </Text>
      </Item>

      <Item>
        <Text>Average</Text>
        <Text size={600}>{average(props.prices, true).toLocaleString()} €</Text>
        <Text size={300}>
          ({average(props.pricesPerSqm).toLocaleString()} €/m
          <sup>2</sup>)
        </Text>
      </Item>

      <Item>
        <Text>Max</Text>
        <Text size={600}>
          {Math.max.apply(this, props.prices).toLocaleString()} €
        </Text>
        <Text size={300}>
          ({Math.max.apply(this, props.pricesPerSqm).toLocaleString()} €/m
          <sup>2</sup>)
        </Text>
      </Item>
    </Pane>
  );
};

const Item: React.FC = (props) => {
  return (
    <Pane
      elevation={0}
      padding={24}
      backgroundColor="white"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {props.children}
    </Pane>
  );
};

export default PriceSummary;
