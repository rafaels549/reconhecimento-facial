import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceRecognition({ onRecognitionSuccess }) {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [currentCamera, setCurrentCamera] = useState('user');
    const videoRef = useRef();
    const canvasRef = useRef();
    let mediaStream = null;

    useEffect(() => {
        const loadModels = async () => {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
            ]);
            setModelsLoaded(true);
        };

        loadModels();
    }, []);

    useEffect(() => {
        startVideo();
    }, [currentCamera]);

    const startVideo = () => {
        if (videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: "environment"} })
                .then(stream => {
                    mediaStream = stream;
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch(err => {
                    console.error("Error accessing camera:", err);
                });
        }
    };



  

    const handleVideoOnPlay = () => {
        setInterval(faceMyDetect, 2500);
    };

    const faceMyDetect = async () => {
        if (canvasRef.current && videoRef.current) {
            const video = videoRef.current;
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;

            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                                .withFaceLandmarks()
                                                .withFaceExpressions();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const context = canvasRef.current.getContext('2d');
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

            if (detections.length > 0) {
                const detection = detections[0];
                const confidence = detection.detection.score;

                if (confidence >= 0.7) {
                    const faceCanvas = document.createElement('canvas');
                    faceCanvas.width = detection.detection.box.width;
                    faceCanvas.height = detection.detection.box.height;
                    const faceContext = faceCanvas.getContext('2d');

                    faceContext.drawImage(video, detection.detection.box.x, detection.detection.box.y,
                        detection.detection.box.width, detection.detection.box.height, 0, 0,
                        detection.detection.box.width, detection.detection.box.height);

                    const faceImageDataURL = faceCanvas.toDataURL('image/jpeg');
                    onRecognitionSuccess(faceImageDataURL);
                } else {
                    console.log('Arrume a postura');
                }
            }
        }
    };

    return (
        <div className="flex justify-center">
            <div className="relative">
                <video ref={videoRef} onPlay={handleVideoOnPlay} className="rounded-lg w-full h-auto" autoPlay playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <button onClick={toggleCamera} className="absolute bottom-2 right-2 bg-white p-2 rounded-lg shadow">Toggle Camera</button>
            </div>
        </div>
    );
}
