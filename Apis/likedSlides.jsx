import React from "react";
import axios from 'axios'
const backendUrl = 'https://backend-project-6141.onrender.com/liked'

export const likeSlide = async (username, slideId) => {
  try {
    const reqUrl = `${backendUrl}/like/${username}`;
    const response = await axios.post(reqUrl, { slideId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to like slide.');
  }
};

export const getLikedSlides = async (username) => {
  try {
    const reqUrl = `${backendUrl}/existing/${username}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch liked slides.');
  }
};

export const removeLike = async (username, slideId) => {
  try {
    const reqUrl = `${backendUrl}/delete/${username}`;
    const response = await axios.post(reqUrl, { slideId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete slide like');
  }
};
