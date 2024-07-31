import React, { useState, useEffect } from 'react';
import styles from './Bookmarks.module.css';
import LeftArrow from '../../Assets/Left.svg';
import RightArrow from '../../Assets/Right.svg';
import Cancel from '../../Assets/Cancel.svg';
import Edited from '../../Assets/Edited.svg';
import Saved from '../../Assets/Saved.svg';
import Save from '../../Assets/Save.svg';
import Like from '../../Assets/Like.svg';
import Liked from '../../Assets/Liked.svg'
import Share from '../../Assets/Share.svg';
import { likeSlide, removeLike } from '../../Apis/likedSlides';

function Bookmarks({
  savedSlides,
  setSavedSlides,
  toggleSlide,
  selectedSlide,
  setSelectedSlide,
  Story,
  navigate,
  handleShare,
  toggleLike,
  setLikedSlides,
  likedSlides }) {
  const [bookmarkIcons, setBookmarkIcons] = useState({});

  const name = localStorage.getItem('name')

  const initializeBookmarkIcons = () => {
    const icons = {};
    savedSlides.forEach(slideId => {
      icons[slideId] = Saved;
    });
    setBookmarkIcons(icons);
  };

  if (!localStorage.getItem('name')) {
    localStorage.clear()
  }


  const handleToggleSave = (slideId) => {
    const isAlreadySaved = savedSlides.includes(slideId);
    if (isAlreadySaved) {
      const updatedSavedSlides = savedSlides.filter(id => id !== slideId);
      setSavedSlides(updatedSavedSlides);
      setBookmarkIcons({ ...bookmarkIcons, [slideId]: Save });
    } else {
      setSavedSlides([...savedSlides, slideId]);
      setBookmarkIcons({ ...bookmarkIcons, [slideId]: Saved });
    }
  };

  const handleToggleLike = async (slideId) => {
    const username = localStorage.getItem('name')
    try {
      if (likedSlides.includes(slideId)) {
        const result = await removeLike(username, slideId);
        setLikedSlides(likedSlides.filter(id => id !== slideId));
      } else {
        const result1 = await likeSlide(username, slideId);
        setLikedSlides([...likedSlides, slideId]);
      }
    } catch (error) {
      console.error('Error liking/removing slide:', error);
      alert('Failed to like/unlike slide. Please try again.');
    }
  }

  useEffect(() => {
    localStorage.setItem('bookmarkIcons', JSON.stringify(bookmarkIcons));
  }, [bookmarkIcons]);

  useEffect(() => {
    const savedBookmarkIcons = JSON.parse(localStorage.getItem('bookmarkIcons'));
    if (savedBookmarkIcons) {
      setBookmarkIcons(savedBookmarkIcons);
    } else {
      initializeBookmarkIcons();
    }
  }, []);


  const handleGoToPreviousSlide = () => {
    const currentIndex = savedSlides.findIndex(id => id === selectedSlide);
    const prevIndex = (currentIndex - 1 + savedSlides.length) % savedSlides.length;
    setSelectedSlide(savedSlides[prevIndex]);
  };

  const handleGoToNextSlide = () => {
    const currentIndex = savedSlides.findIndex(id => id === selectedSlide);
    const nextIndex = (currentIndex + 1) % savedSlides.length;
    setSelectedSlide(savedSlides[nextIndex]);
  };

  const handleCancelSlide = () => {
    setSelectedSlide(null);
  };

  const handleEdit = (slideId) => {
    const slide = Story.find((story) => story._id === slideId);
    navigate("/edit", {
      state: {
        id: slide._id,
        Story: slide,
        edit: true,
      },
    });
  };


  useEffect(() => {
    initializeBookmarkIcons();
  }, []);

  if (savedSlides.length === 0) {
    return <div className={styles.no} >No saved slides.</div>;
  }

  return (
    <div className={styles.bookmarksWrapper}>
      {selectedSlide && (
        <div className={styles.selectedSlideOverlay}>
          <img src={LeftArrow} className={styles.leftArrow} onClick={handleGoToPreviousSlide} />
          <div className={styles.selectedSlideContent}>
            {Story.map(story => {
              if (story._id === selectedSlide) {
                return (
                  <>

                    <img className={styles.photos} src={story.Image} alt="Selected Story Image" />
                    <h2 className={styles.slidehead}>{story.Heading}</h2>
                    <p className={styles.slidedescription}>{story.Description}</p>
                    <div className={styles.bottomIcons}>
                      {story.username === name && (
                        <div className={styles.editContainer}>
                          <img src={Edited} onClick={() => handleEdit(selectedSlide)} className={styles.edit} />
                        </div>
                      )}
                      <img src={Cancel} className={styles.cancel} onClick={handleCancelSlide} />
                      <img src={bookmarkIcons[selectedSlide]} className={styles.save} onClick={() => handleToggleSave(selectedSlide)} />
                      <img src={likedSlides.includes(selectedSlide) ? Liked : Like} className={styles.like} onClick={() => handleToggleLike(selectedSlide)} />
                      <img src={Share} className={styles.share} onClick={handleShare} />
                    </div>
                  </>
                );
              }
            })}
          </div>
          <img src={RightArrow} className={styles.rightArrow} onClick={handleGoToNextSlide} />
          <div className={styles.horizontalLine}>
            {savedSlides.map((slideId) => (
              <div key={slideId} className={styles.break} onClick={() => setSelectedSlide(slideId)}></div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.bookmarksContainer}>
        {savedSlides.map((slideId) => {
          const slide = Story.find((story) => story._id === slideId);
          if (!slide) return null;
          return (
            <div key={slideId} className={styles.bookmark}>
              <div className={styles.categoryContainer}>
                <div className={styles.list}>
                  <div className={styles.infoLeft}>
                    <div className={styles.imageWrapper}>
                      <div className={styles.imageContainer} onClick={() => toggleSlide(slideId, slide)}>
                        <img src={slide.Image} alt="Bookmark Image" className={styles.storyImage} />
                      </div>
                      <div className={styles.storyDetails}>
                        <h2 className={styles.storyTitle}>{slide.Heading}</h2>
                        <p className={styles.storyDescription}>{slide.Description}</p>
                      </div>
                    </div>
                    {slide.username === name && (
                      <div className={styles.editContainer} onClick={() => handleEdit(slideId)}>
                        <img src={Edited} className={styles.Edit} />
                      </div>
                    )}
                    {selectedSlide && (
                      <div className={styles.bottomIcons}>
                        <img src={bookmarkIcons[slideId]} className={styles.save} onClick={() => handleToggleSave(slideId)} />
                        <img src={likedSlides.includes(slideId) ? Liked : Like} className={styles.like} onClick={() => handleToggleLike(slideId)} />
                        <img src={Share} className={styles.share} onClick={handleShare} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bookmarks;
