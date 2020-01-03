import axios from 'axios';
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.APP_API_URL,
});

export default api;
