import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'; // Tambahan untuk meta tag
import useAuthStore from '@/lib/store';
import api from '@/lib/api';
import { connectSocket, disconnectSocket } from '@/lib/socket';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { setUser, setToken, user } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      fetchCurrentUser(token);
      connectSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}