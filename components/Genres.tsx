"use client"
import { getGenres } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Genre } from "@tutkli/jikan-ts"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"


const Genres = () => {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const {
    data: genres,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: Infinity,
  })

  // Auto-scroll functionality
  useEffect(() => {
    if (!genres?.data || isHovered) return

    const container = scrollContainerRef.current
    if (!container) return

    const scrollInterval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = container

      // If we've reached the end, scroll back to the beginning
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        // Scroll by 200px
        container.scrollBy({ left: 200, behavior: "smooth" })
      }
    }, 3000) // Scroll every 3 seconds

    return () => clearInterval(scrollInterval)
  }, [genres, isHovered])

  const handleGenreClick = (malId: number) => {
    router.push(`/genre/${malId}`)
  }

  if (isLoading) {
    return (
      <div className="p-3 mt-5">
        <h2 className="text-2xl font-bold mb-4">Genres</h2>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="min-w-[200px] h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="p-3 mt-5">
        <div className="text-red-500 text-center py-8">Error loading genres</div>
      </div>
    )
  }

  if (!genres || genres.data.length === 0) {
    return (
      <div className="p-3 mt-5">
        <div className="text-gray-500 text-center py-8">No genres available</div>
      </div>
    )
  }

  return (
    <div className="p-3 mt-5">
      <h2 className="text-2xl font-bold mb-4">Genres</h2>
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {genres.data.map((genre: Genre) => (
          <div
            key={genre.mal_id}
            onClick={() => handleGenreClick(genre.mal_id)}
            className="min-w-[200px] flex-shrink-0 p-4 border rounded-lg hover:bg-purple-500/50 hover:border-purple-500 backdrop-blur-md cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 bg-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 truncate">{genre.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{genre.count.toLocaleString()} anime</p>
          </div>
        ))}
        {/* Duplicate items for infinite scroll effect */}
        {genres.data.slice(0, 5).map((genre: Genre) => (
          <div
            key={`duplicate-${genre.mal_id}`}
            onClick={() => handleGenreClick(genre.mal_id)}
            className="min-w-[200px] flex-shrink-0 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-800 truncate">{genre.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{genre.count.toLocaleString()} anime</p>
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Genres
