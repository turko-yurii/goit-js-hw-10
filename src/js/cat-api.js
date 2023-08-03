import axios from 'axios';

axios.defaults.headers.common['x-api-key'] = 'live_ooSdjpEW4Vnr5Tf3sYufSQpfYA5LSk3n6H19b45MBaCFPaTiSfB3BX3FkDNqH2zu';

export const BASE_URL = 'https://api.thecatapi.com/v1';

export function fetchBreeds() {
  return axios.get(`${BASE_URL}/breeds`);
}

export function fetchCatByBreed(breedId) {
  return axios.get(`${BASE_URL}/images/search?breed_ids=${breedId}`);
}