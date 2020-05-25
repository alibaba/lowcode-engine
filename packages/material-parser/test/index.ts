import parse from '../src';
import fs from 'fs';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const fusionComptPath = getFromFixtures('fusion-next-component');

async function generate() {
  const options: IMaterializeOptions = {
    entry: fusionComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);
  fs.writeFileSync('configure.json', JSON.stringify(actual, null, 2));
  console.log(actual);
}

generate();
