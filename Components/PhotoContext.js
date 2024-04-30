import React, {createContext, useContext, useState} from 'react';

// Context 생성
const PhotoContext = createContext(null);

// Context Provider 컴포넌트
export const PhotoProvider = ({children}) => {
  const [photo, setPhoto] = useState(null);

  return (
    <PhotoContext.Provider value={{photo, setPhoto}}>
      {children}
    </PhotoContext.Provider>
  );
};

// Context를 사용하기 쉽게 하는 Custom Hook
export const usePhoto = () => useContext(PhotoContext);
