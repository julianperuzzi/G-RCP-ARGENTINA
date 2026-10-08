import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function PortalAssetPhotos({ photos, getBlob, onPreview }) {
  const [urls, setUrls] = useState({});
  useEffect(() => {
    let active = true;
    const created = [];
    setUrls({});
    Promise.allSettled(photos.map(async (photo) => {
      const blob = await getBlob(photo);
      if (!active || !blob) return;
      const url = URL.createObjectURL(blob);
      created.push(url);
      if (active) setUrls((current) => ({ ...current, [photo.id]: url }));
    }));
    return () => {
      active = false;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos, getBlob]);
  return <div className="portal-asset-photos">
    {photos.map((photo) => <button key={photo.id} type="button" onClick={() => onPreview(photo)} aria-label={`Ver foto ${photo.title || photo.file_name}`}>
      {urls[photo.id] ? <img src={urls[photo.id]} alt={photo.title || 'Foto del equipo'} loading="lazy" /> : <span>Foto</span>}
      <small>{photo.title || photo.file_name}</small>
    </button>)}
  </div>;
}

PortalAssetPhotos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    file_name: PropTypes.string,
  })).isRequired,
  getBlob: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};
