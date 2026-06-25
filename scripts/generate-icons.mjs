import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../mobile/assets/icon-source.png');
const out = path.resolve(__dirname, '../mobile/assets');

const icon512 = await sharp(src).resize(512, 512).png().toBuffer();

await sharp(src).resize(1024, 1024).png().toFile(path.join(out, 'icon.png'));
await sharp(src).resize(1024, 1024).png().toFile(path.join(out, 'adaptive-icon.png'));
await sharp({
  create: { width: 1284, height: 2778, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } },
})
  .composite([{ input: icon512, gravity: 'center' }])
  .png()
  .toFile(path.join(out, 'splash.png'));

console.log('Icons created in', out);
