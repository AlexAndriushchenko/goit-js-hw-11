import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './fetchGallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  startBtn: document.querySelector('button[data-start]'),
  input: document.querySelector('input'),
};

const galleryApiService = new ApiService();
let isShown = 0;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  if (evt.currentTarget.elements.searchQuery.value.trim() === '') {
    return (innerHTML = '');
  }

  galleryApiService.query = evt.target.elements.searchQuery.value.trim();
  isShown = 0;
  refs.divEl.innerHTML = '';
  galleryApiService.resetPage();
  fetchGallery();
}

function onLoadMore() {
  galleryApiService.incrementPage();
  fetchGallery();
}

async function fetchGallery() {
  refs.loadMoreBtn.classList.add('is-hidden');

  const response = await galleryApiService.fetchGallery();
  const { hits, total } = response;

  if (!hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  renderGallery(hits);
  isShown += hits.length;
  if (isShown < total) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
  if (isShown >= total) {
    Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
  }
}

function renderGallery(elements) {
  console.log(elements);
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        // return `
        //   <a class="gallery__link" href="${largeImageURL}">
        //         <div class="photo-card">
        //             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        //             <div class="info">
        //                 <p class="info-item">
        //                     <b>Likes</b>
        //                     ${likes}
        //                 </p>
        //                 <p class="info-item">
        //                     <b>Views</b>
        //                     ${views}
        //                 </p>
        //                 <p class="info-item">
        //                     <b>Comments</b>
        //                     ${comments}
        //                 </p>
        //                 <p class="info-item">
        //                     <b>Downloads</b>
        //                     ${downloads}
        //                 </p>
        //             </div>
        //         </div>
        //     </a>`;
        return `
    <div class="photo-card">
        <a class="gallery-link" href="${largeImageURL}">
   <img src="${webformatURL}" alt="${tags}"  loading="lazy" /></a>
  <div class="info">
     <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
       <b>Views ${views}</b>
     </p>
     <p class="info-item">
       <b>Comments ${comments}</b>
     </p>
    <p class="info-item">
       <b>Downloads ${downloads}</b>
     </p>
     </div>
   </div>`;
      }
    )
    .join('');

  refs.divEl.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a');
}
