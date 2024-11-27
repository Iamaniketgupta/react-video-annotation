import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Canvas from '../Canvas/Canvas';
import { CanvasProvider } from '../contexts/CanvasProvider';
const TwoDVideoAnnotation = ({
  rootRef,
  videoUrl, // Video URL
  shapes, setShapes, // Array of shapes
  selectedShapeTool, // Selected shape tool
  hideAnnotations, // Hide annotations
  lockEdit,// Lock edit mode
  annotationColor, // Annotation color
  selectedAnnotationData, // Callback for selected data
  videoControls // video tag props
}) => {

  if (!videoUrl) {
    console.error("Provide a video url");
    return null
  }



  return (
    <CanvasProvider shapes={shapes} setShapes={setShapes}>

      <div
        style={{
          padding: '0',
          position: 'relative',
        }}
      >

        <Canvas
          ref={rootRef}
          url={videoUrl}
          videoControls={videoControls || {}}
          selectedShapeTool={selectedShapeTool}
          selectedAnnotationData={selectedAnnotationData}
          hideAnnotations={hideAnnotations || false}
          lockEdit={lockEdit || false}
          annotationColor={annotationColor || '#FF0000'}
        />
      </div>
    </CanvasProvider>

  )
}

TwoDVideoAnnotation.propTypes = {
  rootRef: PropTypes.object,
  videoUrl: PropTypes.string.isRequired,
  selectedShapeTool: PropTypes.oneOf(['rectangle', 'circle', 'polygon', null]),
  hideAnnotations: PropTypes.bool,
  lockEdit: PropTypes.bool,
  onSubmit: PropTypes.func,
  shapes: PropTypes.arrayOf(PropTypes.object).isRequired,
  setShapes: PropTypes.func.isRequired,
  annotationColor: PropTypes.string,
  videoControls: PropTypes.object
};

export default TwoDVideoAnnotation;
