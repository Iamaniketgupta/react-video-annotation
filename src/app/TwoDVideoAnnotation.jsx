import React from 'react';
import { VideoProvider } from './VideoPlayerContext';
import ReactPlayer from '../ReactPlayer/ReactPlayer';

const TwoDVideoAnnotation = ({
  videoUrl,
  shape,
  hideAnnotations,
  videoWidth,
  lockEdit,
  onSubmit, 
  data,
  setData, 
}) => {
  return (
    <VideoProvider
      initialVideoUrl={videoUrl}
      initialShape={shape}
      initialHideAnnotations={hideAnnotations}
      initialVideoWidth={videoWidth}
      initialLockEdit={lockEdit}
      initialData={data}
      externalSetData={setData} 
      externalOnSubmit={onSubmit} 
    >
      
      <ReactPlayer url={videoUrl} width={videoWidth} />

    </VideoProvider>
  );
}

export default TwoDVideoAnnotation;
