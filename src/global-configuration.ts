import config from 'config';
import logging from 'logging';

type GlobalConfiguration = {
  news: {
    enabled: boolean;
  };
  tunables: {
    enabled: boolean;
  };
};

const GLOBAL_CONFIGURATION_NAME = 'settings';
const DEFAULT_GLOBAL_CONFIGURATION: GlobalConfiguration = {
  news: {
    enabled: false,
  },
  tunables: {
    enabled: false,
  },
};

function createDefaultGlobalConfiguration() {
  return config.createDefault(GLOBAL_CONFIGURATION_NAME, DEFAULT_GLOBAL_CONFIGURATION);
}

export function getGlobalConfiguration(): GlobalConfiguration {
  logging.info('Loading Global Settings...');
  const created = createDefaultGlobalConfiguration();
  if (created) {
    logging.info('Created default Settings');
  }
  const content = config.read(GLOBAL_CONFIGURATION_NAME) as Partial<GlobalConfiguration>;
  return {
    news: {
      ...DEFAULT_GLOBAL_CONFIGURATION.news,
      ...content.news,
    },
    tunables: {
      ...DEFAULT_GLOBAL_CONFIGURATION.tunables,
      ...content.tunables,
    },
  };
}
