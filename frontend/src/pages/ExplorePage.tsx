// src/pages/ExplorePage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimeCard } from '../components/AnimeCard.tsx';
import axios from 'axios';

// Define the shape of the data for a single anime from the main database
type Anime = {
  id: number;
  title: string;
  cover_image_url: string;
  total_episodes: number;
};

const ExplorePage = () => {
  // State to hold the list of all anime
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllAnime = async () => {
      try {
        // Fetch the full list of anime from our backend
        const response = await axios.get('/api/anime/');
        setAllAnime(response.data);
      } catch (err) {
        setError('Failed to fetch the anime catalog.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAnime();
  }, []); // Empty array means this runs only once on component mount

  if (isLoading) return <div className="page-content">Loading all anime...</div>;
  if (error) return <div className="page-content">{error}</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Explore All Anime</h1>
      
      <div className="anime-grid">
        {allAnime.map(anime => (
          // Each card links to that anime's detail page
          <Link to={`/anime/${anime.id}`} key={anime.id} className="anime-card-link">
            <AnimeCard
              title={anime.title}
              imageUrl={anime.cover_image_url || `https://via.placeholder.com/225x320?text=${anime.title.replace(/ /g, '+')}`}
              // For the explore page, we don't have user-specific progress
              progress={`${anime.total_episodes || '?'} Episodes`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;