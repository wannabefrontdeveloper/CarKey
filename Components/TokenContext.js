import React, {createContext, useState, useContext} from 'react';

const TokenContext = createContext();

export const TokenProvider = ({children}) => {
  const [storedToken, setStoredToken] = useState(null);

  // 토큰 삭제 함수
  const removeToken = () => {
    setStoredToken(null); // 토큰을 삭제합니다.
  };

  return (
    <TokenContext.Provider value={{storedToken, setStoredToken, removeToken}}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
