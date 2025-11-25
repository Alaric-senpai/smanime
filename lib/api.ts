import { GenreClient, scheduleClient, TopCli, VideoClient } from "./clients";

export async function getGenres() {
    const genres = await GenreClient.getAnimeGenres()
    return genres
}

export const getSchedule = async () => {  
    const schedule = await scheduleClient.getSchedules({
        limit: 4,
        sfw: true,
        kids: false,
        unapproved: false,
    })
    return schedule
}

export const getTopSection = async (type: 'anime'| 'manga'| 'character'='anime', limit:number=10) => {
    if(type === 'anime') {
        return await TopCli.getTopAnime({limit})
    } else if(type === 'manga') {
        return await TopCli.getTopManga({limit})
    } else if(type === 'character') {
        return await TopCli.getTopCharacters({limit})
    }
}

export const GetTopAnime =async(limit: number = 100) =>{
    const topAnime = await TopCli.getTopAnime({ limit });
    return topAnime;
}


export const watchEpisodeFn = async()=>{
    const eps = await VideoClient.getWatchRecentEpisodes()
    return eps
}


