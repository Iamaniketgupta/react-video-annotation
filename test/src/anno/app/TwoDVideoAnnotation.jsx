import React from 'react';
import { VideoProvider } from './VideoPlayerContext';
  import Canvas from '../Canvas/Canvas';

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
    <div style={{
      padding:"0",
      position:"relative",
      minWidth:"500px",
      minHeight:"300px",

    }}>
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
        <Canvas url={videoUrl} />
      </VideoProvider>
    </div>
  );
}

export default TwoDVideoAnnotation;
