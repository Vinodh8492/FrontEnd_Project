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
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);



  const [savedSlides, setSavedSlides] = useState(() => {
    const savedSlidesFromStorage = localStorage.getItem('savedSlides');
    try {
      return savedSlidesFromStorage ? JSON.parse(savedSlidesFromStorage) : [];
    } catch (error) {
      console.log("Error parsing savedSlides from localStorage:", error);
      return [];
    }
  });


  const token = localStorage.getItem('token');
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsTokenPresent(!!token);

    if (!token) {

      localStorage.removeItem('savedSlides');
      setSavedSlides([]);
      setShowBookmarks(false);
    } else {

      const savedSlidesFromStorage = localStorage.getItem('savedSlides');
      try {
        setSavedSlides(savedSlidesFromStorage ? JSON.parse(savedSlidesFromStorage) : []);
      } catch (error) {
        console.log("Error parsing savedSlides from localStorage:", error);
        setSavedSlides([]);
      }
    }
  }, [!token]);




  useEffect(() => {
    localStorage.setItem('savedSlides', JSON.stringify(savedSlides));
  }, [savedSlides]);

  const [likedSlides, setLikedSlides] = useState([]);
  const toggleLike = (slideId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to your account first.");
      return;
    }

    if (likedSlides.includes(slideId)) {
      setLikedSlides(likedSlides.filter(id => id !== slideId));
    } else {
      setLikedSlides([...likedSlides, slideId]);
    }
  };


  const toggleSave = (slideId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to your account first.");
      return;
    }

    if (savedSlides.includes(slideId)) {
      setSavedSlides(savedSlides.filter(id => id !== slideId));
    } else {
      setSavedSlides([...savedSlides, slideId]);
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

  const [bookmarkedSlides, setBookmarkedSlides] = useState([]);



  const saveSlideToBookmarks = (slide) => {
    setBookmarkedSlides([...bookmarkedSlides, slide]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setIsTokenPresent(false);
    setIsNamePresent(false);
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

          />

        </div>
      )}


      {!showBookmarks && (
        <>
          {showRegister && (
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <img className={styles.cut} onClick={() => { setShowRegister(false) }} src={Cut} alt="cancel" />
                <RegisterPage onClose={() => setShowRegister(false)} />
              </div>
            </div>
          )}

          {showLogin && (
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <img className={styles.cut2} onClick={() => { setShowLogin(false) }} src={Cut} alt="cancel" />
                <LoginPage onClose={() => setShowLogin(false)} />
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
                    {isTokenPresent && (
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
              <img src={All} className={styles.all} alt="All" onClick={() => setCategory([])} />
              <img src={Medical} className={styles.health} alt="Health and Fitness" onClick={() => handleCategory({ target: { value: 'Health and Fitness' } })} />
              <img src={World} className={styles.travel} alt="Travel" onClick={() => handleCategory({ target: { value: 'Travel' } })} />
              <img src={Fruits} className={styles.food} alt="Food" onClick={() => handleCategory({ target: { value: 'Food' } })} />
              <img src={Education} className={styles.education} alt="Education" onClick={() => handleCategory({ target: { value: 'Education' } })} />
              <img src={India} className={styles.movie} alt="Movie" onClick={() => handleCategory({ target: { value: 'Movie' } })} />
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


                        {isTokenPresent && (
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
