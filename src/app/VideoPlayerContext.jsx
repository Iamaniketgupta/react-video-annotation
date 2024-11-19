import React, { createContext, useState, useContext } from 'react';

export const VideoContext = React.createContext();


export const VideoProvider = ({ 
  children, 
  videoUrl , 
  shape = null, 
  hideAnnotations = false, 
  initialVideoWidth = 640, 
  lockEdit = false, 
  initialData = null,
  externalSetData = null,
  externalOnSubmit = null,
  annotationColor
}) => {
  const [videoWidth, setVideoWidth] = useState(initialVideoWidth);
  const [data, internalSetData] = useState(initialData);

  console.log(annotationColor)
  
  
  const setData = externalSetData || internalSetData;

  
  const onSubmit = externalOnSubmit || (() => {
    console.log("Data submitted:", data);
  });

  return (
    <VideoContext.Provider
      value={{
        videoUrl,
        shape,
        hideAnnotations,
        videoWidth,
        setVideoWidth,
        lockEdit,
        onSubmit,
        data,
        setData,
        annotationColor
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};



