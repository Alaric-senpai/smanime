import Explore from '@/components/Explore'
import Genres from '@/components/Genres'
import Schedules from '@/components/Schedules'
import SharedHero from '@/components/SharedHero'
import React from 'react'

const page = () => {
  return (
    <div>
      <SharedHero title='Explore smAnime' description='Discover thousands of animes across different categories' />
      <Genres />
      <Schedules />
      <Explore />
    </div>
  )
}

export default page