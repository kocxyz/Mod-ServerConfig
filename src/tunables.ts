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
  logging.info('Configuring Tunables');

  const configuration = readTunablesConfiguration();
  const tunables = {
    k_backend_tunable_max_crew_members: configuration.social.max_members_per_crew,
    k_backend_tunable_max_crew_invites: configuration.social.max_pending_crew_invites,
    k_backend_tunable_max_friends: configuration.social.max_friends_per_user,
    k_backend_tunable_max_friend_requests: configuration.social.max_pending_friend_requests,
    k_backend_tunable_max_blocks: configuration.social.max_blocks_per_user,
    k_backend_tunable_solo_inactivity_seconds: configuration.inactivity.solo_inactivity_seconds,
    k_backend_tunable_group_inactivity_seconds: configuration.inactivity.group_inactivity_seconds,
    k_backend_tunable_match_xp_multiplier: configuration.matchmaking.match_xp_multiplier,
    k_backend_tunable_quickplay_bots_start_seconds: configuration.matchmaking.quickplay_bots_start_seconds,
  };

  Object.entries(tunables).forEach(([key, value]) => {
    database.stats_global.update({
      where: {
        key: key,
      },
      data: {
        value: value,
      },
    });
  });
}
