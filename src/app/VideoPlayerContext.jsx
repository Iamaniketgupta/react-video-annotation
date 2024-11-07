import React, { createContext, useState, useContext } from 'react';


const VideoContext = createContext();


export const VideoProvider = ({ 
  children, 
  initialVideoUrl = '', 
  initialShape = null, 
  initialHideAnnotations = false, 
  initialVideoWidth = 640, 
  initialLockEdit = false, 
  initialData = null,
  externalSetData = null,
  externalOnSubmit = null, 
}) => {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [shape, setShape] = useState(initialShape);
  const [hideAnnotations, setHideAnnotations] = useState(initialHideAnnotations);
  const [videoWidth, setVideoWidth] = useState(initialVideoWidth);
  const [lockEdit, setLockEdit] = useState(initialLockEdit);
  const [data, internalSetData] = useState(initialData);

  
  const setData = externalSetData || internalSetData;

  
  const onSubmit = externalOnSubmit || (() => {
    console.log("Data submitted:", data);
  });

  return (
    <VideoContext.Provider
      value={{
        videoUrl,
        setVideoUrl,
        shape,
        setShape,
        hideAnnotations,
        setHideAnnotations,
        videoWidth,
        setVideoWidth,
        lockEdit,
        setLockEdit,
        onSubmit,
        data,
        setData,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};


export const useVideoContext = () => {
  return useContext(VideoContext);
};
