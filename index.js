const datastore = require('nedb-promise')
const puppeteer = require('puppeteer');
const shuffle = require('shuffle-array')
const debug = require('debug')('yours-investor')
const config = require('config').get('yoursInvestor')

// CONFIG

let login = config.get('login')
let password = config.get('password')
let articles_db_file = config.get('articles_db_file')

var user_urls = shuffle(config.get('users'), { 'copy': true })

var browser_is_headless = true
if (config.has('browser_is_headless')) browser_is_headless = config.get('browser_is_headless')
var keypress_delay = 8
if (config.has('keypress_delay')) keypress_delay = config.get('keypress_delay')

// END OF CONFIG

let db = new datastore({ filename: articles_db_file, autoload: true });

async function check_url(browser, user_url) {
  console.log("Checking " + user_url)
  try {
    const page = await browser.newPage();
    await page.goto(user_url);
    await page.waitFor('#content > div:nth-child(3) > div > div.content-preview > div > div.post-link > h3 > a')
    const article_url = await page.$eval('#content > div:nth-child(3) > div > div.content-preview > div > div.post-link > h3 > a', el => el.href)

    await db.count({ url: article_url }).then( async (count) => {
      if (count > 0) {
        debug('Article already seen, skipping: ' + article_url + ' for ' + user_url)
        await page.close()
      } else {
        console.log('New article ' + article_url + ' for ' + user_url)
        await db.insert({url: article_url})
        await page.waitFor('#content > div:nth-child(3) > div > div.content-preview > div > div.content-underline > div > div > button')
        await page.click('#content > div:nth-child(3) > div > div.content-preview > div > div.content-underline > div > div > button')
        await page.waitFor(15000)
        await page.close()
      }
    })

  } catch(error) {
    console.error('Error in catch block for '+user_url)
    console.error(error)
  }
}

puppeteer.launch({headless: browser_is_headless, args: ['--no-sandbox'], timeout: 90000}).then(async browser => {

  try {
  const page = await browser.newPage()
  debug("Going to yours.org")
  await page.goto('https://yours.org/')
  debug("Loaded, waiting for selector")

  await page.waitFor('#page > header > nav > ul.section.section-actions > li:nth-child(3) > a:nth-child(1)')
  debug("Clicking")
  await page.click('#page > header > nav > ul.section.section-actions > li:nth-child(3) > a:nth-child(1)')
  debug("Typing")
  await page.type('#loginInputEmail', login, {delay: keypress_delay})
  await page.type('#loginInputPassword', password, {delay: keypress_delay})
  debug("Login button")
  await page.click('#page > header > div > div.modal > div:nth-child(2) > form > button')
  await page.waitFor('#page > header > div > div > div.sm-buttons > div:nth-child(2) > a')
  debug("Let's check pages")

  /* commented out - due to the way the payments are processed on yours.org,
  ** there is a race condition in sending multiple payments at the same time.*/

  /*
  var promises = []
  for (user_url of user_urls) {
    promises.push(check_url(browser, user_url).catch(e => {
        console.error("Error in subpage, checking " + user_url)
        console.error(e)
    }))
  }
  await Promise.all(promises)
  */

 // so serialized version instead
 for (user_url of user_urls) {
  await check_url(browser, 'https://www.yours.org/@' + user_url).catch(e => {
      console.error("Error in subpage, checking " + user_url)
      console.error(e)
  })
}

  debug("Done, ending yours investor")

  await page.close()
  await browser.close()
  process.exit(0)

  } catch(error) {
      console.error('Master FAIL!', error)
      process.exit(1)
  }
})
