import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { VideoProvider } from "./VideoPlayerContext";
import Canvas from '../Canvas/Canvas';

const TwoDVideoAnnotation = forwardRef(function TwoDVideoAnnotation({
  videoUrl,
  shape,
  hideAnnotations,
  videoWidth,
  lockEdit,
  onSubmit,
  data,
  setData,
  annotationColor
}, ref) {
  return (

    <div
      style={{
        padding: '0',
        position: 'relative',
        minWidth: '500px',
        minHeight: '300px',
      }}
    >
   
        <Canvas ref={ref}
          url={videoUrl}
          shape={shape}
          hideAnnotations={hideAnnotations || false}
          lockEdit={lockEdit || false}
          initialData={data}
          externalSetData={setData}
          externalOnSubmit={onSubmit}
          annotationColor={annotationColor || "red"}
        />
    </div>
  )
}
);


TwoDVideoAnnotation.defaultProps = {
  shape: 'rectangle',
  hideAnnotations: false,
  videoWidth: 640,
  lockEdit: false,
  onSubmit: () => { },
  data: [],
  setData: () => { },
  annotationColor: '#FF0000',
};

export default TwoDVideoAnnotation;
