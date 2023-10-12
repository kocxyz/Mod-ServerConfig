import logging from 'logging';
import config from 'config';
import database from 'database';

type TunablesConfiguration = {
  social: {
    max_members_per_crew: number;
    max_pending_crew_invites: number;
    max_friends_per_user: number;
    max_blocks_per_user: number;
    max_pending_friend_requests: number;
  };

  inactivity: {
    solo_inactivity_seconds: number;
    group_inactivity_seconds: number;
  };

  matchmaking: {
    match_xp_multiplier: number;
    quickplay_bots_start_seconds: number;
  };
};

const TUNABLES_CONFIGURATION_NAME = 'tunables';
const DEFAULT_TUNABLES_CONFIGURATION: TunablesConfiguration = {
  social: {
    max_members_per_crew: 32,
    max_pending_crew_invites: 100,
    max_friends_per_user: 2000,
    max_blocks_per_user: 1000,
    max_pending_friend_requests: 100,
  },

  inactivity: {
    solo_inactivity_seconds: 600,
    group_inactivity_seconds: 600,
  },

  matchmaking: {
    match_xp_multiplier: 1,
    quickplay_bots_start_seconds: 120,
  },
};

function createDefaultTunablesConfiguration(): boolean {
  return config.createDefault(TUNABLES_CONFIGURATION_NAME, DEFAULT_TUNABLES_CONFIGURATION);
}

function readTunablesConfiguration(): TunablesConfiguration {
  logging.info('Loading Tunables Configuration');

  const created = createDefaultTunablesConfiguration();
  if (created) {
    logging.info('Created default Tunables Configuration');
  }

  const content = config.read(TUNABLES_CONFIGURATION_NAME) as Partial<TunablesConfiguration>;
  return {
    ...DEFAULT_TUNABLES_CONFIGURATION,
    ...content,

    social: {
      ...DEFAULT_TUNABLES_CONFIGURATION.social,
      ...content.social,
    },

    inactivity: {
      ...DEFAULT_TUNABLES_CONFIGURATION.inactivity,
      ...content.inactivity,
    },

    matchmaking: {
      ...DEFAULT_TUNABLES_CONFIGURATION.matchmaking,
      ...content.matchmaking,
    },
  };
}

export function configureTunables() {
  const configuration = readTunablesConfiguration();

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_max_crew_members',
    },
    data: {
      value: configuration.social.max_members_per_crew,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_max_crew_invites',
    },
    data: {
      value: configuration.social.max_pending_crew_invites,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_max_friends',
    },
    data: {
      value: configuration.social.max_friends_per_user,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_max_friend_requests',
    },
    data: {
      value: configuration.social.max_pending_friend_requests,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_max_blocks',
    },
    data: {
      value: configuration.social.max_blocks_per_user,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_solo_inactivity_seconds',
    },
    data: {
      value: configuration.inactivity.solo_inactivity_seconds,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_group_inactivity_seconds',
    },
    data: {
      value: configuration.inactivity.group_inactivity_seconds,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_match_xp_multiplier',
    },
    data: {
      value: configuration.matchmaking.match_xp_multiplier,
    },
  });

  database.stats_global.update({
    where: {
      key: 'k_backend_tunable_quickplay_bots_start_seconds',
    },
    data: {
      value: configuration.matchmaking.quickplay_bots_start_seconds,
    },
  });
}
