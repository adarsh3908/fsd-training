const fs = require('fs');

fs.readFile('filename', function(err, data) {
  if (err) console.error(err);
  else console.log(data.toString());
});

fs.readFile('filename', function(err, data) {
  if (err) console.error(err);
  else console.log(data.toString());
});
