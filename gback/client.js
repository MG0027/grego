const { Redis } = require('ioredis');
const config = require('./config');

const client = new Redis({
  host: config.redisHost, 
  port: config.redisPort,        
  password: process.env.REDIS_PASSWORD || '', 
  db: process.env.REDIS_DB || 0               
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = client;