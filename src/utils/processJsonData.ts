import type { CoreContent } from '@/@types';
import type { JsonData } from '@/@types/rg';

const processJsonData = (data: JsonData) => {
  const contentsBySlug = new Map<string, CoreContent>();
  const orderedContents = new Array<CoreContent>();
  const pendingContents = new Set<number>();
  let lastContent: CoreContent | null = null;

  for (let i = 0, l = data.contents.length; i < l; i++) {
    const content = data.contents[i];
    if (content) {
      const coreContent: CoreContent = {
        file: content.file,
        order: i,
        html: '',
        slug: '',
      };
      pendingContents.add(i);
      if (lastContent) {
        coreContent.prev = lastContent;
        lastContent.next = coreContent;
      }
      orderedContents.push(coreContent);
      for (let j = 0, k = content.labels.length; j < k; j++) {
        const label = content.labels[j];
        if (label) {
          const slug = label.toLowerCase();
          if (!coreContent.slug) {
            coreContent.slug = slug;
          }
          contentsBySlug.set(slug, coreContent);
        }
      }
      lastContent = coreContent;
    }
  }

  return {
    contentsBySlug,
    orderedContents,
    pendingContents,
  };
};

export default processJsonData;
