// Static HTML injected into index.html at build time (see vite.config.ts), so search engines
// and readers without JavaScript get the same explanations the 3D experience shows.
import { catalog } from './catalog.ts';
import { stages, turboNote } from './cycle.ts';
import { video } from './video.ts';

export const SITE_URL = 'https://victorsodre.github.io/motor-por-dentro/';
/** Publication data of the embedded Short (EP312), from the channel inventory. */
const videoFacts = {
  uploadDate: '2026-10-29T21:00:10Z',
  description: 'O gás de escape gira a turbina e, no mesmo eixo, o compressor espreme ar para dentro do motor. O ar comprimido fica mais denso e permite queimar mais combustível.',
};

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** "0:56" or "1:02:03" → ISO 8601 duration ("PT56S", "PT1H2M3S"). */
export function isoDuration(clock: string) {
  const [s = 0, m = 0, h = 0] = clock.split(':').map(Number).reverse();
  if (![s, m, h].every(Number.isFinite)) throw new Error(`Duração inválida: ${clock}`);
  return 'PT' + (h ? `${h}H` : '') + (m ? `${m}M` : '') + `${s}S`;
}

export function videoJsonLd() {
  const data = {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: video.title, description: videoFacts.description, uploadDate: videoFacts.uploadDate,
    duration: isoDuration(video.duration), thumbnailUrl: `${SITE_URL}video-thumbnail.jpg`,
    embedUrl: `https://www.youtube.com/embed/${video.id}`, url: `https://www.youtube.com/watch?v=${video.id}`,
    inLanguage: 'pt-BR', author: { '@type': 'Organization', name: 'ovictorlab', url: 'https://ovictorlab.com/' },
  };
  // "<" is escaped so no string can close the script element.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function staticContent() {
  const list = (items: readonly {label: string; detail: string}[], tag: 'ol' | 'ul') =>
    `<${tag}>${items.map(item => `<li><strong>${escape(item.label)}:</strong> ${escape(item.detail)}</li>`).join('')}</${tag}>`;
  return `<main class="static-content"><h1>Motor por dentro: como funciona o motor de quatro tempos</h1>`
    + `<p>Um cilindro em 3D mostra como o movimento dentro do motor chega ao eixo: quatro tempos em duas voltas do virabrequim, com uma queima a cada duas voltas.</p>`
    + `<h2>Os quatro tempos</h2>${list(stages, 'ol')}`
    + `<h2>As peças</h2>${list(catalog, 'ul')}`
    + `<h2>Com turbo</h2><p>${escape(turboNote)}</p>`
    + `<p>Vídeo relacionado do ovictorlab: <a href="https://www.youtube.com/watch?v=${video.id}">${escape(video.title)}</a></p></main>`;
}
