const { name, version } = require('../package.json');
const { NODE_ENV } = require('./config/environment');
const logger = require('./components/logger');
const userRoute = require('./api/user');

module.exports = (app) => {
  app.get('/health', (req, res) => {
    return res.json({ name, version });
  });

  app.use('/api/user', userRoute);

  app.use((e, req, res, next) => {
    logger.error(e);
    return (res.status(e.statusCode || e.code || 500)
      .json({
        message: e.message,
        stack: NODE_ENV === 'development' ? e.stack : {},
      }));
  });
};
