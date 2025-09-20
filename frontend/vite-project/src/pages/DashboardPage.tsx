// src/pages/DashboardPage.tsx (Full, Data-Driven Version)

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimeCard } from '../components/AnimeCard.tsx';

// Define the structure of the data we expect from the API
type UserAnime = {
  anime: {
    id: number;
    title: string;
    cover_image_url: string;
    total_episodes: number;
  };
  episodes_watched: number;
};

const DashboardPage = () => {
  const [watchingList, setWatchingList] = useState<UserAnime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchingList = async () => {
      try {
        const response = await axios.get('/api/user-list/?status=Watching');
        setWatchingList(response.data);
      } catch (err) {
        setError('Failed to fetch your anime list.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchingList();
  }, []);

  if (isLoading) {
    return <div className="page-content">Loading...</div>;
  }

  if (error) {
    return <div className="page-content">{error}</div>;
  }

  return (
    <div className="page-content">
      <h1 className="page-title">My Anime Lists</h1>
      
      <nav className="list-navigation">
        <a href="#" className="active">Watching</a>
        <a href="#">Plan to Watch</a>
        <a href="#">On-Hold</a>
        <a href="#">Completed</a>
        <a href="#">Dropped</a>
      </nav>
      
      <div className="anime-grid">
        {watchingList.length > 0 ? (
          watchingList.map(item => (
            <AnimeCard
              key={item.anime.id}
              title={item.anime.title}
              imageUrl={item.anime.cover_image_url || `https://via.placeholder.com/225x320?text=${item.anime.title.replace(/ /g, '+')}`}
              progress={`${item.episodes_watched} / ${item.anime.total_episodes || '?'}`}
            />
          ))
        ) : (
          <p>You are not currently watching any anime.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;