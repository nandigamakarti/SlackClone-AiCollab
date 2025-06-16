import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import svg2png from 'svg2png';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function convertSvgToPng() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(join(__dirname, 'public/favicon.svg'));
    
    // Convert SVG to PNG
    const pngBuffer = await svg2png(svgBuffer, { width: 256, height: 256 });
    
    // Save the PNG
    fs.writeFileSync(join(__dirname, 'public/favicon.png'), pngBuffer);
    
    // Create different sizes
    await sharp(join(__dirname, 'public/favicon.png'))
      .resize(16, 16)
      .toFile(join(__dirname, 'public/favicon-16.png'));
      
    await sharp(join(__dirname, 'public/favicon.png'))
      .resize(32, 32)
      .toFile(join(__dirname, 'public/favicon-32.png'));
      
    await sharp(join(__dirname, 'public/favicon.png'))
      .resize(48, 48)
      .toFile(join(__dirname, 'public/favicon-48.png'));
      
    await sharp(join(__dirname, 'public/favicon.png'))
      .resize(64, 64)
      .toFile(join(__dirname, 'public/favicon-64.png'));
    
    console.log('PNG files created successfully!');
    console.log('You can use these PNG files as favicons in your application.');
    
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

convertSvgToPng(); 