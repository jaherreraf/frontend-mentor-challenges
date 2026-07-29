import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src/content/projects');
const PUBLIC_DIR = path.join(ROOT, 'public/projects');
const PROJECTS_PARENT = path.resolve(ROOT, '..');
const BACKUP_DIR = path.join(ROOT, '_originals_backup');

const RESIZE_WIDTH = 600;
const WEBP_QUALITY = 80;

// Mapeo manual: slug → nombre del archivo fuente (para proyectos sin carpeta local)
const REMOTE_IMAGE_MAP = {
  // Con imagen ya procesada
  'advice-generator':               'Advice-generator-app.jpg',
  'pricing-component':              'Pricing-component-with-toggle.jpg',
  'time-tracking-dashboard':        'time-tracking-dashboard-main.jpg',
  'url-shortening-api':             'url-shortening-api-master.jpg',
  'countdown-timer':                'LaunchCountdownTimer.jpg',
  'conference-ticket-generator':    'conference-ticket-generator.jpg',
  'ecommerce-product-page':         'ecommerce-product-page-main.jpg',
  'calculadora-de-propinas':        'trlanding-page-design.jpg',
  // Nuevas imágenes agregadas por el usuario
  'chat-app-css-illustration':             'chat-app-css-illustration-master.webp',
  'faq-accordion':                          'faq-accordion-main.webp',
  'intro-section-with-dropdown-navigation-main':  'intro-section-with-dropdown-navigation-main.jpg',
  'age-calculator-app-main':                       'age-calculator-app-main.jpg',
  'blog-preview-card':                             'blog-preview-card.jpg',
  'interactive-card-details-form-main':            'Interactive-Card-Details-Form.jpg',
  'space-tourism-website-main':                    'space-tourism-website.jpg',
  'results-summary':                               'results-summary.jpg',
  'news-homepage-main':                            'news-homepage-main.jpg',
  'nft-preview-card-component-main':               'nft-preview-card-component-main.jpg',
  'social-links-profile-main':                     'social-links-profile-main.jpg',
};

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const raw = m[1];
  const getField = (key) => {
    const r = raw.match(new RegExp(`^${key}:\\s*"(.*?)"`, 'm'));
    return r ? r[1] : null;
  };
  return { raw, getField };
}

function extractFolderName(githubUrl) {
  if (!githubUrl) return null;
  const tree = githubUrl.match(/\/tree\/main\/(.+)$/);
  if (tree) return tree[1];
  const repo = githubUrl.match(/(?:github\.com|gitlab\.com)\/[^/]+\/([^/]+?)(?:\/|$|\.git)/);
  if (repo) return repo[1];
  return null;
}

async function findSourceImage(projectDir) {
  const candidates = [
    'preview.webp', 'preview.jpg',
    'public/preview.jpg', 'public/preview.webp',
    'design/desktop-design.jpg', 'design/mobile-design.jpg',
  ];
  for (const c of candidates) {
    const full = path.join(projectDir, c);
    try { await fs.access(full); return full; } catch {}
  }
  return null;
}

async function findScatteredImage(filename) {
  for (const loc of [ROOT, PUBLIC_DIR]) {
    const full = path.join(loc, filename);
    try { await fs.access(full); return full; } catch {}
  }
  return null;
}

async function updateImageField(filePath, content, newImagePath) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return content;
  const oldLine = m[1].match(/^image:\s*"(.*?)"$/m);
  if (!oldLine) return content;
  const oldValue = oldLine[1];
  if (oldValue === newImagePath) return content;
  const newFrontmatter = m[1].replace(/^(image:\s*)"(.*?)"$/m, `$1"${newImagePath}"`);
  const newContent = content.replace(m[1], newFrontmatter);
  await fs.writeFile(filePath, newContent, 'utf-8');
  console.log(`  📝 image actualizado: ${oldValue} → ${newImagePath}`);
  return newContent;
}

async function optimizeImage(sourcePath, outputPath, slug) {
  let metadata;
  try {
    metadata = await sharp(sourcePath).metadata();
  } catch {
    const relativeSource = path.relative(ROOT, sourcePath);
    console.log(`⚠️  ${slug}: ${relativeSource} no es una imagen válida (se ignora)`);
    return null;
  }
  const srcWidth = metadata.width || RESIZE_WIDTH;
  const targetWidth = Math.min(srcWidth, RESIZE_WIDTH);

  await sharp(sourcePath)
    .resize(targetWidth)
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const stats = await fs.stat(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`✅ ${slug}: ${path.relative(ROOT, sourcePath)} (${srcWidth}px → ${targetWidth}px, ${sizeKB}KB)`);

  return { srcWidth, targetWidth, sizeKB };
}

