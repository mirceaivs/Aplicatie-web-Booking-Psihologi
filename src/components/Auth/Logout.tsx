import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { LoadingSpinner } from '../../layout/LoadingSpinner';
import ErrorPage from '../utils/ErrorPage';


export const Logout = () => {
  const { isLoggedIn, setUser, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // if (!isLoggedIn) {
  //   navigate('/');
  // }
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.delete('http://localhost:3000/api/user/logout', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
        navigate('/');

      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(true);
      }


    };

    if (isLoggedIn) {
      handleLogout();
    }
  }, []);

  if (error) {
    return <ErrorPage />
  }
  return loading ? <LoadingSpinner /> : null;
};

