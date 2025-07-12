"use client"

import { Search, X, TrendingUpIcon } from "lucide-react"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { getAnimeSearch } from "@lightweight-clients/jikan-api-lightweight-client"
import type { Anime } from "@lightweight-clients/jikan-api-lightweight-client/dist/raw-types"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SearchElement = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const trendingSearches = ["Attack on Titan", "Demon Slayer", "One Piece", "Naruto", "Dragon Ball", "My Hero Academia"]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchAnimes = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const data = await getAnimeSearch({ q: query, limit: 8 })
        if (data.data) {
          setResults(data.data)
          setShowResults(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAnimes, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(`/anime/${results[selectedIndex].mal_id}`)
          setShowResults(false)
          setQuery("")
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`)
          setShowResults(false)
        }
        break
      case "Escape":
        setShowResults(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  const handleTrendingClick = (searchTerm: string) => {
    setQuery(searchTerm)
    inputRef.current?.focus()
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for anime, characters, or genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className="flex-grow bg-white/90 backdrop-blur-sm border-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400 pr-20 py-3 text-lg rounded-full shadow-lg"
          />

          {/* Clear Button */}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-12 text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="absolute right-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6 shadow-lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border-white/30 shadow-2xl rounded-2xl overflow-hidden z-50">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((anime, index) => (
                  <Link
                    key={anime.mal_id}
                    href={`/anime/${anime.mal_id}`}
                    onClick={() => {
                      setShowResults(false)
                      setQuery("")
                    }}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 hover:bg-purple-50 transition-colors cursor-pointer ${
                        index === selectedIndex ? "bg-purple-100" : ""
                      }`}
                    >
                      <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={anime.images?.webp?.small_image_url || "/placeholder.svg?height=64&width=48"}
                          alt={anime.title || "Anime"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{anime.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {anime.type && (
                            <Badge variant="secondary" className="text-xs">
                              {anime.type}
                            </Badge>
                          )}
                          {anime.year && <span className="text-xs text-gray-500">{anime.year}</span>}
                          {anime.score && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600">
                              <span>★</span>
                              <span>{anime.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-gray-600">
                <p>No results found for "{query}"</p>
                <Button variant="link" onClick={handleSearch} className="text-purple-600 hover:text-purple-700">
                  Search anyway
                </Button>
              </div>
            ) : null}

            {/* Trending Searches */}
            {!query && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUpIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTrendingClick(term)}
                      className="text-xs rounded-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SearchElement
