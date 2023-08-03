import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

import { fetchBreeds, fetchCatByBreed } from './cat-api';

const breedSelectEl = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');

//  генеруємо html розмітку  для породи кота
function optionValue(data) {
  return data
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join('');
}

//  робило запит на сервер щоб отримати список  порід котів та
// заповнюємо елемент вибору породи (breedSelectEl) зі спрощеними значеннями за допомогою
// optionValue
fetchBreeds()
  .then(response => {
    const breeds = response.data;
    breedSelectEl.innerHTML = optionValue(breeds);

    new SlimSelect({
      select: '.breed-select',
    });
  })
  .catch(error => {
    console.error(error);
    Notiflix.Report.warning('Error', 'Oops! Something went wrong!');
    breedSelectEl.style.display = 'none';
    errorEl.classList.add('active');
    loaderEl.style.display = 'none';
  });



// асинхр.функ.loadCatInfo, яка отримує інформацію про кота
// на основі обраної породи і відображає її у відповідному розділі (catInfoDiv):

async function loadCatInfo(breedId) {
  loaderEl.style.display = 'block';
  

  try {
    catInfoDiv.innerHTML = '';

    const response = await fetchCatByBreed(breedId);
    const catData = response.data[0];

    const markup = `
        <img src="${catData.url}" alt="cat"  width="300" height="300">
        <div class="text-info">
        <p class="name">${catData.breeds[0].name}</p>
        <p class="description">${catData.breeds[0].description}</p>
        <p class="temperament">${catData.breeds[0].temperament}</p>
        </div>
      `;

    catInfoDiv.innerHTML = markup;
    loaderEl.style.display = 'none';

  } catch (error) {
    console.error('Error:', error);
    Notiflix.Report.warning('Error', 'Oops! Something went wrong!');

    breedSelectEl.style.display = 'none';
    errorEl.classList.add('active');
    catInfoDiv.innerHTML = '';
    loaderEl.style.display = 'none';
  }
}
// для елементу вибору породи, яка викликає функцію loadCatInfo,передаючи обране значення
breedSelectEl.addEventListener('change', informationAboutCat);
function informationAboutCat(event) {
  const selectedBreedId = event.target.value;
  errorEl.classList.remove('active');
  loadCatInfo(selectedBreedId);
}