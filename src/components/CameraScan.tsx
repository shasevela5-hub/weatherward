import React, { useState, useRef, useCallback } from 'react';

interface CameraScanProps {
  onItemDetected: (items: string[]) => void;
  onError: (error: string) => void;
}

const CameraScan: React.FC<CameraScanProps> = ({ onItemDetected, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      const message = err.name === 'NotAllowedError' 
        ? 'Camera access denied. Please allow camera permissions.'
        : err.name === 'NotFoundError'
        ? 'No camera found on this device.'
        : `Camera error: ${err.message}`;
      setError(message);
      onError(message);
    }
  }, [onError]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Simulate backend analysis or call actual API
      const response = await fetch('/api/camera/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      onItemDetected(data.items || []);
    } catch (err: any) {
      const message = `Capture failed: ${err.message}`;
      setError(message);
      onError(message);
    } finally {
      setIsCapturing(false);
    }
  }, [onItemDetected, onError]);

  React.useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="camera-scan">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-feed"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="controls">
        {!isStreaming ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <>
            <button onClick={capturePhoto} disabled={isCapturing}>
              {isCapturing ? 'Analyzing...' : 'Capture & Scan'}
            </button>
            <button onClick={stopCamera}>Stop Camera</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraScan;
