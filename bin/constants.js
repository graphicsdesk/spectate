const path = require('path');


module.exports = {
  S3_WEBSITE_BASE: 'https://spectator-static-assets.s3.amazonaws.com',
  DIST_DIR: path.join(process.cwd(), 'dist'),
  TEMPLATES: ["default", "series"],
  ORGANIZATIONS: ["graphicsdesk", "NewsroomDevelopment"],
};

