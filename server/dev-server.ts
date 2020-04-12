import http from 'http';
import fs from 'fs';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import webpackConfig from '../webpack.config';

const devServer = express();

const compiler = webpack(webpackConfig);

devServer.use(
  middleware(compiler, {
    publicPath: '',
  }),
);

devServer.use('/api', createProxyMiddleware({ target: `http://localhost:${process.env.API_PORT}` }));

devServer.listen(process.env.DEV_PORT, () => {

});

function clearModuleCache() {
  Object.keys(require.cache)
    .filter((id) => !id.includes('node_modules'))
    .forEach((id) => {
      delete require.cache[id];
    });
}

let server: http.Server | null = null;
async function restartApi() {
  if (server && server.listening) {
    process.stdout.write('Closing the server... ');
    await new Promise((resolve) => server.close(resolve));
    process.stdout.write('Done.\n');
  }

  process.stdout.write('Starting the server... ');
  server = require('./server').default;
  await new Promise((resolve) => server.listen({ port: process.env.API_PORT }, resolve));
  process.stdout.write('Done.\n');
}

restartApi();

let debounceTimeout: ReturnType<typeof setTimeout> = null;
fs.watch(__dirname, { recursive: true }, async () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    clearModuleCache();
    await restartApi();
  }, 200);
});
