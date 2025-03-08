import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://adept.magick.me';
const BUILD_DIR = '.svelte-kit/output/client';

// Add your routes here
const routes = [
    '/',
    '/enroll',
    '/preview',
    '/pricing',
];

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map(route => `
    <url>
        <loc>${SITE_URL}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>`).join('')}
</urlset>`;

    // Ensure the build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
        fs.mkdirSync(BUILD_DIR, { recursive: true });
    }

    // Write sitemap to the build directory
    fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
};

generateSitemap(); 