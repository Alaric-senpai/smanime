import Image from "next/image"

type SharedHeroProps = {
  title: string
  description: string
  imageUrl?: string
}

const SharedHero = ({ title, description, imageUrl = "/images/tanjiro.png" }: SharedHeroProps) => {
  return (
    <div className="relative w-full min-h-[500px] h-[500px] text-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          fill
          src={imageUrl || "/images/tanjiro.png"}
          alt="Hero banner"
          className="object-cover scale-105 transition-transform duration-700 hover:scale-110"
          priority
        />
      </div>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black/80 to-pink-900/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-transparent to-pink-900/40" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
        {/* Title with enhanced styling */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
          <span className="block transform hover:scale-105 transition-transform duration-300">{title}</span>
        </h1>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse" />

        {/* Description with enhanced styling */}
        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl font-light tracking-wide">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{description}</span>
        </p>

        {/* Subtle glow effect behind text */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-full transform scale-150 -z-10" />
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  )
}

export default SharedHero
