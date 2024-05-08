import React, {createContext, useContext, useState} from 'react';

// 컨텍스트 생성
const ResponseContext = createContext();

// 컨텍스트의 공급자
export const ResponseProvider = ({children}) => {
  const [responseData, setResponseData] = useState(null);

  const updateResponseData = data => {
    setResponseData(data);
  };

  return (
    <ResponseContext.Provider value={{responseData, updateResponseData}}>
      {children}
    </ResponseContext.Provider>
  );
};

// 커스텀 훅 생성
export const useResponse = () => useContext(ResponseContext);
