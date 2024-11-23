// src/app/components/withAuth.tsx
'use client';

import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { ComponentType } from 'react';

interface WithAuthOptions {
  redirectPath?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = { redirectPath: '/user/login' }
) {
  return function WithAuthComponent(props: P) {
    const pathname = usePathname();
    const { isAuthenticated } = useSelector(
      (state: RootState) => state.auth
    );

    useEffect(() => {
      if (  !isAuthenticated) {
        redirect(options.redirectPath || '/user/login');
      }
    }, [isAuthenticated]);

  

    // Only render the protected component if authenticated
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
}