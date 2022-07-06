# Dcaf Protocol Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/f1eefc24-2172-41cb-9a87-0250762c0848/deploy-status)](https://app.netlify.com/sites/devnet-drip/deploys)

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
