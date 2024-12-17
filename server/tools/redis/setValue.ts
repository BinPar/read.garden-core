import genericCatch from '@/tools/genericCatch';
import getClient from './getClient';

const setValue = async (key: string, value: string, ex = 3600) => {
  try {
    const client = await getClient();
    const response = await client.set(key, value, { EX: ex });
    return response;
  } catch (ex) {
    genericCatch('Exception at redis setValue')(ex);
    return null;
  }
};

export default setValue;
