#!/usr/bin/env node
import http from 'node:http';
import packageJson from '../package.json';

const { version, name } = packageJson;
const options = {
  method: 'PUT',
  hostname: 'uipaas-node.alibaba-inc.com',
  path: '/staticAssets/cdn/packages',
  headers: {
    'Content-Type': 'application/json',
    Cookie: 'locale=en-us',
  },
  maxRedirects: 20,
};

const onResponse = function (res) {
  const chunks = [];
  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  res.on('end', () => {
    const body = Buffer.concat(chunks);
    console.table(JSON.stringify(JSON.parse(body.toString()), null, 2));
  });

  res.on('error', (error) => {
    console.error(error);
  });
};

const req = http.request(options, onResponse);

const postData = JSON.stringify({
  packages: [
    {
      packageName: name,
      version,
    },
  ],
  // 可以发布指定源的 npm 包，默认公网 npm
  useTnpm: true,
});

req.write(postData);

req.end();
