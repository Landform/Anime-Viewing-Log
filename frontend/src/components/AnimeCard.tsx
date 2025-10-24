// This defines the "shape" of the data (props) that this component expects to receive.
type AnimeCardProps = {
  title: string;
  imageUrl: string;
  progress: string;
};

// We are using a named export.
export const AnimeCard = ({ title, imageUrl, progress }: AnimeCardProps) => {
  return (
    <div className="anime-card">
      <img src={imageUrl} alt={title} className="anime-card-image" />
      <h3 className="anime-card-title">{title}</h3>
      <p className="anime-card-progress">{progress}</p>
    </div>
  );
};