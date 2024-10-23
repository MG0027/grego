import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, clearUser } from './store/userslice';
import API_BASE_URL from './config';
export const useAuth = () => {
  const dispatch = useDispatch();

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/info`, {
        withCredentials: true,
      });
      console.log(response);
      dispatch(setUser({
        userId: response.data.userId,
        name: response.data.name,
      }));
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      dispatch(clearUser());
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return { fetchUserInfo };
};