import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './display.css'

const Displaypicture = ({userId}) => {
  const [pictures, setPictures] = useState([]);
  console.log(userId);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get(`https://apptest-88ck.onrender.com/get-pictures/${userId}`, { responseType: 'json' });

        console.log('Response data:', response.data);

        // Assuming the response.data is an array
        setPictures(response.data);
        console.log(pictures[0]?.data.data, 'this pic');
      } catch (error) {
        console.error('Error fetching pictures:', error.message);
      }
    };

    fetchPictures();
  }, [userId]);

  return (
    <div>
      {pictures.map((picture, index) => (
        <img
          id='examImg'
          key={index}
          src={convertBufferToImageSource(picture.data)}
          alt={`Image ${index}`}
        />
      ))}
    </div>
  );
};

const convertBufferToImageSource = (bufferData) => {
  try {
    // Create a Blob from the Buffer data
    const blob = new Blob([Uint8Array.from(bufferData.data)], {
      type: bufferData.contentType,
    });

    // Create a data URL from the Blob
    const dataUrl = URL.createObjectURL(blob);

    return dataUrl;
  } catch (error) {
    console.error('Error converting buffer to image:', error);
    return ''; // or a default image source
  }
};

export default Displaypicture;
