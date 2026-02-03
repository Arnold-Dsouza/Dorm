const fs = require('fs');
const path = require('path');

// This script generates PWA icons from dorm.png
// Install sharp first: npm install --save-dev sharp

async function generateIcons() {
  try {
    const sharp = require('sharp');
    
    const sizes = [48, 72, 96, 128, 192, 256, 512];
    const inputFile = path.join(__dirname, 'public', 'dorm.png');
    const outputDir = path.join(__dirname, 'public', 'icons');

    console.log('Generating PWA icons from dorm.png...');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}.webp`);
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({ quality: 90 })
        .toFile(outputFile);
      console.log(`✓ Created icon-${size}.webp`);
    }

    // Generate apple-touch-icon.png (192x192)
    const appleTouchIcon = path.join(__dirname, 'public', 'apple-touch-icon.png');
    await sharp(inputFile)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(appleTouchIcon);
    console.log('✓ Created apple-touch-icon.png');

    // Generate favicon.ico (32x32)
    const faviconPng = path.join(__dirname, 'public', 'favicon.png');
    await sharp(inputFile)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPng);
    console.log('✓ Created favicon.png');

    console.log('\n✅ All icons generated successfully!');
    console.log('Note: For .ico format, use an online converter or install ico-endec package');

  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ Sharp package not found. Install it with:');
      console.error('   npm install --save-dev sharp');
    } else {
      console.error('❌ Error generating icons:', error.message);
    }
  }
}

generateIcons();
