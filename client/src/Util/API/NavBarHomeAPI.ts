import axios from 'axios';
import API_URL from './EndPoint';

const getUsername = async (uid: string) => {
  return await axios.post(`${API_URL}/api/get-username`, {
    uid: uid,
  });
};

export { getUsername };
