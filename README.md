# Drip Frontend

[![Maintainability](https://api.codeclimate.com/v1/badges/652ca31a64079f1ebc00/maintainability)](https://codeclimate.com/repos/62c90637d150fe5a9a00007f/maintainability)

## App Deploys

[mainnet](https://drip.dcaf.so/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/47c5386b-c0ef-4bc4-b3bf-5eda0a9c378d/deploy-status)](https://app.netlify.com/sites/drip-dcaf/deploys)

[devnet](https://devnet.drip.dcaf.so/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/f1eefc24-2172-41cb-9a87-0250762c0848/deploy-status)](https://app.netlify.com/sites/devnet-drip/deploys)

[mainnet-staging](https://drip-mainnet-staging.netlify.app/deposit)
[![Netlify Status](https://api.netlify.com/api/v1/badges/bda75dec-d6e1-4788-bb16-a481726c39e5/deploy-status)](https://app.netlify.com/sites/drip-mainnet-staging/deploys)

[devnet-staging](https://drip-devnet-staging.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/422e3c8e-777a-47fa-a58e-604a61d42539/deploy-status)](https://app.netlify.com/sites/drip-devnet-staging/deploys)

## Getting Started

### Install dependencies

```bash
yarn
```

### Link local @dcaf-labs/drip-sdk (optional)

1. Run this in the root directory of the @dcaf-labs/drip-sdk package

### Link remote @dcaf-labs/drip-sdk

1. Create a personal access token on github
2. Add the following to your `.zshrc`

```
export NPM_TOKEN="<personal access token>"
```

NOTE: the token must have at least `read:packages` permissions

```bash
yarn link
```

2. Run this in the root directory

```bash
yarn link @dcaf-labs/drip-sdk
```

### Run the app

```bash
yarn start
```
