import logging from 'logging';
import config from 'config';
import database from 'database';

type NewsConfiguration = {
  news: News[];
};

type Slot = 1 | 2 | 3;

type Language =
  | 'en'
  | 'tag'
  | 'fr'
  | 'it'
  | 'de'
  | 'es'
  | 'ja'
  | 'nl'
  | 'ko'
  | 'zh-cn'
  | 'zh-tw'
  | 'pt'
  | 'pl'
  | 'ru'
  | 'en-gb'
  | 'fr-ca'
  | 'es-419'
  | 'es-mx';

type NewsText = {
  title: string;
  message: string;
};

type NewsItem = {
  localization: Partial<{
    [lang in Language]: NewsText;
  }>;

  priority: number;
  imageIndex: number;
};

type News = {
  items: Partial<{
    [key in `slot${Slot}`]: NewsItem;
  }>;

  startAt?: number;
  endAt?: number;
};

const NEWS_CONFIGURATION_NAME = 'news';

const EMPTY_NEWS_CONFIGURATION: NewsConfiguration = {
  news: [],
};

const DEFAULT_NEWS_CONFIGURATION: NewsConfiguration = {
  news: [
    {
      startAt: 0,
      endAt: 0,
      items: {
        slot1: {
          localization: {
            en: {
              title: 'News Title',
              message: 'Content for News',
            },
          },
          priority: 0,
          imageIndex: 10,
        },
      },
    },

    {
      startAt: 0,
      endAt: 0,
      items: {
        slot1: {
          localization: {
            en: {
              title: 'News Title',
              message: 'Content for News',
            },
            de: {
              title: 'Nachricht Titel',
              message: 'Inhalt der Nachricht',
            },
          },
          priority: 1,
          imageIndex: 16,
        },
      },
    },
  ],
};

function createDefaultNewsConfiguration(): boolean {
  return config.createDefault(NEWS_CONFIGURATION_NAME, DEFAULT_NEWS_CONFIGURATION);
}

function validNewsConfiguration(content: unknown): boolean {
  return true;
}

function readNewsConfiguration(): NewsConfiguration {
  logging.info('Loading News Configuration');

  const created = createDefaultNewsConfiguration();
  if (created) {
    logging.info('Created default News Configuration');
  }

  const content = config.read(NEWS_CONFIGURATION_NAME);
  if (!validNewsConfiguration(content)) {
    logging.warn('News Configuration not valid. Falling back to default news.');
    return EMPTY_NEWS_CONFIGURATION;
  }

  return content as NewsConfiguration;
}

export function configureNews() {
  logging.info('\u001b[1mConfiguring News\u001b[0m');
  const configuration = readNewsConfiguration();

  // Cleanup old news
  logging.info('Deleting old news...');
  database.news.deleteMany();

  // Create news entries
  logging.info('Creating news...');
  database.news.createMany({
    data: configuration.news.map((news, newsIndex) => ({
      name: newsIndex.toString(),
      start_at: news.startAt,
      end_at: news.endAt,
    })),
  });

  // Create News Item entries
  database.news_items.createMany({
    data: configuration.news.flatMap((news, newsIndex) =>
      Object.entries(news.items).map(([slot, item], itemIndex) => ({
        news_name: newsIndex.toString(),
        name: itemIndex.toString(),
        priority: item.priority,
        slot_0: slot === 'slot1',
        slot_1: slot === 'slot2',
        slot_2: slot === 'slot3',
        platforms: null,
        image_index: item.imageIndex,
      }))
    ),
  });

  // Create News Item Text entries
  database.news_item_text.createMany({
    data: configuration.news.flatMap((news, newsIndex) =>
      Object.values(news.items).flatMap((item, itemIndex) =>
        Object.entries(item.localization).map(([lang, text]) => ({
          news_name: newsIndex.toString(),
          item_name: itemIndex.toString(),
          title: text.title,
          message: text.message,
          language: lang,
        }))
      )
    ),
  });
}
