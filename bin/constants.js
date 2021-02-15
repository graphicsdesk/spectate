const path = require('path');
const templates = ["default", "series"];
const organizations = ["graphicsdesk", "NewsroomDevelopment"]

module.exports = {
  S3_WEBSITE_BASE: 'https://spectator-static-assets.s3.amazonaws.com',
  DIST_DIR: path.join(process.cwd(), 'dist'),
  TEMPLATES: templates,
  ORGANIZATIONS: organizations,
};

