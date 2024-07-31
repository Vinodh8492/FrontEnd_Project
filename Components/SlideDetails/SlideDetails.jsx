import React, { useEffect, useState } from 'react';
import styles from './SlideDetails.module.css'
import { useParams } from 'react-router-dom';
import { getStoriesById } from '../../Apis/stories';

function SlideDetails() {
  const { id } = useParams();
  const [slideData, setSlideData] = useState('');

  useEffect(() => {
    console.log('Fetching slide data for ID:', id);
    getStoriesById(id)
      .then((data) => {
        console.log('Slide data:', data);
        setSlideData(data);
      })
      .catch((error) => {
        console.error('Error fetching slide data:', error);
      });
  }, [id]);

  return (
    <div>
      {slideData ? (
        <div className={styles.body} >
          <h1 className={styles.heading} >{slideData.data.Heading}</h1>
          <h2 className={styles.description} >{slideData.data.Description}</h2>
          <img className={styles.image} src={slideData.data.Image} alt="Slide" />
        </div>
      ) : (
        <p>Invalid Information</p>
      )}
    </div>
  );
}

export default SlideDetails;
