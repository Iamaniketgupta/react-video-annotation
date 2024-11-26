import React, { forwardRef } from 'react';
// import PropTypes from 'prop-types';
import Canvas from '../Canvas/Canvas';
import { CanvasProvider } from '../contexts/CanvasProvider';
const TwoDVideoAnnotation = ({
  videoUrl,
  selectedShapeTool,
  hideAnnotations,
  lockEdit,
  data,
  onUndo,
  onRedo,
  onDeleteShape,
  annotationColor,
  selectedAnnotationData // Callback for selected data

}) =>{
  
  

  return (
    <CanvasProvider>

      <div
        style={{
          padding: '0',
          position: 'relative',
        }}
      >

        <Canvas 
          url={videoUrl}
          selectedShapeTool={selectedShapeTool}
          selectedAnnotationData={selectedAnnotationData}
          hideAnnotations={hideAnnotations || false}
          lockEdit={lockEdit || false}
          initialData={data}
          onUndo={onUndo}
          onRedo ={onRedo}
          onDeleteShape ={onDeleteShape}
          annotationColor={annotationColor || '#FF0000'}
        />
      </div>
    </CanvasProvider>

  )
}

// TwoDVideoAnnotation.propTypes = {
//   videoUrl: PropTypes.string.isRequired,
//   selectedShapeTool: PropTypes.oneOf(['rectangle', 'circle', 'polygon']),
//   hideAnnotations: PropTypes.bool,
//   lockEdit: PropTypes.bool,
//   onSubmit: PropTypes.func,
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired, // Unique identifier for each shape
//       color: PropTypes.string, // Color of the annotation (e.g., 'red')
//       label: PropTypes.string, // Label associated with the annotation
//       data: PropTypes.object, // Can hold any arbitrary metadata
//       properties: PropTypes.shape({
//         type: PropTypes.oneOf(['rectangle', 'circle', 'polygon']).isRequired, // Shape type
//         x: PropTypes.number.isRequired, // X coordinate
//         y: PropTypes.number.isRequired, // Y coordinate
//         width: PropTypes.number, // Width (optional for dynamic scaling)
//         height: PropTypes.number, // Height (optional for dynamic scaling)
//         startTime: PropTypes.number.isRequired, // Start time in the video
//         endTime: PropTypes.number.isRequired, // End time in the video
//         scaleX: PropTypes.number, // X scaling factor
//         scaleY: PropTypes.number, // Y scaling factor
//         screenHeight: PropTypes.number,
//         screenWidth: PropTypes.number,
//       }).isRequired,
//     })
//   ).isRequired,
//   setData: PropTypes.func,
//   annotationColor: PropTypes.string,
// };

export default TwoDVideoAnnotation;
