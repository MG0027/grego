const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://grego.onrender.com/api' 
  : 'http://localhost:2700/api';

export default API_BASE_URL;  