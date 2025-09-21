// src/pages/ViewingHistoryPage.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// We can reuse the same UserAnime type from the Dashboard
type UserAnime = {
  anime: {
    id: number;
    title: string;
  };
  episodes_watched: number;
  tracking_status: string;
  last_updated: string; // The API will send this as a string
};

const ViewingHistoryPage = () => {
  const [history, setHistory] = useState<UserAnime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch the user's full list, which is now sorted by the backend
        const response = await axios.get('/api/user-list/');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to fetch your viewing history.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) return <div className="page-content">Loading history...</div>;
  if (error) return <div className="page-content">{error}</div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Viewing History</h1>
      <div className="history-list">
        {history.length > 0 ? (
          history.map(item => (
            <div key={item.anime.id} className="history-item">
              <p>
                You updated <Link to={`/anime/${item.anime.id}`}><strong>{item.anime.title}</strong></Link> to status: <strong>{item.tracking_status}</strong> ({item.episodes_watched} episodes watched).
              </p>
              {/* Format the date to be more readable */}
              <span className="history-date">
                {new Date(item.last_updated).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p>You have no viewing history yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewingHistoryPage;