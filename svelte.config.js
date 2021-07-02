import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config = {
	preprocess: preprocess({
		postcss: {
			plugins: [tailwind, autoprefixer]
		}
	}),

	kit: {
		adapter: adapter(),
		target: '#svelte',
		vite: {
			server: {
				proxy: {
					'/file': {
						target: 'http://localhost:8091/file',
						rewrite: (path) => path.replace(/^\/file/, '')
					}
				}
			}
		}
	}
};

export default config;
