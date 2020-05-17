const open = require('open');

module.exports = function () {
  const {
    spectate: { DOC_URL },
  } = require(process.cwd() + '/package.json');
  if (DOC_URL) {
    open(DOC_URL);
  }
}
