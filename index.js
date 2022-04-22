const request = require('request-promise');
const cheerio = require('cheerio')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const getPerson = (nameOrEmail) => {
  return request({
    method: 'POST',
    url: 'https://find.pitt.edu/Search',
    form: {
      search: nameOrEmail,
      layout: 'list'
    }
  })
  .then((body) => {
    const $ = cheerio.load(body);
    return Promise.resolve({
      name: $('span.title').text(),
      email: $($($('span.row-label.section-group:contains("Email")')).siblings()[0]).text(),
      job: $($('div.more-info:contains("Employee Information")').children('span')[1]).text().trim()
    });
  });
};

const makePrompt = () => {
  readline.question(`Name/Email? `, (email) => {
    if (email == 'close') return readline.close();

    getPerson(email)
    .then(({ name, email, job }) => {
      console.log(`NAME: ${name}`);
      console.log(`EMAIL: ${email}`);
      console.log(`JOB: ${job}`);
      console.log('--');
      makePrompt();
    });
  });
};

makePrompt();
