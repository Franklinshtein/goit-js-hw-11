import { fetchImages } from './js/pixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formSearch: document.querySelector('.search-form'),
  buttonSearch: document.querySelector('.search-button'),
  inputSearch: document.querySelector('.search-input'),
  galleryInfo: document.querySelector('.gallery'),
  infinityBox: document.querySelector('.infinity-box'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let name = '';
let perPage = 40;
let page = 1;
let totalPages = 0;
let lightbox = new SimpleLightbox('.gallery a');

refs.formSearch.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreImages);

async function onSearch(event) {
  event.preventDefault();
  page = 1;
  refs.galleryInfo.innerHTML = '';

  name = refs.inputSearch.value.trim();

  fetchImages(name, page)
    .then((data) => {
      totalPages = Math.ceil(data.totalHits / perPage);

      if (data.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        createImageMarkup(data);
        
        if (page < totalPages) {
          refs.loadMoreBtn.classList.remove('is-hidden');
          refs.infinityBox.classList.add('is-hidden');
        } else {
          refs.loadMoreBtn.classList.add('is-hidden');
          refs.infinityBox.classList.remove('is-hidden');
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.infinityBox.classList.add('is-hidden');
      }
    })
    .catch((error) => console.log(error));
}

async function onLoadMoreImages() {
  page += 1;
  fetchImages(name, page)
    .then((data) => {
      createImageMarkup(data);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .lastElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (data.hits.length === 0) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreBtn.classList.add('is-hidden');
      }
    })
    .catch((error) => console.log(error));
}

async function createImageMarkup(data) {
  const markup = data.hits
    .map(
      (hit) =>
        `<div class="photo-card">
          <a class="image-link" href="${hit.largeImageURL}">
            <img class="photo" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="280" height="200" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${hit.likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${hit.views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${hit.comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${hit.downloads}</span>
            </p>
          </div>
        </div>`
    )
    .join('');
  refs.galleryInfo.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
