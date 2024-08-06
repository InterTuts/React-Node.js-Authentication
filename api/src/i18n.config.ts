// System Utils
import path from 'path';

// Installed Utils
import { I18n } from 'i18n';

// Configure I18n
const i18n = new I18n({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path.join('./src/', 'messages'),
  objectNotation: true
});

// Export I18n
export default i18n;