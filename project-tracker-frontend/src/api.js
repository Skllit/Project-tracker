// import axios from 'axios';
// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
// export default API;

import axios from 'axios';
export default axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});
