# Drip Frontend

[![Maintainability](https://api.codeclimate.com/v1/badges/652ca31a64079f1ebc00/maintainability)](https://codeclimate.com/repos/62c90637d150fe5a9a00007f/maintainability)

|             | Devnet | Mainnet                                                                                                                                                                                          |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Staging n/a | n/a    | n/a                                                                                                                                                                                              |
| Production  | n/a    | [![Netlify Status](https://api.netlify.com/api/v1/badges/47c5386b-c0ef-4bc4-b3bf-5eda0a9c378d/deploy-status)](https://app.netlify.com/sites/drip-dcaf/deploys) <br/> [App](https://drip.dcaf.so) |

<!-- ## Deploy Process

|            | Devnet                  | Mainnet                 |
| ---------- | ----------------------- | ----------------------- |
| Staging    | Merge to `main`         | Merge to `main`         |
| Production | Action via `infra` repo | Action via `infra` repo | -->

## Getting Started

Export `REACT_APP_SOLANA_RPC_URL` and run `yarn && yarn start-mainnet-prod`.

### Install dependencies

```bash
yarn
```

### Link local @dcaf-labs/drip-sdk (optional)

- In `dcaf-labs/drip-sdk`, run:

```bash
yarn link
```

- In `dcaf-labs/drip-frontend`, run:

```bash
yarn link @dcaf-labs/drip-sdk
```
