import TwoDVideoAnnotation from 'react-video-annotation-tool';

export default function VideoPlayer() {
    return (
        <TwoDVideoAnnotation
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            shape="rectangle"
            hideAnnotations={false}
            
            lockEdit={false}
            onSubmit={() => { }}
          />



    )
}
