import type { ActionHandler, DrawHighlights } from '@/@types/actions';

const drawHighlights: ActionHandler<DrawHighlights> = ({
  action,
  state,
  config,
}) => {
  console.log({
    action,
    state,
    config,
  });
};

export default drawHighlights;
