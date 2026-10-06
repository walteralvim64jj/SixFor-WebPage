const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const categories = [
  {
    id: 'hero',
    title: 'Capa da página inicial',
    folder: 'images/hero',
    usage: 'A primeira foto em ordem alfabética é o fundo do hero da página inicial.',
    required: false
  },
  {
    id: 'manoel-honorio',
    title: 'Unidade Manoel Honório',
    folder: 'images/unidades/manoel-honorio',
    usage: 'Todas as fotos passam pelo cartão da unidade; use as setas para navegar.',
    required: false
  },
  {
    id: 'sao-mateus',
    title: 'Unidade São Mateus',
    folder: 'images/unidades/sao-mateus',
    usage: 'Todas as fotos passam pelo cartão da unidade; use as setas para navegar.',
    required: false
  },
  {
    id: 'equipe',
    title: 'Equipe',
    folder: 'images/equipe',
    usage: 'Galeria ao lado da lista dos seis integrantes; as fotos não são associadas a nomes.',
    required: false
  },
  {
    id: 'treinos',
    title: 'Treinos',
    folder: 'images/treinos',
    usage: 'A primeira foto em ordem alfabética ilustra a aula experimental; todas aparecem na galeria de treinos.',
    required: false
  },
  {
    id: 'eventos',
    title: 'Eventos e competições',
    folder: 'images/eventos',
    usage: 'Galeria de eventos e competições na página inicial.',
    required: false
  },
  {
    id: 'kids',
    title: 'Kids',
    folder: 'images/kids',
    usage: 'Galeria Kids na página inicial.',
    required: false
  }
];

function listImages(relativeFolder) {
  const absoluteFolder = path.join(root, relativeFolder);
  if (!fs.existsSync(absoluteFolder)) return [];

  return fs.readdirSync(absoluteFolder, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = path.join(absoluteFolder, entry.name);
      if (entry.isDirectory()) {
        return listImages(path.posix.join(relativeFolder, entry.name));
      }
      if (!entry.isFile() || !imageExtensions.has(path.extname(entry.name).toLowerCase())) return [];

      return [{
        name: entry.name,
        src: path.relative(root, absolutePath).split(path.sep).join('/')
      }];
    })
    .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' }));
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

const manifest = {
  generatedAt: new Date().toISOString(),
  categories: categories.map((category) => ({
    ...category,
    images: listImages(category.folder)
  }))
};
const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
const sourceManifestPath = path.join(root, 'images', 'image-manifest.json');
fs.mkdirSync(path.dirname(sourceManifestPath), { recursive: true });
fs.writeFileSync(sourceManifestPath, manifestContent, 'utf8');

for (const entry of ['index.html', 'imagens.html', 'css', 'js', 'config', 'images', '_headers']) {
  const source = path.join(root, entry);
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(output, entry), { recursive: true });
  }
}

for (const asset of ['assets/favicon/favicon.jpeg', 'assets/images/logo/logo.svg']) {
  const source = path.join(root, asset);
  if (fs.existsSync(source)) {
    const destination = path.join(output, asset);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

const manifestPath = path.join(output, 'images', 'image-manifest.json');
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, manifestContent, 'utf8');

console.log(`Site preparado em dist/ (${manifest.categories.reduce((sum, item) => sum + item.images.length, 0)} imagens encontradas).`);
