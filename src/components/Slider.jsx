import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const Slider = ({ slides, autoPlay = true, autoPlayInterval = 5000 }) => {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const length = slides.length

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }

  const goToSlide = (index) => {
    setCurrent(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [current, isPlaying, autoPlayInterval, length])

  // Pause on hover
  const handleMouseEnter = () => {
    setIsPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsPlaying(autoPlay)
  }

  if (!Array.isArray(slides) || length === 0) {
    return null
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main slider container */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800">
        {/* Slides container */}
        <div className="relative h-72 sm:h-96 md:h-[32rem] lg:h-[36rem]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === current
                  ? 'translate-x-0 opacity-100 scale-100'
                  : index < current
                  ? '-translate-x-full opacity-0 scale-95'
                  : 'translate-x-full opacity-0 scale-95'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-emerald-900/30" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-full p-6 sm:p-8 md:p-12">
                <div className="text-center max-w-4xl">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 drop-shadow-lg leading-relaxed max-w-3xl mx-auto">
                    {slide.description}
                  </p>

                  {/* CTA Button - Hidden on mobile */}
                  <Link
                    to={'/login'}
                    className="hidden sm:inline-flex items-center px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    Comenzar Ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2
                     bg-white/10 backdrop-blur-md hover:bg-white/20
                     rounded-full p-3 sm:p-4 shadow-xl
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:scale-110 active:scale-95 border border-white/20"
          aria-label="Slide anterior"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2
                     bg-white/10 backdrop-blur-md hover:bg-white/20
                     rounded-full p-3 sm:p-4 shadow-xl
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:scale-110 active:scale-95 border border-white/20"
          aria-label="Siguiente slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 sm:top-6 left-4 sm:left-6
                     bg-white/10 backdrop-blur-md hover:bg-white/20
                     rounded-full p-2 sm:p-3 shadow-lg
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:scale-110 border border-white/20"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Slide counter */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-2 text-white text-sm sm:text-base font-medium border border-white/20">
          {current + 1} / {length}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 transition-all duration-1000 ease-out"
            style={{ width: `${((current + 1) / length) * 100}%` }}
          />
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center mt-6 sm:mt-8 space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full border-2 ${
              idx === current
                ? 'w-12 sm:w-16 h-3 sm:h-4 bg-gradient-to-r from-emerald-500 to-blue-500 border-emerald-500 shadow-lg'
                : 'w-3 sm:w-4 h-3 sm:h-4 bg-gray-300 hover:bg-gray-400 border-gray-300 hover:border-gray-400 hover:scale-125'
            }`}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Demo con datos de Vota Chile
const VotaChileSliderDemo = () => {
  const slidesData = [
    {
      image:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Democracia Digital',
      title: 'Tu Voz Importa',
      description:
        'Participa en el proceso democrático de Chile con total seguridad y transparencia. Cada voto cuenta para construir el futuro que queremos.'
    },
    {
      image:
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Voto Electrónico',
      title: 'Tecnología Avanzada',
      description:
        'Sistema de votación electrónica con blockchain y encriptación de última generación. Tu voto está protegido y es verificable.'
    },
    {
      image:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Futuro Digital',
      title: 'Revolución Digital',
      description:
        'Transformamos la participación ciudadana con una plataforma moderna, accesible y confiable para todos los chilenos.'
    },
    {
      image:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Transparencia',
      title: 'Transparencia Total',
      description:
        'Resultados en tiempo real, auditorías públicas y total transparencia en cada paso del proceso electoral.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"></h1>
        </div>

        <Slider slides={slidesData} autoPlay={true} autoPlayInterval={4000} />
      </div>
    </div>
  )
}

export default VotaChileSliderDemo
