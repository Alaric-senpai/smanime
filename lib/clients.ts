import { AnimeClient, JikanResponse, Anime, GenresClient, WatchClient, SchedulesClient, TopClient } from '@tutkli/jikan-ts';

const genreClient = new GenresClient();

const watchClient = new WatchClient()

const animeClient = new AnimeClient();

const scheduleClient = new SchedulesClient()

const topClient = new TopClient()

export {
    genreClient as GenreClient,
    watchClient as VideoClient,
    animeClient as Animecli,
    scheduleClient,
    topClient as TopCli 
}
