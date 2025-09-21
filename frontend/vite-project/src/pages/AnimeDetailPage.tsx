import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Reverted

type AnimeDetails = {
  id: number;
  title: string;
  synopsis: string;
  cover_image_url: string;
  total_episodes: number;
  status: string;
};
type TrackingStatus = "Watching" | "Plan to Watch" | "Completed" | "On-Hold" | "Dropped";
type UserTrackingData = {
  id: number;
  episodes_watched: number;
  tracking_status: TrackingStatus;
};

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAllDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [animeRes, trackingRes] = await Promise.all([
          axios.get(`/api/anime/${id}/`), // Reverted
          axios.get(`/api/user-list/?anime_id=${id}`) // Reverted
        ]);
        setAnime(animeRes.data);
        if (trackingRes.data && trackingRes.data.length > 0) {
          setTrackingData(trackingRes.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch anime details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDetails();
  }, [id]);

  const handleStatusUpdate = async (status: TrackingStatus, episodes?: number) => {
    if (!anime) return;
    const currentEpisodes = episodes !== undefined ? episodes : (trackingData?.episodes_watched || 0);
    try {
      if (trackingData) {
        await axios.put(`/api/user-list/${trackingData.id}/`, { // Reverted
          anime_id: anime.id,
          tracking_status: status,
          episodes_watched: currentEpisodes,
        });
      } else {
        await axios.post('/api/user-list/', { // Reverted
          anime_id: anime.id,
          tracking_status: status,
        });
      }
      alert(`'${anime.title}' status updated!`);
      navigate(0); // Simple way to refresh the page data
    } catch (err) {
      alert('Failed to update status.');
      console.error(err);
    }
  };

  if (isLoading) return <div className="page-content">Loading...</div>;
  if (error) return <div className="page-content">{error}</div>;
  if (!anime) return <div className="page-content">Anime not found.</div>;

  return (
    <div className="anime-detail-layout">
      <div className="left-column">
        <img src={anime.cover_image_url || `https://via.placeholder.com/300x420?text=${anime.title.replace(/ /g, '+')}`} alt={anime.title} className="detail-cover-image" />
        {trackingData ? (
          <div className="progress-widget">
            <h4>My Progress</h4>
            <p>Status: {trackingData.tracking_status}</p>
            <div className="episode-tracker">
              <button onClick={() => handleStatusUpdate(trackingData.tracking_status, trackingData.episodes_watched - 1)} disabled={trackingData.episodes_watched <= 0}>-</button>
              <span>{trackingData.episodes_watched} / {anime.total_episodes || '?'}</span>
              <button onClick={() => handleStatusUpdate(trackingData.tracking_status, trackingData.episodes_watched + 1)}>+</button>
            </div>
          </div>
        ) : (
          <div className="add-to-list-widget">
            <select onChange={(e) => handleStatusUpdate(e.target.value as TrackingStatus)} defaultValue="">
              <option value="" disabled>Add to List...</option>
              <option value="Watching">Watching</option>
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="Completed">Completed</option>
              <option value="On-Hold">On-Hold</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        )}
      </div>
      <div className="right-column">
        <h1 className="anime-title">{anime.title}</h1>
        <p className="anime-status">Status: {anime.status} | Episodes: {anime.total_episodes || 'N/A'}</p>
        <h2 className="section-title">Synopsis</h2>
        <p className="anime-synopsis">{anime.synopsis || 'No synopsis available.'}</p>
      </div>
    </div>
  );
};

export default AnimeDetailPage;