const datastore = require('nedb-promise')
if (process.argv.length != 4) {
  console.log("Usage: node add-article.js DBFILE ARTICLE_URL")
  process.exit(1)
} else {
  let db = new datastore({ filename: process.argv[2], autoload: true });
  var article_url = process.argv[3]
  db.insert({url: article_url}).then( () => {
    console.log("Inserted article " + article_url)
  })
}
