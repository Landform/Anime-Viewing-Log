import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Reverted

type AnimeSearchResult = {
  id: number;
  title: string;
  synopsis: string;
  cover_image_url: string;
};

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      const response = await axios.get(`/api/anime/?search=${searchTerm}`); // Reverted
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Search for Anime</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., Attack on Titan"
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <div className="search-results">
        {isLoading && <div>Loading results...</div>}
        {error && <div className="error-message">{error}</div>}
        {hasSearched && !isLoading && results.length === 0 && (
          <div>No results found for "{searchTerm}".</div>
        )}
        {results.map(anime => (
          <Link to={`/anime/${anime.id}`} key={anime.id} className="search-result-item">
            <img 
              src={anime.cover_image_url || `https://via.placeholder.com/150x210?text=${anime.title.replace(/ /g, '+')}`} 
              alt={anime.title} 
              className="search-result-image"
            />
            <div className="search-result-details">
              <h3 className="search-result-title">{anime.title}</h3>
              <p className="search-result-synopsis">
                {anime.synopsis ? `${anime.synopsis.substring(0, 200)}...` : 'No synopsis available.'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;