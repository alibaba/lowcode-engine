import React from 'react';
import { Meta, Title, Links, Main, Scripts } from 'ice';

export default function Document() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="ice.js 3 lite scaffold" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="//alifd.alicdn.com/npm/@alifd/next/1.21.16/next.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <Meta />
        <Title />
        <Links />
      </head>
      <body>
        <Main />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/react/18.2.0/umd/react.development.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/react-dom/18.2.0/umd/react-dom.development.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/??react-router/6.9.0/react-router.production.min.js,react-router-dom/6.9.0/react-router-dom.production.min.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/alifd__next/1.26.22/next.min.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js" />
        <script crossOrigin="anonymous" src="//g.alicdn.com/platform/c/??lodash/4.6.1/lodash.min.js,immutable/3.7.6/dist/immutable.min.js" />
        <Scripts />
      </body>
    </html>
  );
}