const path = require('path');


module.exports = {
  S3_WEBSITE_BASE: 'https://spectator-static-assets.s3.amazonaws.com',
  DIST_DIR: path.join(process.cwd(), 'dist'),
  TEMPLATES: ["default", "series", "embed", "photo-essay"],
  // Paths in templates/default that the embed template also uses
  EMBED_SHARED_FILES: [
    '.gitignore',
    'README.md',
    'ai/ai2html-config.json',
    'patches/parcel-bundler+1.12.3.patch',
    'src/scripts/ai2html-resizer.js',
    'src/styles.css',
    'src/styles/news-ellipsis.css',
  ],
  ORGANIZATIONS: ["graphicsdesk", "NewsroomDevelopment"],
};

