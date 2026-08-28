import { useState, useRef } from 'react';
import { Camera, Upload, UserCheck } from 'lucide-react';

const FaceId = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Kameraga kirish imkoni yo'q.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });
            setImage(file);
            setPreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Iltimos, yuzingiz rasmini yuklang yoki rasmga tushing.");
      return;
    }
    setStatus('loading');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('employeeId', employeeId);
    formData.append('image', image);

    try {
      const res = await fetch('/api/faceIds', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatus('success');
        setName(''); setEmployeeId(''); setImage(null); setPreview(null);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white/75 backdrop-blur-md py-20">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-corporate-dark/85 backdrop-blur-md p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2 flex justify-center items-center gap-2">
              <UserCheck /> Face ID Ro'yxatdan O'tish
            </h1>
            <p className="text-gray-300 text-sm">Hikvision kirish-chiqish tizimi uchun</p>
          </div>

          <div className="p-8">
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-center">
                Muvaffaqiyatli! Yuzingiz tizimga qo'shildi. Endi turniketdan o'tishingiz mumkin.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism (F.I.Sh)</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-accent outline-none" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xodim ID (Tabel raqami)</label>
                <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-accent outline-none" required />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Yuzni kiritish</label>
                
                {preview ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <img src={preview} alt="Face Preview" className="w-full h-64 object-cover" />
                    <button type="button" onClick={() => { setPreview(null); setImage(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md">
                      ✕
                    </button>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative rounded-lg overflow-hidden bg-black h-64 flex flex-col justify-end pb-4 items-center">
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover"></video>
                    <button type="button" onClick={capturePhoto} className="relative z-10 bg-white text-corporate-dark px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-gray-100">
                      <Camera size={20} /> Rasmga Olish
                    </button>
                    <button type="button" onClick={stopCamera} className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={startCamera} className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Camera size={32} />
                      <span className="font-medium text-sm">Kamerani ochish</span>
                    </button>
                    
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white/75 backdrop-blur-md text-gray-600 hover:bg-gray-100 transition-colors">
                      <Upload size={32} />
                      <span className="font-medium text-sm">Rasmni yuklash</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                )}
              </div>

              <button type="submit" disabled={status === 'loading'} className="w-full mt-6 bg-corporate-accent hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-70">
                {status === 'loading' ? 'Yuborilmoqda...' : 'Tizimga Kiritish'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceId;



