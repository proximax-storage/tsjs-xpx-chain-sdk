import axios from 'axios';
import API_URL from './EndPoint';

const postCreateAcc = async (uid: string, email: string, username: string) => {
  await axios.post(
    `${API_URL}/api/create-acc`,
    {
      uid: uid,
      email: email,
      username: username,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
};

const downloadPrivateKey = async (uid: string) => {
  const res = await axios.post(
    `${API_URL}/api/download-private-key`,
    {
      uid: uid,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );

  return res;
};

export { postCreateAcc, downloadPrivateKey };
