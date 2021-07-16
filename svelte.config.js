import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

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
			resolve: {
				alias: {
					$components: path.resolve('src/components'),
					$icons: path.resolve('src/icons')
				}
			},
			server: {
				proxy: {
					'/file': {
						target: 'http://localhost:8091/file',
						rewrite: (path) => path.replace(/^\/file/, '')
					},
					'/auth': {
						target: 'http://localhost:3400'
					},
					'/api': {
						target: 'http://localhost:8091',
						rewrite: (path) => path.replace(/^\/api/, '')
					}
				}
			}
		}
	}
};

export default config;
