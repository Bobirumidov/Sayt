import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Clock } from 'lucide-react';

const ClockWidget = () => {
  const { i18n } = useTranslation();
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  
  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

  // Weather state
  const [weather, setWeather] = useState<{ temp: number; icon: string; descUz: string; descRu: string; descEn: string } | null>(null);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather fetching
  const getWeatherDetails = (code: number) => {
    if (code === 0) return { icon: '☀️', uz: 'Ochiq havo', ru: 'Ясно', en: 'Clear sky' };
    if (code >= 1 && code <= 3) return { icon: '🌤️', uz: 'Qisman bulutli', ru: 'Переменная облачность', en: 'Partly cloudy' };
    if (code === 45 || code === 48) return { icon: '🌫️', uz: 'Tuman', ru: 'Туман', en: 'Foggy' };
    if (code >= 51 && code <= 55) return { icon: '🌧️', uz: 'Mayda yomg\'ir', ru: 'Морось', en: 'Drizzle' };
    if (code >= 61 && code <= 65) return { icon: '🌧️', uz: 'Yomg\'ir', ru: 'Дождь', en: 'Rain' };
    if (code >= 71 && code <= 75) return { icon: '❄️', uz: 'Qor', ru: 'Снег', en: 'Snow' };
    if (code >= 80 && code <= 82) return { icon: '🌦️', uz: 'Jala yomg\'ir', ru: 'Ливень', en: 'Showers' };
    if (code === 85 || code === 86) return { icon: '🌨️', uz: 'Qor bo\'roni', ru: 'Снегопад', en: 'Snow showers' };
    if (code >= 95 && code <= 99) return { icon: '⛈️', uz: 'Momaqaldiroq', ru: 'Гроза', en: 'Thunderstorm' };
    return { icon: '🌡️', uz: 'Mo\'tadil', ru: 'Умеренно', en: 'Moderate' };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.2646&longitude=69.2163&current_weather=true');
        if (res.ok) {
          const data = await res.json();
          const cur = data.current_weather;
          const details = getWeatherDetails(cur.weathercode);
          setWeather({
            temp: Math.round(cur.temperature),
            icon: details.icon,
            descUz: details.uz,
            descRu: details.ru,
            descEn: details.en
          });
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 15 * 60 * 1000); // 15 mins
    return () => clearInterval(weatherTimer);
  }, []);

  // Draggability handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.close-btn')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.close-btn')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = {
      x: touch.clientX - positionRef.current.x,
      y: touch.clientY - positionRef.current.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newPos = {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      };
      positionRef.current = newPos;
      setPosition(newPos);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const newPos = {
        x: touch.clientX - dragStart.current.x,
        y: touch.clientY - dragStart.current.y
      };
      positionRef.current = newPos;
      setPosition(newPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  if (!isVisible) return null;

  const currentLang = i18n.language || 'uz';

  // Translation helpers
  const uzDays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  const ruDays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const enDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const uzMonths = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
  const ruMonths = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
  const enMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getFormattedDate = () => {
    const dayOfWeek = time.getDay();
    const date = time.getDate();
    const month = time.getMonth();
    const year = time.getFullYear();

    if (currentLang === 'ru') {
      return `${ruDays[dayOfWeek]}, ${date} ${ruMonths[month]} ${year}`;
    } else if (currentLang === 'en') {
      return `${enDays[dayOfWeek]}, ${date} ${enMonths[month]} ${year}`;
    } else {
      return `${uzDays[dayOfWeek]}, ${date}-${uzMonths[month]} ${year}`;
    }
  };

  const getCityLabel = () => {
    if (currentLang === 'ru') return 'Ташкент';
    return 'Toshkent';
  };

  const formattedTime = time.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div 
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`, 
        cursor: isDragging ? 'grabbing' : 'auto' 
      }}
      className="fixed bottom-24 right-6 z-[9999] w-64 bg-white rounded-lg shadow-2xl border border-blue-500/20 overflow-hidden transition-shadow select-none"
    >
      {/* Widget Header (Drag Handle) */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="bg-corporate-dark text-white px-3 py-1.5 flex justify-between items-center text-xs font-semibold cursor-grab active:cursor-grabbing select-none"
      >
        <span>{getFormattedDate()}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="close-btn text-white/60 hover:text-white transition-colors p-0.5"
          title="Yopish"
        >
          <X size={12} />
        </button>
      </div>
      
      {/* Widget Body */}
      <div className="p-3 flex items-center justify-between bg-white select-none">
        {/* City and Flag */}
        <div className="flex items-center gap-2">
          {/* Flag of Uzbekistan SVG */}
          <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="border border-gray-100 shadow-sm rounded-sm">
            <title>O'zbekiston</title>
            <rect width="24" height="5" fill="#0099B5" />
            <rect y="5" width="24" height="0.5" fill="#D22630" />
            <rect y="5.5" width="24" height="5" fill="#FFFFFF" />
            <rect y="10.5" width="24" height="0.5" fill="#D22630" />
            <rect y="11" width="24" height="5" fill="#1EB53A" />
            <circle cx="3.5" cy="2.5" r="1.2" fill="white" />
            <circle cx="4.2" cy="2.5" r="1.2" fill="#0099B5" />
            <circle cx="7.5" cy="1.5" r="0.35" fill="white" />
            <circle cx="8.7" cy="1.5" r="0.35" fill="white" />
            <circle cx="9.9" cy="1.5" r="0.35" fill="white" />
            <circle cx="7" cy="2.7" r="0.35" fill="white" />
            <circle cx="8.2" cy="2.7" r="0.35" fill="white" />
            <circle cx="9.4" cy="2.7" r="0.35" fill="white" />
            <circle cx="10.6" cy="2.7" r="0.35" fill="white" />
            <circle cx="6.5" cy="3.9" r="0.35" fill="white" />
            <circle cx="7.7" cy="3.9" r="0.35" fill="white" />
            <circle cx="8.9" cy="3.9" r="0.35" fill="white" />
            <circle cx="10.1" cy="3.9" r="0.35" fill="white" />
            <circle cx="11.3" cy="3.9" r="0.35" fill="white" />
          </svg>
          <span className="text-xs font-bold text-gray-700">{getCityLabel()} <span className="text-gray-400">UZ</span></span>
        </div>

        {/* Live Ticking Time */}
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-corporate-accent animate-pulse" />
          <span className="text-xl font-bold text-corporate-dark font-mono tracking-tight">{formattedTime}</span>
        </div>
      </div>

      {/* Weather Row */}
      {weather && (
        <div className="px-3 pb-2.5 pt-1.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 select-none bg-blue-50/10">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{weather.icon}</span>
            <span className="font-medium text-gray-600">
              {currentLang === 'ru' 
                ? weather.descRu 
                : currentLang === 'en' 
                  ? weather.descEn 
                  : weather.descUz}
            </span>
          </div>
          <span className="font-bold text-gray-800 text-sm">{weather.temp > 0 ? `+${weather.temp}` : weather.temp}°C</span>
        </div>
      )}
    </div>
  );
};

export default ClockWidget;
