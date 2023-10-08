/// <reference path="../node_modules/knockoutcity-mod-loader/types/sandbox-api.d.ts" />

import { getGlobalConfiguration } from './global-configuration';
import { configureNews } from './news';
import { configureTunables } from './tunables';

const globalConfiguration = getGlobalConfiguration();

if (globalConfiguration.news.enabled) {
  configureNews();
}

configureTunables();
