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


TwoDVideoAnnotation.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(['rectangle', 'circle', 'polygon']),
  hideAnnotations: PropTypes.bool,
  videoWidth: PropTypes.number,
  lockEdit: PropTypes.bool,
  onSubmit: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier for each shape
      color: PropTypes.string, // Color of the annotation (e.g., 'red')
      label: PropTypes.string, // Label associated with the annotation
      data: PropTypes.object, // Can hold any arbitrary metadata
      properties: PropTypes.shape({
        type: PropTypes.oneOf(['rectangle', 'circle', 'polygon']).isRequired, // Shape type
        x: PropTypes.number.isRequired, // X coordinate
        y: PropTypes.number.isRequired, // Y coordinate
        width: PropTypes.number, // Width (optional for dynamic scaling)
        height: PropTypes.number, // Height (optional for dynamic scaling)
        startTime: PropTypes.number.isRequired, // Start time in the video
        endTime: PropTypes.number.isRequired, // End time in the video
        scaleX: PropTypes.number, // X scaling factor
        scaleY: PropTypes.number, // Y scaling factor
      }).isRequired,
    })
  ).isRequired,
  setData: PropTypes.func,
  annotationColor: PropTypes.string,
};


export default TwoDVideoAnnotation;
