import React, { useState } from 'react';
import styles from './Story.module.css';
import { createStory } from '../../Apis/stories';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

function Story() {

  const name = localStorage.getItem('name')


  const [slides, setSlides] = useState([
    {
      Heading: '',
      Description: '',
      Image: '',
      Category: [],
      username : name
    },
  ]);

  const [activeSlide, setActiveSlide] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedSlides = slides.map((slide, index) =>
      index === activeSlide ? { ...slide, [name]: value } : slide
    );
    setSlides(updatedSlides);
  };

  const addCategory = (event) => {
    const skill = event.target.value;
    if (!slides[activeSlide].Category.includes(skill)) {
      const updatedSlides = [...slides];
      updatedSlides[activeSlide].Category.push(skill);
      setSlides(updatedSlides);
    }
  };

  const handleSubmit = async () => {
    if (slides.length < 3) {
      return alert('You need to add at least 3 slides to post a story.');
    }

   
    if (!isValidUrl(slides[activeSlide].Image)) {
      return alert('Invalid image URL');
    }

    
    const response = await createStory(slides);
    alert(response?.message);
    window.location.reload()
  };

  const handleNextSlide = () => {
    setActiveSlide((prevSlide) => Math.min(prevSlide + 1, slides.length - 1));
  };

  const handlePreviousSlide = () => {
    setActiveSlide((prevSlide) => Math.max(prevSlide - 1, 0));
  };

  const handleAddSlide = () => {
    if (slides.length < 6) {
      const newSlide = {
        Heading: '',
        Description: '',
        Image: '',
        Category: slides[0].Category,
        username : name 
      };
      setSlides([...slides, newSlide]);
      setActiveSlide(slides.length);
    } else {
      alert('You can only add up to 6 slides.');
    }
  };

  return (
    <div>

      <div className={styles.head}>

        {slides.map((slide, index) => (
          <button
            key={index}
            className={index === activeSlide ? styles.activeSlideButton : styles.slideButton}
            onClick={() => setActiveSlide(index)}
          >
            Slide {index + 1}
          </button>
        ))}
        <button className={styles.add} onClick={handleAddSlide}>
          Add +
        </button>
      </div>

      <div className={styles.slide}>
        <form className={styles.form}>
          <div className={styles.p1}>
            <h2 className={styles.heading}>Heading :</h2>
            <input
              type="text"
              placeholder="Your Heading"
              name="Heading"
              value={slides[activeSlide].Heading}
              onChange={handleChange}
              className={styles.headinginput}
              maxLength={21}
            />
            <br />
          </div>
          <div className={styles.p2}>
            <h2 className={styles.heading}>Description :</h2>
            <input
              type="text"
              placeholder="Story Description"
              name="Description"
              value={slides[activeSlide].Description}
              onChange={handleChange}
              className={styles.descriptioninput}
              maxLength={40}
            />
            <br />
          </div>
          <div className={styles.p3}>
            <h2 className={styles.heading}>Image :</h2>
            <input
              type="text"
              placeholder="Add Image URL"
              name="Image"
              value={slides[activeSlide].Image}
              onChange={handleChange}
              className={styles.imageinput}
            />
            <br />
          </div>
          <div className={styles.p4}>
            <h2 className={styles.heading}>Category :</h2>
            <select className={styles.categoryinput} name="skills" onChange={addCategory}>
              <option disabled selected>
                Please select Category
              </option>
              {DEFAULT_CATEGORIES.map((element, index) => (
                <option key={index}>{element}</option>
              ))}
            </select>
            <br />
          </div>
        </form>
        <br />
      </div>


      <div className={styles.last} >
        <button className={styles.previous} onClick={handlePreviousSlide}>Previous</button>
        <button className={styles.next} onClick={handleNextSlide}>Next</button>
        <button className={styles.post} onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
}


function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export default Story;
