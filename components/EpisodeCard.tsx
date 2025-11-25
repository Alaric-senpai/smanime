'use client'
import { getWatchRecentPromos } from '@lightweight-clients/jikan-api-lightweight-client'
import { AnimeEpisode } from '@lightweight-clients/jikan-api-lightweight-client/dist/raw-types'
import { useQuery } from '@tanstack/react-query'
import { EpisodeEntry } from '@tutkli/jikan-ts'
import React from 'react'

type EpisodeCardProps = {

    episode:AnimeEpisode;
    animeid: number;
}
const EpisodeCard = ({episode, animeid}:EpisodeCardProps) => {

    const {}= useQuery({
        queryKey: ['episode', animeid, episode.mal_id],
        queryFn: getWatchRecentPromos()
    })
    
  return (
    <div>
      
    </div>
  )
}

export default EpisodeCard
