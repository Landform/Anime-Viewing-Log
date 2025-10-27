import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimeCard } from '../components/AnimeCard.tsx';
import axios from 'axios'; // Reverted

type UserAnime = {
  id: number;
  anime: {
    id: number;
    title: string;
    cover_image_url: string;
    total_episodes: number;
  };
  episodes_watched: number;
};
type TrackingStatus = "Watching" | "Plan to Watch" | "Completed" | "On-Hold" | "Dropped";

const DashboardPage = () => {
  const [animeList, setAnimeList] = useState<UserAnime[]>([]);
  const [activeStatus, setActiveStatus] = useState<TrackingStatus>('Watching');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/user-list/?status=${activeStatus}`); // Reverted
        setAnimeList(response.data);
      } catch (err) {
        setError(`Failed to fetch your '${activeStatus}' list.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserList();
  }, [activeStatus]);

  if (isLoading) return <div className="page-content">Loading your '{activeStatus}' list...</div>;
  if (error) return <div className="page-content">{error}</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">My Anime Listssss</h1>
      <nav className="list-navigation">
        {(["Watching", "Plan to Watch", "Completed", "On-Hold", "Dropped"] as TrackingStatus[]).map(status => (
          <button
            key={status}
            className={activeStatus === status ? 'active' : ''}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
      </nav>
      <div className="anime-grid">
        {animeList.length > 0 ? (
          animeList.map(item => (
            <Link to={`/anime/${item.anime.id}`} key={item.id} className="anime-card-link">
              <AnimeCard
                title={item.anime.title}
                imageUrl={item.anime.cover_image_url || `https://via.placeholder.com/225x320?text=${item.anime.title.replace(/ /g, '+')}`}
                progress={`${item.episodes_watched} / ${item.anime.total_episodes || '?'}`}
              />
            </Link>
          ))
        ) : (
          <p>You have no anime in your '{activeStatus}' list.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;