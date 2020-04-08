import { init } from "./vision";
import editor from './editor';

init();

load();

async function load() {
  const assets = await editor.utils.get('./assets.json');
  editor.set('assets', assets);
  editor.emit('assets.loaded', assets);

  const schema = await editor.utils.get('./schema.json');
  editor.set('schema', schema);
  editor.emit('schema.loaded', schema);
}
