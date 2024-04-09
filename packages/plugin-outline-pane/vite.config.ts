import { defineConfig } from 'vite';
import baseConfigFn from '../../vite.base.config'

export default defineConfig(async () => {
  return baseConfigFn({
    name: 'LowCodePluginOutlinePane',
    defaultFormats: ['es', 'cjs'],
    entry: 'src/index.tsx'
  })
});
