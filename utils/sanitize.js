import { JSDOM } from 'jsdom';
import createDomPurify from 'dompurify';

const { window } = new JSDOM(''); // erstellt leeres, virtuelles Browser Fenser mit leeren HTML-Dokument
const purify = createDomPurify(window); // uebergibt window an dompurify, welches normalerweise ein wondow aus dem Browser braucht

export default function sanitizeHTML(dirty) {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'img',
      'b',
      'i',
      'em',
      'strong',
      'u',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'br',
    ],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^https?:\/\//i, // <--- nur http/https erlaubt
  });
}
