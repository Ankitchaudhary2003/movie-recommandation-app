import axios from "axios";

export const getRecommendations = async (preference) => {
  const res = await axios.post("https://movie-recommandation-app-2.onrender.com/", {
    preference,
  });
  return res.data.movies;
};
