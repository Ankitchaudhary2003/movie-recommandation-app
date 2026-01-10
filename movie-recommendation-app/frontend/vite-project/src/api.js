import axios from "axios";

export const getRecommendations = async (preference) => {
  const res = await axios.post("http://localhost:5000/recommend", {
    preference,
  });
  return res.data.movies;
};
