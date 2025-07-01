import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import ButtonLoadingSpinner from '../../components/ButtonLoadingSpinners';


const RatingModal = ({ isOpen, onClose, onSubmit, productId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setReview('');
    setMedia(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        rating,
        review,
        media,
        productId
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rating-modal-overlay">
      <div className="rating-modal">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>

        <h2>Add Review</h2>
        <p className="subtitle">How was the item?</p>
        <p className="description">Let us know your experience with the item in a few words!</p>

        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star-button ${
                (hoveredRating || rating) >= star ? 'active' : ''
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <button className="clear-rating" onClick={() => setRating(0)}>
              Clear
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Write your review <span className="required">*</span></label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you think.."
              required
            />
          </div>

          <button
            type="button"
            className="media-upload-button"
            onClick={() => document.getElementById('media-upload').click()}
          >
            📷 Attach Photo
          </button>
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files[0])}
            style={{ display: 'none' }}
          />
          {media && <div className="media-preview">{media.name.length > 30 ? media.name.substring(0, 30) + "..." : media.name}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={!rating || !review}
          >
            {isLoading ? <ButtonLoadingSpinner /> : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;