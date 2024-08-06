'use client'

// System Utils
import { useEffect, useRef } from 'react';

// Installed Utils
import { Provider } from 'react-redux';
import nookies from 'nookies';

// App Utils
import { makeStore, AppStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Get cookies
      const cookies = nookies.get(null);
      // Check if the delete_jwt cookie is saved
      if (cookies.delete_jwt) {
        nookies.destroy(null, 'delete_jwt', { path: '/' });
        nookies.destroy(null, 'jwt_token', { path: '/' });
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>
}