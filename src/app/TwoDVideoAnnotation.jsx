import React from 'react';
import { VideoProvider } from './VideoPlayerContext';
import ReactPlayer from '../VideoAnnotationPlayer/ReactPlayer';

const TwoDVideoAnnotation = ({
  videoUrl,
  shape,
  hideAnnotations,
  videoWidth,
  lockEdit,
  onSubmit, 
  data,
  setData, 
  annotationColor
}) => {
  return (
    <VideoProvider
      initialVideoUrl={videoUrl}
      shape={shape}
      hideAnnotations={hideAnnotations}
      initialVideoWidth={videoWidth}
      lockEdit={lockEdit}
      initialData={data}
      externalSetData={setData} 
      externalOnSubmit={onSubmit}
      annotationColor={annotationColor}
    >
      <ReactPlayer url={videoUrl} width={videoWidth} />

    </VideoProvider>
  );
}

export default TwoDVideoAnnotation;
