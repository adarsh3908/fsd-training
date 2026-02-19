const promise = require('promise');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost/testdb';

MongoClient.connect(url).then(function(client) {
  const db = client.db('testdb');
  db.collection('test').updateOne(
    { name: 'oldName' },
    { $set: { name: 'newName' } }
  );
  client.close();
}).catch(function(error) {
  alert(error.message);
});
