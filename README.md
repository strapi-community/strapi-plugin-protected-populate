<div align="center">
<h1>Strapi Protected Populate Plugin</h1>
	
<p>
  <a href="https://discord.strapi.io">
    <img src="https://img.shields.io/discord/811989166782021633?color=blue&label=strapi-discord" alt="Strapi Discord">
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-protected-populate">
    <img src="https://img.shields.io/npm/v/strapi-plugin-protected-populate/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-protected-populate">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-protected-populate" alt="Monthly download on NPM" />
  </a>
</p>
</div>

## Table of Contents <!-- omit in toc -->

- [🚦 Current Status](#-current-status)
- [✨ Features](#-features)
- [🤔 Motivation](#-motivation)
- [🖐 Requirements](#-requirements)
- [⏳ Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [Contributing](#contributing)
- [Migration](#migration)
- [License](#license)

## 🚦 Current Status

This package is currently under development and should be consider **ALPHA** in terms of state. I/We are currently accepting contributions.

For more information on contributing please see [the contrib message below](#contributing).

## ✨ Features

These are the primary features that are finished or currently being worked on:

- [x] Protected your Get request populates and fields
- [x] Allow you to protect routes per role (In the near future)

## 🤔 Motivation

The purpose of this plugin is to have a easy way to protect your get endpoints from getting to much information out of them.
I made this plugin since I got sick and tired of writing complex policies to do this exact thing.

## 🖐 Requirements

Supported Strapi Versions:

| Strapi Version | Supported | Tested On     |
| -------------- | --------- | ------------- |
| v3             | ❌        | N/A           |
| <=v4.5.2       | ❌        | N/A           |
| v4.5.3/4.6.2   | ✅        | December 2022 |
| v4.7.0/4.7.1   | ❌        | N/A           |
| v4.8.0+        | ✅        | April 2023    |

**This plugin will not work on any version older then v4.5.3 since I am using the on syntax for dynamic zones wat was added in that version**

## ⏳ Installation

Install the plugin in your Strapi project or your Strapi plugin.

```bash
# Using Yarn (Recommended)
yarn add strapi-plugin-protected-populate

# Using npm
npm install strapi-plugin-protected-populate
```

## 🔧 Configuration

WIP

### Config

standard config

```js
module.exports = () => {
  return {
    'protected-populate': {
      enabled: true,
    },
  };
};
```

enable auto populate will automatically populate all fields and populates if no ctx.query.populate / ctx.query.fields is found.

```js
module.exports = () => {
  return {
    'protected-populate': {
      enabled: true,
      config: {
        ['auto-populate']: true,
      },
    },
  };
};
```

## Contributing

Please open issues before making a pull request so that we can talk about what you want to change for the best results.

## Migration

V1.0.0 to v1.1.0
choose what way you want to do the migration GUI or File change

### GUI way

Go to the gui select all Media types and deselect them
Update to v1.1.1 select all deselected Media

### File change

Find all the media in fields and change them to populate

## License

MIT
