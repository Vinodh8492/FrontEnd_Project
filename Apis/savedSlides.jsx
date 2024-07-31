import React from "react";
import axios from 'axios'
const backendUrl = 'https://backend-project-6141.onrender.com/saved'

export const saveSlide = async (username, slideId) => {
  try {
    const reqUrl = `${backendUrl}/${username}`;
    const response = await axios.post(reqUrl, { slideId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save slide.');
  }
};

export const getSavedSlides = async (username) => {
  try {
    const reqUrl = `${backendUrl}/existing/${username}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch saved slides.');
  }
};

export const removeSlide = async (username, slideId) => {
  try {
    const reqUrl = `${backendUrl}/delete/${username}`;
    const response = await axios.post(reqUrl, { slideId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save slide.');
  }
};
