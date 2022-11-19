# Drip Frontend

[![Maintainability](https://api.codeclimate.com/v1/badges/652ca31a64079f1ebc00/maintainability)](https://codeclimate.com/repos/62c90637d150fe5a9a00007f/maintainability)

|            | Devnet                                                                                                                                                                                                             | Mainnet                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Staging    | [![Netlify Status](https://api.netlify.com/api/v1/badges/422e3c8e-777a-47fa-a58e-604a61d42539/deploy-status)](https://app.netlify.com/sites/drip-devnet-staging/deploys) <br/> [App](https://devnet.drip.dcaf.app) | [![Netlify Status](https://api.netlify.com/api/v1/badges/bda75dec-d6e1-4788-bb16-a481726c39e5/deploy-status)](https://app.netlify.com/sites/drip-mainnet-staging/deploys) <br/> [App](https://drip.dcaf.app) |
| Production | [![Netlify Status](https://api.netlify.com/api/v1/badges/f1eefc24-2172-41cb-9a87-0250762c0848/deploy-status)](https://app.netlify.com/sites/devnet-drip/deploys) <br/> [App](https://devnet.drip.dcaf.so)          | [![Netlify Status](https://api.netlify.com/api/v1/badges/47c5386b-c0ef-4bc4-b3bf-5eda0a9c378d/deploy-status)](https://app.netlify.com/sites/drip-dcaf/deploys) <br/> [App](https://drip.dcaf.so)             |

## Deploy Process

|            | Devnet                  | Mainnet                 |
| ---------- | ----------------------- | ----------------------- |
| Staging    | Merge to `main`         | Merge to `main`         |
| Production | Action via `infra` repo | Action via `infra` repo |

## Getting Started

### Install dependencies via Yarn

```bash
yarn
```

### Link local @dcaf-labs/drip-sdk (optional)

- In `dcaf-labs/drip-sdk`, run:

```bash
yarn link
```

- In `dcaf-labsdrip-frontend`, run:

```bash
yarn link @dcaf-labs/drip-sdk
```
