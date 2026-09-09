import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Tag, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        const found = data.find((n: any) => n.id === Number(id) || n.id === id);
        setItem(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
      
    // Scroll to top when opening the page
    window.scrollTo(0, 0);
  }, [id]);

  const getVal = (item: any, key: string) => {
    return item[`${key}_${i18n.language}`] || item[`${key}_uz`] || item[key] || '';
  };

  const formatImg = (url: string) => {
    if (!url) return '';
    return url.replace('http://localhost:5000', '');
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Extract YouTube video ID
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([^&\?]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-[60vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-corporate-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Yangilik topilmadi</h2>
        <Link to="/" className="text-corporate-accent hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const galleryList = [
    ...(item?.img ? [item.img] : []),
    ...(Array.isArray(item?.images) ? item.images : [])
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && galleryList.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + galleryList.length) % galleryList.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && galleryList.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % galleryList.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryList.length) % galleryList.length : null));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryList.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryList.length]);

  return (
    <div className="pt-28 pb-20 bg-white/75 backdrop-blur-md min-h-[80vh]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-corporate-accent transition-colors mb-6 font-medium">
          <ArrowLeft size={18} className="mr-2" /> Ortga
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Main Image with mobile-friendly height and click to view full size */}
          <div 
            className="w-full h-64 sm:h-80 md:h-[450px] relative bg-gray-100 cursor-pointer group overflow-hidden"
            onClick={() => setLightboxIndex(0)}
            title="Rasmni to'liq o'lchamda ko'rish uchun bosing"
          >
            <img 
              src={formatImg(item.img) || "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200"} 
              alt={getVal(item, 'title')} 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
              <Maximize2 size={14} />
              <span>To'liq o'lcham</span>
            </div>
          </div>
          
          <div className="p-5 sm:p-8 md:p-12">
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
              {item.date && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" /> {item.date}
                </div>
              )}
              {getVal(item, 'category') && (
                <div className="flex items-center bg-blue-50 text-corporate-accent px-3 py-1 rounded-full font-medium">
                  <Tag size={14} className="mr-2" /> {getVal(item, 'category')}
                </div>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-corporate-dark mb-6 sm:mb-8 leading-tight">
              {getVal(item, 'title')}
            </h1>

            {item.video_url && (
              <div className="mb-8 aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                {item.video_url.includes('mp4') ? (
                  <video src={item.video_url} controls className="w-full h-full object-cover"></video>
                ) : (
                  <iframe 
                    src={getEmbedUrl(item.video_url)} 
                    title="Video" 
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                )}
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap mb-10 text-sm sm:text-base leading-relaxed">
              {getVal(item, 'desc')}
            </div>
            
            {item.images && item.images.length > 0 && (
              <div className="mt-8 border-t pt-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-corporate-dark">Fotogalereya</h3>
                  <span className="text-xs text-gray-400">
                    Rasmni bosib to'liq ko'ring
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
                  {item.images.map((imgUrl: string, idx: number) => {
                    const targetIndex = item.img ? idx + 1 : idx;
                    return (
                      <div 
                        key={idx} 
                        className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => setLightboxIndex(targetIndex)}
                      >
                        <img 
                          src={formatImg(imgUrl)} 
                          alt={`Fotogalereya ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 bg-black/70 text-white p-2 rounded-full transition-opacity shadow-md">
                            <Maximize2 size={16} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Fullscreen Max-Size Lightbox Modal for Mobile and Desktop */}
      {lightboxIndex !== null && galleryList[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-sm select-none animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar Controls */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 flex items-center gap-3">
            <span className="text-white/90 text-xs sm:text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              {lightboxIndex + 1} / {galleryList.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-md"
              aria-label="Yopish"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Prev Button */}
          {galleryList.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all active:scale-90 backdrop-blur-md"
              aria-label="Oldingi rasm"
            >
              <ChevronLeft size={24} className="sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Main Image in Full/Max Screen fit */}
          <div 
            className="w-full h-full flex items-center justify-center p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={formatImg(galleryList[lightboxIndex])} 
              alt={`Rasm ${lightboxIndex + 1}`}
              className="max-w-full max-h-[82vh] sm:max-h-[88vh] object-contain rounded-lg shadow-2xl transition-transform duration-200"
            />
          </div>

          {/* Navigation Next Button */}
          {galleryList.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all active:scale-90 backdrop-blur-md"
              aria-label="Keyingi rasm"
            >
              <ChevronRight size={24} className="sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Bottom helper text */}
          <div className="absolute bottom-3 text-center text-xs text-white/60 pointer-events-none px-4">
            Yopish uchun ekranga yoki ✕ tugmasiga bosing
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;



