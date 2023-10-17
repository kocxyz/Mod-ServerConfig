# Server Configs Mod

A server side mod that enables server maintainers to better configure their Knockout City Servers.

## Installation

In order to install the mod head over to the [release tab](https://github.com/kocxyz/Mod-ServerConfig/releases) and download the `Server-Config.zip` from the latest release.

Copy the `server-config` folder into your `mods` folder and start the server with mod-loader.

The mod should create the default configurations during its first load. Make sure to enable the features you like in the `settings.yaml`. Restart the server and the feature configurations should be created.

## Configuration

There are multiple configuration files the mod creates:

- `settings.yaml`: A configuration file to enable/disable certain features
- `news.yaml`: A configuration file to setup server news
- `tunables.yaml`: A configuration file to change the server tunables

## Permissions

```yaml
server-config:
  database:
    # Required for news
    # (if news is enabled in settings.yaml)
    news:
      write: true
      delete: true
    news_items:
      write: true
    news_item_text:
      write: true

    # Required for tunables to be set
    # (if tunables is enabled in settings.yaml)
    stats_global:
      write: true
```
