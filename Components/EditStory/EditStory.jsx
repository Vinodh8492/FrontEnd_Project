import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { editStory, createStory } from '../../Apis/stories';
import styles from './EditStory.module.css';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

function EditStory() {


  const { state } = useLocation();
  const navigate = useNavigate();
  const [stateData] = useState(state?.Story);
  const [formData, setFormData] = useState({
    Heading: '' || stateData?.Heading,
    Description: '' || stateData?.Description,
    Image: '' || stateData?.Image,
    Category: stateData?.Category || [],
    username: stateData?.username || name
  });

  const name = localStorage.getItem('name')
  if (!name) {
    navigate('/')
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const addCategory = (event) => {
    const Category = event.target.value;
    setFormData({ ...formData, Category: [Category] });
  };


  const handleSubmit = async () => {
    if (!formData.Heading || !formData.Description || !formData.Image || !formData.Category) {
      alert('Please fill in all fields.');
      return;
    }
    if (state?.edit) {
      await editStory(state.Story._id, formData);
    }
    alert('Story updated successfully')
    navigate('/');
  };

  useEffect(() => {
    console.log(formData);
    console.log(state.Story._id)
  }, []);

  return (
    <div>
      <div className={styles.slide}>
        <form className={styles.form}>
          <div className={styles.p1}>
            <h2 className={styles.Heading} >Heading :</h2>
            <input
              type="text"
              placeholder="Your Heading"
              name="Heading"
              value={formData.Heading}
              onChange={handleChange}
              className={styles.input}
              maxLength={21}
            />
            <br />
          </div>
          <div className={styles.p1}>
            <h2 className={styles.Description} >Description :</h2>
            <input
              type="text"
              placeholder="Your Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className={styles.input}
              maxLength={40}
            />
            <br />
          </div>
          <div className={styles.p1}>
            <h2 className={styles.Image} >Image :</h2>
            <input
              type="text"
              placeholder="Your Image URL"
              name="Image"
              value={formData.Image}
              onChange={handleChange}
              className={styles.input}
            />
            <br />
          </div>
          <div className={styles.p1}>
            <h2 className={styles.Category} >Category :</h2>
            <select className={styles.inputcategory} name="Category" onChange={addCategory}>
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
      <button className={styles.post} onClick={handleSubmit}>Post</button>
    </div>
  );
}

export default EditStory;
