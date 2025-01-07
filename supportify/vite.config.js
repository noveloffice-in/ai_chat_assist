import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';
import svgr from '@svgr/rollup'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svgr(), react()],
	server: {
		port: 8080,
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			src: path.resolve(__dirname, 'src'), // from config2
		}
	},
	esbuild: {
		loader: 'jsx',
		include: /src\/.*\.jsx?$/,
		exclude: [],
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				'.js': 'jsx',
			},
			plugins: [
				{
					name: 'load-js-files-as-jsx',
					setup(build) {
						build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
							loader: 'jsx',
							contents: await fs.readFile(args.path, 'utf8'),
						}));
					},
				},
			],
		},
	},
	build: {
		outDir: '../ai_chat_assist/public/supportify',
		emptyOutDir: true,
		target: 'es2015',
	},
});
