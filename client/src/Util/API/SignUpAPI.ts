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

const downloadPrivateKey = async () => {
  const res = await axios.post(`${API_URL}/api/download-private-key`, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });

  return res;
};

const storeXpxAddress = async (uid: string, address: string) => {
  const res = await axios.post(
    `${API_URL}/api/store-xpx-address`,
    { uid: uid, address: address },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );

  return res;
};

export { postCreateAcc, downloadPrivateKey, storeXpxAddress };
