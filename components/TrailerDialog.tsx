import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

import { ExternalLinkIcon, VideotapeIcon } from 'lucide-react';


import { AnimeFull } from '@lightweight-clients/jikan-api-lightweight-client/dist/raw-types';


type TrailerProps = {
  anime: AnimeFull;
};

const TrailerDialog = ({ anime }: TrailerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const trailerEmbedUrl = anime.trailer?.embed_url;
  const youtubeOriginalUrl = anime.trailer?.url;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dialog Trigger Button */}
      <DialogTrigger asChild>
        <Button
          className='group flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50'
        >
          <VideotapeIcon className='h-5 w-5 mr-2 group-hover:animate-pulse' />
          Play Trailer
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className='p-4 sm:p-6 overflow-hidden rounded-lg max-w-3xl w-full bg-gray-900 border border-gray-700 shadow-xl'>
        <DialogHeader className='mb-4'>
          <DialogTitle className='text-xl sm:text-2xl font-bold text-white'>
            {anime.title_english ? `Trailer for ${anime.title_english}` : 'Anime Trailer'}
          </DialogTitle>
        </DialogHeader>

        {trailerEmbedUrl ? (
          <div className='aspect-video w-full relative bg-black rounded-md overflow-hidden'>
            {/* Iframe for embedding the trailer */}
            <iframe
              src={trailerEmbedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className='absolute top-0 left-0 w-full h-full rounded-md shadow-lg'
              title={anime.title_english ? `Trailer for ${anime.title_english}` : 'Anime Trailer'}
            ></iframe>
          </div>
        ) : (
          <div className='flex items-center justify-center h-48 bg-gray-800 text-gray-400 rounded-md'>
            <p className='text-lg font-medium'>No trailer available to play.</p>
          </div>
        )}

        {/* Button to open trailer in YouTube if a URL is available */}
        {youtubeOriginalUrl && (
          <div className='mt-4 flex justify-end'>
            <Button asChild variant='ghost' className='text-purple-300 hover:text-purple-100 hover:bg-gray-800'>
              <a href={youtubeOriginalUrl} target='_blank' rel='noopener noreferrer' className='flex items-center'>
                <ExternalLinkIcon className='h-4 w-4 mr-1' />
                Open in YouTube
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrailerDialog;
