import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				cerulean: {
					DEFAULT: '#00A3DC',
					600: '#0077A3',
					700: '#005B7D',
				},
				corsair: {
					DEFAULT: '#175A73',
					600: '#0D3B4D',
				},
				kohl: '#070402',
				flannel: {
					DEFAULT: '#B8BAC7',
					600: '#8A8C99',
				},
				ivory: '#FFFFF0',
			},
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
				sourceSans: ['Source Sans Pro', 'sans-serif'],
			},
			fontSize: {
				h1: ['36px', { lineHeight: '1.2', fontWeight: '800' }],
				h2: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
				h3: ['24px', { lineHeight: '1.2', fontWeight: '700' }],
				h4: ['20px', { lineHeight: '1.2', fontWeight: '700' }],
				p: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				cap: ['16px', { lineHeight: '1.5', fontWeight: '300' }],
			},
		},
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} satisfies Config;
