import logging from 'logging';
import { getGlobalConfiguration } from './global-configuration';
import { configureNews } from './news';
import { configureTunables } from './tunables';

const globalConfiguration = getGlobalConfiguration();

if (globalConfiguration.news.enabled) {
  logging.info('');
  configureNews();
}

if (globalConfiguration.tunables.enabled) {
  logging.info('');
  configureTunables();
}
