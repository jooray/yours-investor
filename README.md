# yours-investor

A content-voting bot doing "front-running" of good content on [yours.org](https://yours.org/) platform.

The code will go through the post of users listed in the configuration file and put a "vote" for new articles in a hope that the users contribute valuable posts and will make the investor money. On financial markets, this is commonly known as "front-running", because we are anticipating what other people will do and trying to run in the front to get a small benefit out of it.

I believe this project is ethical, because it also supports the authors by giving them a vote and helps them become featured higher on the front page of the platform.

I have written [an article about yours.org on my blog](https://juraj.bednar.io/en/blog-en/2019/02/13/paid-content-networks-how-to-get-rewarded-for-creating-content-a-case-study-of-yours-org-part-1/), check it out to understand how this works.

## Installation

You need working nodejs and npm for your platform and a working [puppeteer](https://github.com/GoogleChrome/puppeteer) installation (should be installed automatically). To install all the required nodejs packages, run

```bash
npm install
```

## Configuration

Copy config/example.json5 to config/yourusername.json5. Edit the file, you need to change the *login* and *password* - login is your e-mail address, not the yours username (that's how yours.org login works).

```json
{
  yoursInvestor: {
    login: "login@gmail.com",
    password: "password",
    articles_db_file: "articles.db",
    users: [ "jurajbednar", "paralelnapolis", "satoshidoodles", "ryanxcharles" ]
  }
}
```

In the *users* section, make a choice of good authors on yours.org (this time, these are usernames). You can put as many as you like. The script will go through them and vote for the most recent article if it has not been seen before.

Also, if you would like to have several users, you should change *articles_db_file* to be different among users, so different users would vote on the same article.

## Running

There is a script called *runit.sh* that periodically runs the investor for all the users. You only need to change

```bash
for l in example # list config files here
```

to something like

```bash
for l in user1 user2 user3
```

You need to have config/user1.json5, config/user2.json5 and config/user3.json5 configuration files in order to do this.

## Advanced configuration and use

You can also configure some advanced settings. If you would like to see what the script is doing, you can set *browser_is_headless* to false in your configuration file. This will show Chrome window and you could see how the process works, from login, to clicking on articles and voting.

There's also a *keypress_delay* option, which sets how fast the script will type into input boxes. I don't think it makes any difference right now, but in the future, typing speed might be used by the platform to detect bots. Although I think the platform should support and encourage bots, because they bring in liquidity and funds into the system.

You can also manually add an article to the database in order for the article to not get vote. It does not require config file, only name of database file and URL of the article. Example:

```bash
node add-article.js articles.db 'https://www.yours.org/content/freedom-flight-028177c3cc8c'
```

## Good to know

This script can make, but also lose you money. Depends on if you invest wisely. This is not a financial advice nor a magic money making bot.

If a user changes the title of the article, it might get another vote, because the URL of the article (that we use for identifying the article) changes.

I also [wrote a script to regularly withdraw BCH and consolidate outputs from yours](https://github.com/jooray/bch-yours-offload), but it works only for BCH, so before the BCH ABC / BCH SV fork. Feel free to update it to work with BSV, I currently do not withdraw BSV from yours.

## Support

If you liked this script, I would be glad if you supported my open-source work and writing. [More information about ways to support me are on my webpage](https://juraj.bednar.io/en/support-me/), but you can also send me Bitcoin at [3BaE3GkJ8Z1F4HR8H8ocRt6eK41diW4GWw](bitcoin:3BaE3GkJ8Z1F4HR8H8ocRt6eK41diW4GWw). [Other cryptocurrencies addresses are listed here](https://juraj.bednar.io/en/support-me/). You can also tip my [yours page](https://www.yours.org/@jurajbednar).
