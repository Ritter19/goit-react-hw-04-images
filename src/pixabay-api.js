import axios from 'axios';

export const BASE_URL = 'https://pixabay.com/api/';
// My goit-js-hw-11 API
const API_KEY = '51028814-fcea6b5a1dfbba86f24da2f1c';
export const getAPI = async (query, page) => {
  const url = `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;
  const response = await axios.get(url);

  return response.data;
};
