import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			imports: [{ vue: ['ref', 'onMounted', 'reactive'] }, { pinia: ['storeToRefs'] }],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@com': fileURLToPath(new URL('./src/components', import.meta.url)),
		},
	},
	server: {
		host: true,
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/assets/scss/var";`,
			},
		},
	},
});
