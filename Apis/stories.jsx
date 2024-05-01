import React from "react";
import axios from 'axios'
const backendUrl = 'https://backend-project-6141.onrender.com/story'

export const createStory = async (stories) => {
  try {
    const reqUrl = `${backendUrl}/create`;

    const response = await axios.post(reqUrl, stories);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create stories.');
  }
};


export const editStory = async (storyId, updatedFormData) => {
  try {
    const reqUrl = `${backendUrl}/edit/${storyId}`;

    const response = await axios.put(reqUrl, updatedFormData);
    return response.data;
  } catch (error) {
    console.error('Error editing story:', error);

  }
};


export const allStories = async (filter) => {
  try {
    const reqUrl = `${backendUrl}/getall?Category=${filter.Category}`;
    const response = await axios.get(reqUrl)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getStoriesById = async (storyId) => {
  try {
    const reqUrl = `${backendUrl}/details/${storyId}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);

  }
};



