import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    
  }
});

const PUBLIC_ENDPOINTS = [
    '/getLocalisationsWithSousLocalisation',
    '/GetAllRegroupement',
    '/GetAllCategorie',
    '/GetAllClub',
    '/getPeriodes',
    '/gettypeactivite',
    '/gettrancheage',
    '/pays'
];

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const url = error.config?.url || '';
            const isPublic = PUBLIC_ENDPOINTS.some(ep => url.includes(ep));
            if (!isPublic) {
                localStorage.removeItem('logged_in');
                localStorage.removeItem('user_infos');
                if (!window.location.pathname.includes('/connexion')) {
                    window.location.href = '/connexion';
                }
            }
        }
        return Promise.reject(error);
    }
);
export default api;