const fs = require('fs');
const svg2png = require('svg2png');
const sharp = require('sharp');
const path = require('path');

async function convertSvgToIco() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(path.join(__dirname, 'public/favicon.svg'));
    
    // Convert SVG to PNG
    const pngBuffer = await svg2png(svgBuffer, { width: 256, height: 256 });
    
    // Save the PNG temporarily
    const tempPngPath = path.join(__dirname, 'public/temp-favicon.png');
    fs.writeFileSync(tempPngPath, pngBuffer);
    
    // Convert PNG to ICO with multiple sizes
    await sharp(tempPngPath)
      .resize(16, 16)
      .toFile(path.join(__dirname, 'public/favicon-16.png'));
      
    await sharp(tempPngPath)
      .resize(32, 32)
      .toFile(path.join(__dirname, 'public/favicon-32.png'));
      
    await sharp(tempPngPath)
      .resize(48, 48)
      .toFile(path.join(__dirname, 'public/favicon-48.png'));
      
    await sharp(tempPngPath)
      .resize(64, 64)
      .toFile(path.join(__dirname, 'public/favicon-64.png'));
      
    console.log('PNG files created successfully!');
    console.log('Please use an online converter like https://www.icoconverter.com/ to combine these into an ICO file');
    
    // Remove temp file
    fs.unlinkSync(tempPngPath);
    
  } catch (error) {
    console.error('Error converting SVG to ICO:', error);
  }
}

convertSvgToIco(); 