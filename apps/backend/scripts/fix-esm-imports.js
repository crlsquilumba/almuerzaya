import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fix ESM imports by adding .js extensions to relative imports
function fixEsmImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    const dirName = path.dirname(filePath);

    // First: Add .js extension to relative imports that don't have it and aren't directories
    content = content.replace(
      /from\s+['"](\.[^'"]+)['"];?/g,
      (match, importPath) => {
        // If already has .js or .json, don't modify
        if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
          return match;
        }

        // Check if this path looks like a directory (last segment has no dot)
        const lastSegment = importPath.split('/').pop() || '';
        const fullPath = path.resolve(dirName, importPath);

        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            // It's a directory, use /index.js
            return `from '${importPath}/index.js';`;
          } else {
            // It's a file, add .js
            return `from '${importPath}.js';`;
          }
        } catch {
          // File/dir doesn't exist, assume it's a directory if no extension
          if (!lastSegment.includes('.')) {
            return `from '${importPath}/index.js';`;
          }
          return `from '${importPath}.js';`;
        }
      }
    );

    // Same for import statements without from
    content = content.replace(
      /import\s+['"](\.[^'"]+)['"];?/g,
      (match, importPath) => {
        if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
          return match;
        }

        const lastSegment = importPath.split('/').pop() || '';
        const fullPath = path.resolve(dirName, importPath);

        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            return `import '${importPath}/index.js';`;
          } else {
            return `import '${importPath}.js';`;
          }
        } catch {
          if (!lastSegment.includes('.')) {
            return `import '${importPath}/index.js';`;
          }
          return `import '${importPath}.js';`;
        }
      }
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all .js files in dist directory
function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (file.endsWith('.js')) {
        fixEsmImports(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
}

const distDir = path.join(__dirname, '..', 'dist');
console.log('Fixing ESM imports in dist directory...');
processDirectory(distDir);
console.log('✓ ESM import fixes completed');
