import React, { createContext, useState, useContext } from 'react';


const VideoContext = createContext();


export const VideoProvider = ({ 
  children, 
  videoUrl = '', 
  shape = null, 
  hideAnnotations = false, 
  initialVideoWidth = 640, 
  lockEdit = false, 
  initialData = null,
  externalSetData = null,
  externalOnSubmit = null,
  annotationColor = "red"
}) => {
  const [videoWidth, setVideoWidth] = useState(initialVideoWidth);
  const [data, internalSetData] = useState(initialData);

  
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


export const useVideoContext = () => {
  return useContext(VideoContext);
};
