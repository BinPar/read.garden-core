import type { CoreEvent } from '@/@types/events';
import { getConfig } from '@/utils/config';

const dispatchEvent = (event: CoreEvent) => {
  const config = getConfig();
  if (config.eventHandler) {
    config.eventHandler({
      slug: config.slug,
      productSlug: config.productSlug ?? config.slug,
      ...event,
    });
  }
};

export default dispatchEvent;
