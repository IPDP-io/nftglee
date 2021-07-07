import wretch from 'wretch';
export const api = wretch().url('/api');
export const auth = wretch().url('/auth');
