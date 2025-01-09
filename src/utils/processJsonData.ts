import type { CoreContent } from '@/@types';
import type { JsonData } from '@/@types/rg';

const processJsonData = (data: JsonData) => {
  console.log(data);
  const contentsBySlug = new Map<string, CoreContent>();

  for (let i = 0, l = data.contents.length; i < l; i++) {
    const content = data.contents[i];
    if (content) {
      for (let j = 0, k = content.labels.length; j < k; j++) {
        const label = content.labels[j];
        if (label) {
          contentsBySlug.set(label.toLowerCase(), {
            file: content.file,
            html: '',
          });
        }
      }
    }
  }

  return {
    contentsBySlug,
  };
};

export default processJsonData;
