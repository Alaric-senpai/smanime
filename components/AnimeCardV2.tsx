import React from 'react'
import { AnimeCardProps } from './AnimeCard'
import {  Star,  Calendar, Clock, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { formatDuration, getStatusColor } from "@/constants"
import { Anime } from '@tutkli/jikan-ts'
import { Badge } from './ui/badge'
import Link from 'next/link'

type AnimeCardV2Props = {
    anime:Anime
}

const AnimeCardV2 = ({anime}:AnimeCardV2Props) => {
    if(!anime) return null
  return (
        <Card  className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={anime?.images.webp?.large_image_url || anime.images.jpg.large_image_url || "/images/tanjiro.png"}
                  alt={anime.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge className={`${getStatusColor(anime.status, anime.airing)} text-white border-0`}>
                  {anime.airing ? "Airing" : anime.status}
                </Badge>
              </div>

              {/* Score Badge */}
              {anime.score && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500 text-white border-0 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {anime.score}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="mb-3">
                <Link href={`/anime/${anime.mal_id}`} className="hover:text-blue-600 transition-colors">
                  <h3 className="font-bold text-lg line-clamp-2 mb-1">{anime.title}</h3>
                </Link>
                {anime.title_english && anime.title_english !== anime.title && (
                  <p className="text-sm text-gray-600 line-clamp-1">{anime.title_english}</p>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1 mb-3">
                {anime.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre.mal_id} variant="secondary" className="text-xs">
                    {genre.name}
                  </Badge>
                ))}
                {anime.themes.slice(0, 1).map((theme) => (
                  <Badge key={theme.mal_id} variant="outline" className="text-xs">
                    {theme.name}
                  </Badge>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-sm text-gray-700 line-clamp-3 mb-4">{anime.synopsis || "No synopsis available."}</p>

              {/* Info Grid */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{anime.aired.from} </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {anime.type} • {formatDuration(anime.duration)}
                    {anime.episodes && ` • ${anime.episodes} episodes`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>#{anime.popularity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{anime.members.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Season & Year */}
              <div className="mt-3 pt-3 border-t">
                <Badge variant="outline" className="text-xs">
                  {anime.season} {anime.year}
                </Badge>
              </div>
            </CardContent>
        </Card>
  )
}

export default AnimeCardV2
