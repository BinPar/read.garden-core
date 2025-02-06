import type { Theme } from '@/@types/common';
import { updateState } from '@/utils/state';

const updateTheme = (theme: Theme) => {
  updateState({ theme });
};

export default updateTheme;
