'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}



// const Providers: React.FC<ProvidersProps> = ({ children }) => (
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       {children}
//     </PersistGate>
//   </Provider>
// );

// export default Providers;