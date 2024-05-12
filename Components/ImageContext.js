// ImageContext.js

import React, {createContext, useContext, useState} from 'react';

const ImageContext = createContext();

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({children}) => {
  const [imageUri, setImageUri] = useState(null);

  return (
    <ImageContext.Provider value={{imageUri, setImageUri}}>
      {children}
    </ImageContext.Provider>
  );
};
