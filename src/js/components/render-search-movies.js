// Рендеринг кинофильма по ключевому слову на главное странице
import { Notify, Loading } from 'notiflix';
import { searchApiService } from '../api/apiServicePlugin';
import imageCardTpl from '../../templates/card-markup.hbs';
import dataStorage from './data-storage';
import refs from './refs';
import { resetPaginationPage, setTotalItems } from './pagination.js';

refs.sectionHome.addEventListener('submit', onSearch);

export function onSearch(e) {
  e.preventDefault();

  refs.pagination.dataset.pagin = 'input';
  resetPaginationPage();
  searchApiService.resetPage();
  searchApiService.searchQuery = e.currentTarget.firstElementChild.value.trim();

  if (!searchApiService.searchQuery.length) {
    refs.galleryContainer.innerHTML = '';
    e.target.value = '';
    onFetchError();
    return;
  }

  loadSearchedMovies();
}

export default function loadSearchedMovies() {
  refs.galleryContainer.innerHTML = '';
  Loading.circle('Loading...');

  searchApiService
    .fetchArticles()
    .then(({ results, total_results }) => {
      setTotalItems(total_results);
      const currentPageMovies = dataStorage.getFilmData(results);
      dataStorage.saveCurrentMovies(currentPageMovies);
      createGallery(currentPageMovies);
    })
    .catch(onFetchError)
    .finally(Loading.remove(200));
}

function createGallery(data) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imageCardTpl(data));
}

function onFetchError() {
  Notify.failure('Search result not successful. Enter the correct movie name');
}