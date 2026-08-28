import { useState, useRef, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const links = [
  {
    name: "O'zbekiston Respublikasi Prezidentining rasmiy veb-sayti",
    url: "https://president.uz",
    domain: "president.uz"
  },
  {
    name: "O'zbekiston Respublikasi Hukumat portali",
    url: "https://gov.uz",
    domain: "gov.uz"
  },
  {
    name: "Yagona interaktiv davlat xizmatlari portali",
    url: "https://my.gov.uz",
    domain: "my.gov.uz"
  },
  {
    name: "Qonunchilik ma'lumotlari milliy bazasi",
    url: "https://lex.uz",
    domain: "lex.uz"
  },
  {
    name: "O'zbekiston Respublikasi Energetika vazirligi",
    url: "https://minenergy.uz",
    domain: "minenergy.uz"
  },
  {
    name: "Ochiq ma'lumotlar portali",
    url: "https://data.egov.uz",
    domain: "data.egov.uz"
  }
];

const UsefulLinks = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          // Reached the end, go back to start
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll right
          const scrollAmount = clientWidth > 768 ? 400 : 300;
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        setTimeout(checkScroll, 350);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth > 768 ? 400 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350); // check after smooth scroll finishes
    }
  };

  return (
    <section className="py-16 bg-white/75 backdrop-blur-md border-t border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold text-corporate-dark">
            Foydali <span className="text-corporate-accent">manbalar</span>
          </h2>
          
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')} 
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border transition-all ${canScrollLeft ? 'bg-white border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-white shadow-sm' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')} 
              disabled={!canScrollRight}
              className={`p-3 rounded-full border transition-all ${canScrollRight ? 'bg-white border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-white shadow-sm' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Inject style to hide scrollbar for webkit directly */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {links.map((link, idx) => (
            <div key={idx} className="min-w-[280px] md:min-w-[350px] flex-shrink-0 snap-start h-full">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/75 backdrop-blur-md border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${link.domain}&sz=128`} 
                        alt={link.domain} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <ExternalLink size={20} className="text-gray-400 group-hover:text-corporate-accent transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-800 leading-tight group-hover:text-corporate-accent transition-colors line-clamp-2">
                    {link.name}
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500 truncate">
                  {link.domain}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsefulLinks;



