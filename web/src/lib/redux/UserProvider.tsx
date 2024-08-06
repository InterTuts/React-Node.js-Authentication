'use client'

// System Utils
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Installed Utils
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { AppDispatch, RootState } from './store';
import { setLoginErrorMessage } from './features/auth/authSlice';
import { userInfo } from './features/user/userSlice';

export default function UserProvider({
  children,
}: {
  children: React.ReactNode
}) {

  // Get the router
  const router = useRouter();

  // Get the user's info
  const { isAuthenticated, errorMessage } = useSelector((state: RootState) => state.user);

  // Get the Redux's dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Get the user's information
  useEffect(() => {
      dispatch(userInfo());
  }, []);

  // Monitor when user is logout
  useEffect(() => {

    // Verify if user is logout
    if ( !isAuthenticated ) {

      // Check if error message exists
      if ( errorMessage ) {
        dispatch(setLoginErrorMessage(errorMessage));
      }

      // Redirect the user to the login page
      router.push('/auth/signin');

    }

  }, [dispatch, errorMessage, isAuthenticated, router]);  

  return children;
}