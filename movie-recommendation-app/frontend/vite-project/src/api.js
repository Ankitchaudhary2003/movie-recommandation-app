import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getRecommendations = async (preference) => {
  console.log("API_URL =>", API_URL); // DEBUG

  const res = await axios.post(
    `${API_URL}/recommend`,
    { preference }
  );

  return res.data.movies;
};
