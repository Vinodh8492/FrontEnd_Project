import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Home.module.css';
import All from '../../Assets/All.svg';
import Medical from '../../Assets/Medical.svg';
import World from '../../Assets/World.svg';
import Fruits from '../../Assets/Fruits.svg';
import India from '../../Assets/India.svg';
import Education from '../../Assets/Education.svg';
import Like from '../../Assets/Like.svg';
import Save from '../../Assets/Save.svg';
import Share from '../../Assets/Share.svg';
import Cancel from '../../Assets/Cancel.svg';
import Edit from '../../Assets/Edit.svg';
import LeftArrow from '../../Assets/Left.svg';
import RightArrow from '../../Assets/Right.svg';
import Cut from '../../Assets/Cut.svg';
import Photo from '../../Assets/Photo.svg';
import About from '../../Assets/About.svg';
import Saved from '../../Assets/Saved.svg';
import Liked from '../../Assets/Liked.svg';
import Edited from '../../Assets/Edited.svg';
import Bookmarks from '../Bookmarks/Bookmarks';
import { allStories, getStoriesById } from '../../Apis/stories';
import { likeSlide, getLikedSlides, removeLike } from '../../Apis/likedSlides';
import { saveSlide, getSavedSlides, removeSlide } from '../../Apis/savedSlides';
import RegisterPage from '..//../Pages/RegisterPage/RegisterPage';
import LoginPage from '../../Pages/LoginPage/LoginPage'
import StoryPage from '../../Pages/StoryPage/StoryPage';

