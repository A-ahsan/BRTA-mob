import React, { useRef, useEffect, useState } from 'react';

const MODEL_URL = '/models'; // Place models in public/models
const MATCH_THRESHOLD = 0.6;
const EAR_THRESHOLD = 0.25;
const REQUIRED_BLINKS = 2;
const TURN_FRAC = 0.15;

function euclidean(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

function earForEye(eye) {
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  const A = dist(eye[1], eye[5]);
  const B = dist(eye[2], eye[4]);
  const C = dist(eye[0], eye[3]);
  return (A + B) / (2 * C);
}

export default function WebFaceVerification({ referenceImageUrl, onSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('প্রারম্ভিক সেটআপ...');
  const [blinkCount, setBlinkCount] = useState(0);
  const [movedLeft, setMovedLeft] = useState(false);
  const [movedRight, setMovedRight] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [verified, setVerified] = useState(false);
  const [refDescriptor, setRefDescriptor] = useState(null);

  useEffect(() => {
    let stream;
    let lastEAR = 0;
    let blinkFramesClosed = 0;
    let isBlinking = false;
    let totalBlinks = 0;
    let left = false, right = false;
    let running = true;
    let faceapi;
    let verificationTriggered = false;

    async function loadFaceApi() {
      if (!window.faceapi) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      faceapi = window.faceapi;
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      console.log("✅ Models loaded");
    }

    async function getReferenceDescriptor(url) {
      console.log("Loading reference image from:", url);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (err) => {
          console.error("Reference image failed to load:", err);
          reject(err);
        };
      });

      const det = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      if (det && det.descriptor) {
        console.log("✅ Reference descriptor set");
        setRefDescriptor(det.descriptor);
        return det.descriptor;
      } else {
        console.warn("⚠️ No face found in reference image");
        setStatus("No face found in reference image. Use a clear photo.");
        return null;
      }
    }

    async function startCamera() {
      // Check if we're on a secure context or localhost
      const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("এই ব্রাউজারে ক্যামেরা সাপোর্ট করে না।");
        console.error("navigator.mediaDevices.getUserMedia is not available");
        return;
      }

      if (!isSecureContext && window.location.protocol !== 'https:') {
        setStatus("ক্যামেরা অ্যাক্সেসের জন্য HTTPS বা localhost প্রয়োজন। অনুগ্রহ করে localhost:8081 ব্যবহার করুন।");
        console.error("Camera access requires HTTPS or localhost for IP addresses");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus("ক্যামেরা চালু হয়েছে। মুখ যাচাইকরণ শুরু করুন।");
        }
      } catch (err) {
        console.error("Camera error:", err);
        if (err.name === 'NotAllowedError') {
          setStatus("ক্যামেরা অ্যাক্সেস অনুমতি দিন। ব্রাউজারে ক্যামেরা পারমিশন চেক করুন।");
        } else if (err.name === 'NotFoundError') {
          setStatus("কোন ক্যামেরা পাওয়া যায়নি। ক্যামেরা সংযুক্ত আছে কিনা চেক করুন।");
        } else if (err.name === 'NotSupportedError') {
          setStatus("ক্যামেরা সাপোর্ট করে না। HTTPS বা localhost ব্যবহার করুন।");
        } else {
          setStatus("ক্যামেরা অ্যাক্সেস সমস্যা: " + err.message);
        }
      }
    }

    async function detectionLoop(descriptor) {
      if (!videoRef.current || !canvasRef.current || !descriptor) {
        console.log("Detection loop not started: missing requirements");
        return;
      }
      const ctx = canvasRef.current.getContext("2d");
      let failCount = 0;

      while (running) {
        try {
          const det = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.6 }))
            .withFaceLandmarks(true)
            .withFaceDescriptor();

          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          if (det) {
            failCount = 0;
            const { box } = det.detection;

            if (box.width < 100) {
              setStatus("মুখ অত্যন্ত ছোট। আরো কাছে আসুন।");
              await new Promise(r => setTimeout(r, 60));
              continue;
            }

            // Draw box
            ctx.strokeStyle = "#006a4e";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Blink detection
            const L = det.landmarks;
            const leftEye = L.getLeftEye();
            const rightEye = L.getRightEye();
            const nose = L.getNose();
            const noseTip = nose[3] || nose[Math.floor(nose.length / 2)];

            const earLeft = earForEye(leftEye);
            const earRight = earForEye(rightEye);
            const ear = (earLeft + earRight) / 2;
            const earChange = Math.abs(ear - lastEAR);
            lastEAR = ear;

            if (earChange < 0.15) {
              if (ear < EAR_THRESHOLD && !isBlinking) {
                blinkFramesClosed++;
                if (blinkFramesClosed >= 3) {
                  isBlinking = true;
                  blinkFramesClosed = 0;
                }
              } else if (ear >= EAR_THRESHOLD && isBlinking) {
                isBlinking = false;
                totalBlinks++;
                blinkFramesClosed = 0;
                setBlinkCount(totalBlinks);
              }
            }

            // Head movement
            const faceCenterX = box.x + box.width / 2;
            const offsetX = (noseTip.x - faceCenterX) / box.width;
            if (offsetX <= -TURN_FRAC) left = true;
            if (offsetX >= TURN_FRAC) right = true;
            setMovedLeft(left);
            setMovedRight(right);

            // Face match
            let matchOK = false;
            let dist = euclidean(descriptor, det.descriptor);
            matchOK = dist <= MATCH_THRESHOLD;
            setMatchScore(dist.toFixed(3));

            // Status
            let livenessOK = totalBlinks >= REQUIRED_BLINKS && left && right;

            if (livenessOK && matchOK && !verificationTriggered) {
              setStatus("✅ যাচাইকৃত: জীবন্ততা পরীক্ষা পাস এবং মুখ মিলেছে।");
              setVerified(true);
              running = false;
              verificationTriggered = true;
              if (onSuccess) await onSuccess();
            } else if (livenessOK && !matchOK) {
              setStatus("❌ মুখ রেফারেন্সের সাথে মিলছে না।");
            } else {
              let need = [];
              if (totalBlinks < REQUIRED_BLINKS) need.push(`আরো ${REQUIRED_BLINKS - totalBlinks} বার চোখ ঝাপান`);
              if (!left) need.push("বামে মাথা ঘুরান");
              if (!right) need.push("ডানে মাথা ঘুরান");
              setStatus("নির্দেশনা অনুসরণ করুন: " + need.join(", "));
            }
          } else {
            failCount++;
            setStatus("কোন মুখ শনাক্ত হয়নি। আপনার মুখ কেন্দ্রে রাখুন এবং ভাল আলো নিশ্চিত করুন।");
            if (failCount > 100) {
              setStatus("অত্যন্ত দীর্ঘ সময় ধরে মুখ শনাক্ত হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
              running = false;
              break;
            }
          }
        } catch (err) {
          setStatus("শনাক্তকরণ ত্রুটি: " + err.message);
          console.error("Detection error:", err);
          running = false;
          break;
        }
        await new Promise(r => setTimeout(r, 60));
      }
    }

    async function init() {
      try {
        await loadFaceApi();
        const descriptor = await getReferenceDescriptor(referenceImageUrl);
        if (!descriptor) return; // stop if no reference face
        await startCamera();

        if (videoRef.current && canvasRef.current) {
          canvasRef.current.width = 320;
          canvasRef.current.height = 240;
        }

        detectionLoop(descriptor);
      } catch (err) {
        setStatus("প্রারম্ভিক সেটআপ ত্রুটি: " + err.message);
        console.error("Init error:", err);
      }
    }

    if (referenceImageUrl) {
      init();
    }

    return () => {
      running = false;
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [referenceImageUrl, onSuccess]);

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>মুখ যাচাইকরণ (ওয়েব)</h2>
      <div style={{ marginBottom: 10, position: 'relative', display: 'inline-block' }}>
        <video ref={videoRef} autoPlay playsInline width={320} height={240} style={{ borderRadius: 12, background: '#222' }} />
        <canvas ref={canvasRef} width={320} height={240} style={{ position: 'absolute', left: 0, top: 0, borderRadius: 12, pointerEvents: 'none' }} />
      </div>
      <div style={{ margin: '10px 0', fontWeight: 'bold', color: verified ? '#21c55d' : '#c69214' }}>{status}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <div>চোখ ঝাপান: {blinkCount}/2</div>
        <div>বাম: {movedLeft ? '✅' : '❌'}</div>
        <div>ডান: {movedRight ? '✅' : '❌'}</div>
        <div>মিল: {matchScore !== null ? matchScore : '—'}</div>
      </div>
      {verified && <div style={{ color: '#21c55d', fontWeight: 'bold', marginTop: 20 }}>যাচাইকরণ সম্পন্ন!</div>}
    </div>
  );
}
