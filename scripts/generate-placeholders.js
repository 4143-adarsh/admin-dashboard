const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const services = [
  'software-dev',
  'web-dev',
  'mobile-dev',
  'cloud-devops',
  'ai-automation',
  'it-consulting'
];

const colors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6'  // teal-500
];

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'services');

// Create directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

services.forEach((service, index) => {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = colors[index % colors.length];
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const serviceName = service.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  ctx.fillText(serviceName, width / 2, height / 2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(imagesDir, `${service}.jpg`), buffer);
});

console.log(`Generated ${services.length} placeholder images in ${imagesDir}`);
