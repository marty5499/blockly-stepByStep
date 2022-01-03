const fs = require('fs')

try {
  const data = fs.readFileSync('webduino.json', 'utf8')
  var json = JSON.parse(data);
  console.log(json.xml)
} catch (err) {
  console.error(err)
}
