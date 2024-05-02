const redis = require('redis');
 
const client = redis.createClient({
    password: 'ON7qXefFOafgC1L1wEUko2nYdDGrQhjc',
    socket: {
        host: 'redis-14921.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14921
    }
});

(async () => {
    await client.connect();
})();
client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = client;