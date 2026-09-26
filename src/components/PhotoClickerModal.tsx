import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  RotateCcw,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { solveVisionQuestion } from '../services/api';
import { SolveResponse } from '../types';

interface PhotoClickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSolved: (solution: SolveResponse, imagePreview: string) => void;
  language: string;
  gradeLevel: string;
  subject: string;
  country: string;
  board: string;
  bookName: string;
  chapterOrExercise: string;
  serverNode: string;
  isRtl: boolean;
}

export const PhotoClickerModal: React.FC<PhotoClickerModalProps> = ({
  isOpen,
  onClose,
  onPhotoSolved,
  language,
  gradeLevel,
  subject,
  country,
  board,
  bookName,
  chapterOrExercise,
  serverNode,
  isRtl,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'gallery'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [studentNote, setStudentNote] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser or environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access or upload from your gallery.'
          : 'Unable to start camera. Please upload a photo from your gallery below.'
      );
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, capturedImage, startCamera, stopCamera]);

  // Capture snapshot from video
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Handle gallery file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle paste from clipboard
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setCapturedImage(event.target?.result as string);
              setErrorMessage(null);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  const handleRetake = () => {
    setCapturedImage(null);
    setErrorMessage(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleAnalyzePhoto = async () => {
    if (!capturedImage) return;

    setAnalyzing(true);
    setErrorMessage(null);

    try {
      const solution = await solveVisionQuestion({
        imageBase64: capturedImage,
        query: studentNote.trim(),
        subject,
        gradeLevel,
        language,
        country,
        board,
        bookName,
        chapterOrExercise,
        serverNode,
      });

      onPhotoSolved(solution, capturedImage);
      onClose();
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze photo. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[95vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Vision Photo Clicker & OCR
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">
                  Multimodal
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Snap textbook problems, handwritten equations, or code screenshots to solve step-by-step.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic & Islamic Safety Shield Notice */}
        <div className="px-5 py-2 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-[11px] text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Strict Educational Protection: Adult content strictly prohibited. Academic & Islamic adab enforced.</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] text-slate-400">
            {country || 'Global'} • {bookName ? `${bookName.slice(0, 20)}...` : 'General'}
          </span>
        </div>

        {/* Tabs: Live Camera vs Gallery */}
        {!capturedImage && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 p-1 m-3 rounded-xl gap-1">
            <button
              onClick={() => {
                setActiveTab('camera');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'camera'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              Live Photo Clicker
            </button>
            <button
              onClick={() => {
                setActiveTab('gallery');
                stopCamera();
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'gallery'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Upload from Gallery
            </button>
          </div>
        )}

        {/* Viewport Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col items-center justify-center min-h-[300px]">
          {/* 1. Captured Photo Preview */}
          {capturedImage ? (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500 shadow-xl max-h-[360px] w-full bg-black flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Captured Question"
                  className="max-h-[360px] w-auto object-contain"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Ready to Analyze
                </div>
              </div>

              {/* Optional student query or specific instructions */}
              <div className="w-full space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Additional Instructions / Specific Question (Optional):</span>
                  <span className="text-[10px] text-slate-400">e.g. "Solve question 3" or "Explain in Urdu"</span>
                </label>
                <input
                  type="text"
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="e.g. Solve Question 4(b), show formula derivation and verify roots..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleRetake}
                  disabled={analyzing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Photo
                </button>
                <button
                  onClick={handleAnalyzePhoto}
                  disabled={analyzing}
                  className="flex-2 flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:opacity-95 transition disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing with AI Vision...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Solve with AI Vision
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* 2. Live Camera View */
            <div className="w-full flex flex-col items-center gap-3">
              {cameraError ? (
                <div className="p-6 text-center max-w-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                    Camera Access Notice
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition"
                  >
                    <Upload className="w-4 h-4" />
                    Select Photo from Gallery
                  </button>
                </div>
              ) : (
                <div className="relative w-full max-h-[380px] bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Viewfinder crosshairs */}
                  <div className="absolute inset-8 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-t-2 border-l-2 border-purple-400"></div>
                      <div className="w-4 h-4 border-t-2 border-r-2 border-purple-400"></div>
                    </div>
                    <div className="text-center text-[11px] text-white/80 font-medium bg-black/40 backdrop-blur-xs py-1 px-3 rounded-full mx-auto">
                      Align textbook question, equation, or code inside frame
                    </div>
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-b-2 border-l-2 border-purple-400"></div>
                      <div className="w-4 h-4 border-b-2 border-r-2 border-purple-400"></div>
                    </div>
                  </div>

                  {/* Camera Controls overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6">
                    <button
                      onClick={handleSwitchCamera}
                      type="button"
                      className="p-2.5 rounded-full bg-slate-900/70 text-white backdrop-blur-md hover:bg-slate-900 transition"
                      title="Switch Camera"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>

                    {/* Snap Shutter */}
                    <button
                      onClick={handleSnapPhoto}
                      type="button"
                      className="w-16 h-16 rounded-full border-4 border-white bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-xl active:scale-95 transition"
                      title="Capture Photo"
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <Camera className="w-6 h-6 text-purple-700" />
                      </div>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                      className="p-2.5 rounded-full bg-slate-900/70 text-white backdrop-blur-md hover:bg-slate-900 transition"
                      title="Pick from Gallery"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 3. Gallery Upload Mode */
            <div className="w-full flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 hover:bg-purple-50/20 dark:hover:bg-purple-950/10 transition group"
              >
                <div className="p-4 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl mb-3 group-hover:scale-105 transition">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Choose a Photo from Gallery / Files
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm mb-3">
                  Upload a photo of your math problem, physics derivation, computer code, or textbook exercise.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-purple-500" />
                  Supports JPG, PNG, WEBP, or Paste (Ctrl+V)
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {errorMessage && (
            <div className="mt-3 w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
