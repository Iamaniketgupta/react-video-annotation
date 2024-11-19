import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Canvas from '../Canvas/Canvas';

const TwoDVideoAnnotation = forwardRef(function TwoDVideoAnnotation({
  videoUrl,
  selectedShapeTool,
  hideAnnotations,
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
      }}
    >
   
        <Canvas ref={ref}
          url={videoUrl}
          selectedShapeTool={selectedShapeTool}
          hideAnnotations={hideAnnotations || false}
          lockEdit={lockEdit || false}
          initialData={data}
          externalSetData={setData}
          externalOnSubmit={onSubmit}
          annotationColor={annotationColor || '#FF0000'}
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