function Home() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [Category, setCategory] = useState([]);
  const [Story, setStory] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMore, setShowMore] = useState({});
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const username = localStorage.getItem('name');

  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [showStoryPageOverlay, setShowStoryPageOverlay] = useState(false);

  const name = localStorage.getItem('name')
  if (!name) {
    localStorage.clear()
  }
  

  const [savedSlides, setSavedSlides] = useState([]);

  useEffect(() => {
    const fetchSavedSlides = async () => {
      try {
        const slides = await getSavedSlides(name);
        console.log("slides is:", slides.savedData)
        setSavedSlides(slides.savedData);
      } catch (error) {
        console.error('Failed to fetch saved slides:', error);
        setSavedSlides([]);
      }
    };
    fetchSavedSlides();
  }, [name]);

  const [likedSlides, setLikedSlides] = useState([]);

  useEffect(() => {
    const fetchLikedSlides = async () => {
      try {
        const slides = await getLikedSlides(name);
        console.log("slides is:", slides.likedData)
        setLikedSlides(slides.likedData);
      } catch (error) {
        console.error('Failed to fetch liked slides:', error);
        setSavedSlides([]);
      }
    };
    fetchLikedSlides();
  }, [name]);

  const token = localStorage.getItem('token');
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsTokenPresent(!!token);

    if (!token) {
      setShowBookmarks(false);
    } else {
      const likedSlidesFromStorage = localStorage.getItem('likedSlides');
      try {
      } catch (error) {
        console.log("Error parsing savedSlides from localStorage:", error);
        setSavedSlides([]);
        setLikedSlides([])
      }
    }
  }, [!token]);


  const toggleLike = async (slideId) => {
    const username = localStorage.getItem('name')
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to your account first.");
      return;
    }
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
  };


  const toggleSave = async (slideId) => {
    const username = localStorage.getItem('name')
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      if (savedSlides.includes(slideId)) {
        const result = await removeSlide(username, slideId);
        alert(result.message)
        setSavedSlides(savedSlides.filter(id => id !== slideId));
      } else {
        const result1 = await saveSlide(username, slideId);
        setSavedSlides([...savedSlides, slideId]);
      }
    } catch (error) {
      console.error('Error saving/removing slide:', error);
      alert('Failed to save/remove slide. Please try again.');
    }
  };

  const toggleStoryPageOverlay = () => {
    setShowStoryPageOverlay(!showStoryPageOverlay);
  };

  const fetchAllStories = async () => {
    const filterCategory = Category.join(",");
    const response = await allStories({ Category: filterCategory });
    setStory(response.data);
  };

  const fetchStoriesById = async () => {
    if (!id) return;
    const response = await getStoriesById(id);
    setStory(response.data);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('name');
    setIsTokenPresent(!!token);
    fetchAllStories();
    fetchStoriesById();
  }, []);

  const handleCategory = (event) => {
    const selectedCategory = event.target.value;
    setCategory([selectedCategory]);
  };

  const toggleSlide = (slideId, storyData) => {
    setSelectedSlide(slideId);
    setSelectedStory(storyData);
    const currentIndex = Story.findIndex(story => story._id === slideId);
    setCurrentIndex(currentIndex);
  };

  const goToPreviousSlide = () => {
    const category = selectedStory.Category;
    const storiesInCategory = groupedStories[category];
    const currentIndexInCategory = storiesInCategory.findIndex(story => story._id === selectedSlide);
    const prevIndex = (currentIndexInCategory - 1 + storiesInCategory.length) % storiesInCategory.length;
    const prevSlideId = storiesInCategory[prevIndex]._id;
    toggleSlide(prevSlideId, storiesInCategory[prevIndex]);
  };

  const goToNextSlide = () => {
    const category = selectedStory.Category;
    const storiesInCategory = groupedStories[category];
    const currentIndexInCategory = storiesInCategory.findIndex(story => story._id === selectedSlide);
    const nextIndex = (currentIndexInCategory + 1) % storiesInCategory.length;
    const nextSlideId = storiesInCategory[nextIndex]._id;
    toggleSlide(nextSlideId, storiesInCategory[nextIndex]);
  };

  const cancelSlide = () => {
    setSelectedSlide(null);
  };

  const groupStoriesByCategory = () => {
    const groupedStories = {};
    Story.forEach((story) => {
      const { Category: category } = story;
      groupedStories[category] = groupedStories[category] || [];
      groupedStories[category].push(story);
    });
    return groupedStories;
  };

  const groupedStories = groupStoriesByCategory();

  const handleSeeMore = (category) => {
    setShowMore({ ...showMore, [category]: true });
  };

  const handleSignIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsTokenPresent(true);
    }
  };

  const handleShare = () => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert('First login to your account first')
    }
    if (token) {
      const slideUrl = `${window.location.origin}/slide/${selectedSlide}`;

      navigator.clipboard.writeText(slideUrl)
        .then(() => {
          alert('Slide link copied to clipboard!');
        })
        .catch((error) => {
          console.error('Error copying link:', error);
        });
    }
  };

  const toggleProfileOverlay = () => {
    setShowProfileOverlay(!showProfileOverlay);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setIsTokenPresent(false);
    setShowProfileOverlay(false);
    localStorage.removeItem('savedSlides');
    setSavedSlides([]);
  };

  return (
    <div className={styles.body}>

      <div className={styles.header}>
        <h1 className={styles.title}> Swip Tory </h1>
        {!isTokenPresent && (
          <>
            <button className={styles.register} onClick={() => setShowRegister(true)}>Register Now</button>
            <button className={styles.sign} onClick={() => { setShowLogin(true); handleSignIn(); }}>Sign In</button>
          </>
        )}
        {isTokenPresent && (
          <>
            <button className={styles.btn1} onClick={() => setShowBookmarks(!showBookmarks)}>Bookmarks</button>
            {isTokenPresent && (
              <button className={styles.btn2} onClick={toggleStoryPageOverlay}>Add Story</button>
            )}
            <img className={styles.photo} src={Photo} alt="Photo of user" />
            <div className={styles.profile}>
              <img className={styles.about} src={About} alt="About user" onClick={toggleProfileOverlay} />
              {showProfileOverlay && (
                <div className={styles.profileOverlay}>
                  <span className={styles.name}>{username}</span>
                  <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showStoryPageOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <img className={styles.cut} onClick={toggleStoryPageOverlay} src={Cut} alt="cancel" />
            <StoryPage onClose={toggleStoryPageOverlay} />
          </div>
        </div>
      )}

      {showBookmarks && (
        <div className={styles.bookmarksWrapper}>
          <h1 className={styles.book} > Your Bookmarks</h1>
          <Bookmarks
            savedSlides={savedSlides}
            setSavedSlides={setSavedSlides}
            toggleSlide={toggleSlide}
            handleShare={handleShare}
            selectedSlide={selectedSlide}
            setSelectedSlide={setSelectedSlide}
            Story={Story}
            navigate={navigate}
            toggleLike={toggleLike}
            likedSlides={likedSlides}
            setLikedSlides={setLikedSlides}
          />
        </div>
      )}

      {!showBookmarks && (
        <>
          {showRegister && (
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <img className={styles.cut} onClick={() => { setShowRegister(false) }} src={Cut} alt="cancel" />
                <RegisterPage />
              </div>
            </div>
          )}

          {showLogin && (
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <img className={styles.cut2} onClick={() => { setShowLogin(false) }} src={Cut} alt="cancel" />
                <LoginPage />
              </div>
            </div>
          )}

          {selectedSlide && (
            <div className={styles.selectedSlideOverlay}>
              <img src={LeftArrow} className={styles.leftArrow} onClick={goToPreviousSlide} />
              <div className={styles.selectedSlideContent}>
                <img className={styles.photos} src={selectedStory.Image} alt="Selected Story Image" />
                <h2 className={styles.slidehead}>{selectedStory.Heading}</h2>
                <p className={styles.slidedescription}>{selectedStory.Description}</p>
                <div className={styles.bottomIcons}>
                  {savedSlides.includes(selectedSlide) ? (
                    <img src={Saved} className={isTokenPresent ? styles.save : styles.saved} onClick={() => toggleSave(selectedSlide)} />
                  ) : (
                    <img src={Save} className={isTokenPresent ? styles.save : styles.saved} onClick={() => toggleSave(selectedSlide)} />
                  )}
                  <div className={styles.editContainer}>
                    {isTokenPresent && selectedStory && name === selectedStory.username && (
                      <img src={Edited} className={styles.edit} onClick={() => {
                        navigate("/edit", {
                          state: {
                            id: selectedStory._id,
                            Story: selectedStory,
                            edit: true,
                          },
                        });
                      }} />
                    )}
                  </div>
                  {likedSlides.includes(selectedSlide) ? (
                    <img src={Liked} className={isTokenPresent ? styles.like : styles.liked} onClick={() => toggleLike(selectedSlide)} />
                  ) : (
                    <img src={Like} className={isTokenPresent ? styles.like : styles.liked} onClick={() => toggleLike(selectedSlide)} />
                  )}
                  <img src={Cancel} className={isTokenPresent ? styles.cancel : styles.cancelled} onClick={cancelSlide} />
                  <img src={Share} className={isTokenPresent ? styles.share : styles.shared} onClick={handleShare} />
                </div>
              </div>
              <img src={RightArrow} className={styles.rightArrow} onClick={goToNextSlide} />
              <div className={styles.horizontalLine}>
                {Story.map((story, index) => (
                  <div key={story._id} className={styles.break} onClick={() => toggleSlide(story._id, story)}></div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.imageswrapper} >
            <div className={styles.images}>
              <div className={styles.newidv} >
                <img src={All} className={styles.all} alt="All" onClick={() => setCategory([])} />
                <h1 className={styles.newall} onClick={() => setCategory([])}>All</h1>
              </div>

              <div className={styles.newidv} >
                <img src={Medical} className={styles.health} alt="Health and Fitness" onClick={() => handleCategory({ target: { value: 'Health and Fitness' } })} />
                <h1 className={styles.newhealth} onClick={() => handleCategory({ target: { value: 'Health and Fitness' } })}>Health &</h1>
                <h1 className={styles.newfit} onClick={() => handleCategory({ target: { value: 'Health and Fitness' } })} >Fitness</h1>
              </div>

              <div className={styles.newidv} >
                <img src={World} className={styles.travel} alt="Travel" onClick={() => handleCategory({ target: { value: 'Travel' } })} />
                <h1 className={styles.newtravel} onClick={() => handleCategory({ target: { value: 'Travel' } })} >Travel</h1>
              </div>

              <div className={styles.newidv} >
                <img src={Fruits} className={styles.food} alt="Food" onClick={() => handleCategory({ target: { value: 'Food' } })} />
                <h1 className={styles.newfood} onClick={() => handleCategory({ target: { value: 'Food' } })}>Food</h1>
              </div>

              <div className={styles.newidv} >
                <img src={Education} className={styles.education} alt="Education" onClick={() => handleCategory({ target: { value: 'Education' } })} />
                <h1 className={styles.newedu} onClick={() => handleCategory({ target: { value: 'Education' } })}>Education</h1>
              </div>

              <div className={styles.newidv} >
                <img src={India} className={styles.movie} alt="Movie" onClick={() => handleCategory({ target: { value: 'Movie' } })} />
                <h1 className={styles.newmov} onClick={() => handleCategory({ target: { value: 'Movie' } })}>Movie</h1>
              </div>
            </div>
          </div>

          <div className={styles.required}>
            {Object.keys(groupedStories).map((category) => (
              <div key={category} style={{ display: Category.length === 0 || Category.includes(category) ? 'block' : 'none' }}>
                <div className={styles.req}>
                  <h1>Top Stories about {category}</h1>
                </div>
                <div className={styles.categoryContainer}>
                  {groupedStories[category].map((data, index) => (
                    <div key={data._id} className={styles.list} style={{ display: (index < 4 || showMore[category]) ? 'block' : 'none' }}>
                      <div className={styles.infoLeft}>
                        <div className={styles.imageWrapper}>
                          <div className={styles.imageContainer} onClick={() => toggleSlide(data._id, data)}>
                            <img src={data.Image} alt="Story Image" className={styles.storyImage} />
                          </div>

                          <div className={styles.storyDetails}>
                            <h2 className={styles.storyTitle}>{data.Heading}</h2>
                            <p className={styles.storyDescription}>{data.Description}</p>
                          </div>
                        </div>

                        {isTokenPresent && name === data.username && (
                          <div className={styles.editContainer} onClick={() => {
                            navigate("/edit", {
                              state: {
                                id: data._id,
                                Story: data,
                                edit: true,
                              },
                            });
                          }}>
                            <img src={Edited} className={styles.Edit} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {groupedStories[category].length > 4 && !showMore[category] && (
                    <button className={styles.see} onClick={() => handleSeeMore(category)}>
                      See More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

}

export default Home;
