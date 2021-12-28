import { Button, Pane, Pill, Spinner } from 'evergreen-ui';

function SideBarOpenButton(props) {
  return (
    <Pane elevation={4} position="fixed" bottom={20} right={20}>
      <Button height={56} appearance="primary" onClick={props.onOpenClick}>
        View price history
        <Pill display="inline-flex" margin={8} color="blue" isInteractive>
          {props.isLoading ? (
            <Spinner size={16} />
          ) : (
            `${props.results.length} results`
          )}
        </Pill>
      </Button>
    </Pane>
  );
}

export default SideBarOpenButton;