async function moveToBackup(sourcePath) {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const dest = path.join(BACKUP_DIR, path.basename(sourcePath));
  await fs.rename(sourcePath, dest);
  console.log(`  🗑️  original → _originals_backup/`);
}

// ─── Duplicados conocidos en la raíz del Hub para limpiar ──────────
const ROOT_DUPLICATES = ['multi-step-form-main.webp'];

// ─── Archivos sobrantes en public/projects/ que deben limpiarse ──
const PUBLIC_LEFTOVERS = [
  'chat-app-css-illustration.jpg',
  'faq-accordion-main.webp',
  'CLAUDE.md',
];

async function main() {
  console.log('\n🚀 Optimizando imágenes de proyectos...\n');

  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const files = await fs.readdir(CONTENT_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  let localProcessed = 0;
  let remoteProcessed = 0;
  let withoutImage = [];

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, '');
    const filePath = path.join(CONTENT_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');

    const fm = parseFrontmatter(content);
    if (!fm) {
      console.log(`⚠️  ${slug}: frontmatter no encontrado`);
      continue;
    }

    const githubUrl = fm.getField('githubUrl');
    const folderName = extractFolderName(githubUrl);

    let sourcePath = null;

    // ─── Prioridad 1: carpeta local ───────────────────────────
    if (folderName) {
      const projectDir = path.join(PROJECTS_PARENT, folderName);
      try {
        await fs.access(projectDir);
        sourcePath = await findSourceImage(projectDir);
        if (sourcePath) {
          const outputPath = path.join(PUBLIC_DIR, `${slug}.webp`);
          const result = await optimizeImage(sourcePath, outputPath, slug);
          if (!result) { withoutImage.push(slug); continue; }
          await updateImageField(filePath, content, `/projects/${slug}.webp`);
          localProcessed++;
          continue;
        }
        console.log(`⚠️  ${slug}: carpeta local "${folderName}" sin preview`);
        withoutImage.push(slug);
        continue;
      } catch {}
    }

    // ─── Prioridad 2: mapeo remoto ─────────────────────────────
    const remoteFilename = REMOTE_IMAGE_MAP[slug];
    if (remoteFilename) {
      sourcePath = await findScatteredImage(remoteFilename);
      if (sourcePath) {
        const outputPath = path.join(PUBLIC_DIR, `${slug}.webp`);
        const result = await optimizeImage(sourcePath, outputPath, slug);
        if (!result) { await moveToBackup(sourcePath); withoutImage.push(slug); continue; }
        await updateImageField(filePath, content, `/projects/${slug}.webp`);
        await moveToBackup(sourcePath);
        remoteProcessed++;
        continue;
      }
    }

    // ─── Prioridad 3: ya existe el .webp en public/projects/ ──
    const existingOutput = path.join(PUBLIC_DIR, `${slug}.webp`);
    try {
      await fs.access(existingOutput);
      const stats = await fs.stat(existingOutput);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`✅ ${slug}: ya existe (${sizeKB}KB)`);
      await updateImageField(filePath, content, `/projects/${slug}.webp`);
      remoteProcessed++;
      continue;
    } catch {}

    // ─── Sin imagen ────────────────────────────────────────────
    withoutImage.push(slug);
  }

  // ─── Limpiar duplicados en la raíz ───────────────────────────
  for (const dup of ROOT_DUPLICATES) {
    const full = path.join(ROOT, dup);
    try { await fs.access(full); await moveToBackup(full); } catch {}
  }

  // ─── Limpiar sobrantes en public/projects/ ───────────────────
  for (const leftover of PUBLIC_LEFTOVERS) {
    const full = path.join(PUBLIC_DIR, leftover);
    try { await fs.access(full); await moveToBackup(full); } catch {}
  }

  // ─── Verificar si quedó el `trlanding-page-design.jpg` en PUBLIC_DIR ──
  const leftoverTr = path.join(PUBLIC_DIR, 'trlanding-page-design.jpg');
  try { await fs.access(leftoverTr); await moveToBackup(leftoverTr); } catch {}

  // ─── Resumen ─────────────────────────────────────────────────
  const total = localProcessed + remoteProcessed;
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Procesadas: ${total} (${localProcessed} local, ${remoteProcessed} remota)`);
  if (withoutImage.length > 0) {
    console.log(`   ❌ Sin imagen disponible: ${withoutImage.length}`);
    console.log(`\n⚠️  Proyectos que aún necesitan imagen:`);
    for (const s of withoutImage) {
      console.log(`   • ${s}`);
    }
  }
  console.log();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
