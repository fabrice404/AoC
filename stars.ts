import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';

dotenv.config();

const URL = 'https://adventofcode.com/events';

interface Event {
  year: number;
  stars: number;
}

const main = async () => {
  const response = await axios.get(
    URL,
    {
      headers: {
        Cookie: `session=${process.env.SESSION_TOKEN}`,
      },
    },
  );
  const body = response.data;

  const events: Event[] = [];
  const $ = cheerio.load(body);
  $('.eventlist-event').each((i, elem) => {
    events.push({
      year: parseInt($(elem).find('a').text().substring(1, 5), 10),
      stars: parseInt($(elem).find('.star-count').text().replace('*', ''), 10) || 0,
    });
  });

  const readme = readFileSync('README.md', 'utf8');

  const top = readme.split('<!-- auto-generated -->')[0].trim();
  const bottom = readme.split('<!-- /auto-generated -->')[1].trim();

  const table: string = events
    .map((e) => {
      const stars = Array(e.stars + 1).fill('⭐️');
      stars[Math.floor(stars.length / 2)] = '<br/>';
      return `| [${e.year}](./${e.year}) | ${e.stars} | ${stars.join('')} |`;
    })
    .join('\n');

  writeFileSync('README.md', `${top}\n<!-- auto-generated -->\n| Year | Stars | |\n| --- | --- | --- |\n${table}\n<!-- /auto-generated -->\n${bottom}`);
};

main();
