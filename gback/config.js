module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/grego',
  redisHost: process.env.REDIS_HOST || 'redis',
  redisPort: process.env.REDIS_PORT || 6379,
  frontendUrl: process.env.RENDER_EXTERNAL_URL || 'http://localhost:5173',
  port: process.env.PORT || 2000
};