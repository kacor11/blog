const redis = require('redis');
const client = redis.createClient({ port: 6379, host: '127.0.0.1' })
client.on("error", function(error) {
  console.error(error);
});

exports.isCached = function(req, res, next) {
  client.get(req.path, (err, result) => {
  if(result) {
    return res.json(JSON.parse(result))
  }
  next();
})

}

