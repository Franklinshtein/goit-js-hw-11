import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const KEY = "35985154-1fa347b3ddcc8b13ab706f11a";

async function fetchImages(name, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export {fetchImages}