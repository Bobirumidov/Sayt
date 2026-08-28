import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="pt-28 pb-20 bg-white/75 backdrop-blur-md min-h-[80vh]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-corporate-accent transition-colors mb-6 font-medium">
          <ArrowLeft size={18} className="mr-2" /> Ortga
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="w-full h-[400px] md:h-[500px] relative bg-gray-100">
            <img 
              src={formatImg(item.img) || "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200"} 
              alt={getVal(item, 'title')} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-12">
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-corporate-dark mb-8 leading-tight">
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

            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
              {getVal(item, 'desc')}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;



