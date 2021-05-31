import axios from 'axios';
import API_URL from './EndPoint';

const getUserInfoByUid = async (uid: string) => {
  return await axios.post(
    `${API_URL}/api/get-userinfo`,
    {
      uid: uid,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
};

export { getUserInfoByUid };
