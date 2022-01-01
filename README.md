# Chrome extension

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/brokalys-sslv-historical/pmjalfejchcofiplefmhglefgbkocmmh" target="_blank">
    <img src="/demo.jpg" alt="Extension Demo" />
  </a>
</p>

[![Build](https://github.com/brokalys/chrome-extension/actions/workflows/build.yaml/badge.svg?branch=master)](https://github.com/brokalys/chrome-extension/actions/workflows/build.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Chrome extension that integrates in ss.lv providing price history and analytics for real-estate classifieds.

### Installing

```sh
yarn install
```

### Development

Launch the development build watcher and load the extension (as unpacked) in chrome.

```sh
yarn start
```

### Testing

```sh
yarn test
```

### Building

Production build can be created with the following command. Deployment is done manually by uploading the build `zip` artefact to the chrome store.

```sh
yarn build
```
