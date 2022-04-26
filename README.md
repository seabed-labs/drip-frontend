# Dcaf Protocol Frontend

## Getting Started

### Install dependencies

```bash
yarn
```

### Link local @dcaf-protocol/drip-sdk (optional)

1. Run this in the root directory of the @dcaf-protocol/drip-sdk package

### Link remote @dcaf-protocol/drip-sdk

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
yarn link @dcaf-protocol/drip-sdk
```

### Run the app

```bash
yarn start
```
