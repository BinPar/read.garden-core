import genericCatch from '@/tools/genericCatch';
import getClient from './getClient';

const setValue = async (key: string, value: string, ex?: number) => {
  try {
    const client = await getClient();
    const options = ex ? { EX: ex } : undefined;
    const response = await client.set(key, value, options);
    return response;
  } catch (ex) {
    genericCatch('Exception at redis setValue')(ex);
    return null;
  }
};

export default setValue;
