export type DcaVault = {
  version: '0.1.0';
  name: 'dca_vault';
  instructions: [
    {
      name: 'initVaultProtoConfig';
      accounts: [
        {
          name: 'vaultProtoConfig';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'creator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'InitVaultProtoConfigParams';
          };
        }
      ];
    },
    {
      name: 'initVault';
      accounts: [
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenAMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenBMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultProtoConfig';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'creator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'initVaultPeriod';
      accounts: [
        {
          name: 'vaultPeriod';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenAMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenBMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultProtoConfig';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'creator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'InitializeVaultPeriodParams';
          };
        }
      ];
    },
    {
      name: 'closePosition';
      accounts: [
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultPeriodI';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultPeriodJ';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultPeriodUserExpiry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userPosition';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userTokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userTokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userPositionNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userPositionNftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenAMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenBMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'withdrawer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'deposit';
      accounts: [
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultPeriodEnd';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userPosition';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenAMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'userPositionNftMint';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'vaultTokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userTokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userPositionNftAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'depositor';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'DepositParams';
          };
        }
      ];
    },
    {
      name: 'withdrawB';
      accounts: [
        {
          name: 'vault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultPeriodI';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultPeriodJ';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'userPosition';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userPositionNftAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'userPositionNftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultTokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenBMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'userTokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'withdrawer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'triggerDca';
      accounts: [
        {
          name: 'dcaTriggerSource';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultProtoConfig';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lastVaultPeriod';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'currentVaultPeriod';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'swapTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenAMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenBMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultTokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'swapTokenAAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'swapTokenBAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'swapFeeAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'swap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'swapAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenSwapProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: 'position';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'positionAuthority';
            type: 'publicKey';
          },
          {
            name: 'depositedTokenAAmount';
            type: 'u64';
          },
          {
            name: 'withdrawnTokenBAmount';
            type: 'u64';
          },
          {
            name: 'vault';
            type: 'publicKey';
          },
          {
            name: 'depositTimestamp';
            type: 'i64';
          },
          {
            name: 'dcaPeriodIdBeforeDeposit';
            type: 'u64';
          },
          {
            name: 'numberOfSwaps';
            type: 'u64';
          },
          {
            name: 'periodicDripAmount';
            type: 'u64';
          },
          {
            name: 'isClosed';
            type: 'bool';
          },
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'vault';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'protoConfig';
            type: 'publicKey';
          },
          {
            name: 'tokenAMint';
            type: 'publicKey';
          },
          {
            name: 'tokenBMint';
            type: 'publicKey';
          },
          {
            name: 'tokenAAccount';
            type: 'publicKey';
          },
          {
            name: 'tokenBAccount';
            type: 'publicKey';
          },
          {
            name: 'lastDcaPeriod';
            type: 'u64';
          },
          {
            name: 'dripAmount';
            type: 'u64';
          },
          {
            name: 'dcaActivationTimestamp';
            type: 'i64';
          },
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'vaultPeriod';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'vault';
            type: 'publicKey';
          },
          {
            name: 'periodId';
            type: 'u64';
          },
          {
            name: 'twap';
            type: 'u128';
          },
          {
            name: 'dar';
            type: 'u64';
          },
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'vaultProtoConfig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'granularity';
            type: 'u64';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'DepositParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenADepositAmount';
            type: 'u64';
          },
          {
            name: 'dcaCycles';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'InitializeVaultPeriodParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'periodId';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'InitVaultProtoConfigParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'granularity';
            type: 'u64';
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidGranularity';
      msg: 'Granularity must be an integer larger than 0';
    },
    {
      code: 6001;
      name: 'PeriodicDripAmountIsZero';
      msg: 'Periodic drip amount == 0';
    },
    {
      code: 6002;
      name: 'CannotGetVaultBump';
      msg: 'Cannot get vault bump';
    },
    {
      code: 6003;
      name: 'CannotGetPositionBump';
      msg: 'Cannot get position bump';
    },
    {
      code: 6004;
      name: 'CannotGetVaultPeriodBump';
      msg: 'Cannot get vault_period bump';
    },
    {
      code: 6005;
      name: 'WithdrawableAmountIsZero';
      msg: 'Withdrawable amount is zero';
    },
    {
      code: 6006;
      name: 'DuplicateDCAError';
      msg: 'DCA already triggered for the current period. Duplicate DCA triggers not allowed';
    },
    {
      code: 6007;
      name: 'IncompleteSwapError';
      msg: 'Swap did not complete';
    },
    {
      code: 6008;
      name: 'InvalidSwapFeeAccount';
      msg: 'Invalid swap fee account';
    },
    {
      code: 6009;
      name: 'InvalidSwapAuthorityAccount';
      msg: 'Invalid swap authority account';
    }
  ];
};

export const IDL: DcaVault = {
  version: '0.1.0',
  name: 'dca_vault',
  instructions: [
    {
      name: 'initVaultProtoConfig',
      accounts: [
        {
          name: 'vaultProtoConfig',
          isMut: true,
          isSigner: true
        },
        {
          name: 'creator',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'InitVaultProtoConfigParams'
          }
        }
      ]
    },
    {
      name: 'initVault',
      accounts: [
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenAMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenBMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultProtoConfig',
          isMut: false,
          isSigner: false
        },
        {
          name: 'creator',
          isMut: true,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'initVaultPeriod',
      accounts: [
        {
          name: 'vaultPeriod',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vault',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenAMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenBMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultProtoConfig',
          isMut: false,
          isSigner: false
        },
        {
          name: 'creator',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'InitializeVaultPeriodParams'
          }
        }
      ]
    },
    {
      name: 'closePosition',
      accounts: [
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultPeriodI',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultPeriodJ',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultPeriodUserExpiry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userPosition',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultTokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultTokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userTokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userTokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userPositionNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userPositionNftMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenAMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenBMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'withdrawer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'deposit',
      accounts: [
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultPeriodEnd',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userPosition',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenAMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'userPositionNftMint',
          isMut: true,
          isSigner: true
        },
        {
          name: 'vaultTokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userTokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userPositionNftAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'depositor',
          isMut: true,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'DepositParams'
          }
        }
      ]
    },
    {
      name: 'withdrawB',
      accounts: [
        {
          name: 'vault',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultPeriodI',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultPeriodJ',
          isMut: false,
          isSigner: false
        },
        {
          name: 'userPosition',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userPositionNftAccount',
          isMut: false,
          isSigner: false
        },
        {
          name: 'userPositionNftMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultTokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultTokenBMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'userTokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'withdrawer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'triggerDca',
      accounts: [
        {
          name: 'dcaTriggerSource',
          isMut: true,
          isSigner: true
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultProtoConfig',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lastVaultPeriod',
          isMut: false,
          isSigner: false
        },
        {
          name: 'currentVaultPeriod',
          isMut: true,
          isSigner: false
        },
        {
          name: 'swapTokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenAMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenBMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'vaultTokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'vaultTokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'swapTokenAAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'swapTokenBAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'swapFeeAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'swap',
          isMut: true,
          isSigner: false
        },
        {
          name: 'swapAuthority',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenSwapProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: 'position',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'positionAuthority',
            type: 'publicKey'
          },
          {
            name: 'depositedTokenAAmount',
            type: 'u64'
          },
          {
            name: 'withdrawnTokenBAmount',
            type: 'u64'
          },
          {
            name: 'vault',
            type: 'publicKey'
          },
          {
            name: 'depositTimestamp',
            type: 'i64'
          },
          {
            name: 'dcaPeriodIdBeforeDeposit',
            type: 'u64'
          },
          {
            name: 'numberOfSwaps',
            type: 'u64'
          },
          {
            name: 'periodicDripAmount',
            type: 'u64'
          },
          {
            name: 'isClosed',
            type: 'bool'
          },
          {
            name: 'bump',
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'vault',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'protoConfig',
            type: 'publicKey'
          },
          {
            name: 'tokenAMint',
            type: 'publicKey'
          },
          {
            name: 'tokenBMint',
            type: 'publicKey'
          },
          {
            name: 'tokenAAccount',
            type: 'publicKey'
          },
          {
            name: 'tokenBAccount',
            type: 'publicKey'
          },
          {
            name: 'lastDcaPeriod',
            type: 'u64'
          },
          {
            name: 'dripAmount',
            type: 'u64'
          },
          {
            name: 'dcaActivationTimestamp',
            type: 'i64'
          },
          {
            name: 'bump',
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'vaultPeriod',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'vault',
            type: 'publicKey'
          },
          {
            name: 'periodId',
            type: 'u64'
          },
          {
            name: 'twap',
            type: 'u128'
          },
          {
            name: 'dar',
            type: 'u64'
          },
          {
            name: 'bump',
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'vaultProtoConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'granularity',
            type: 'u64'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'DepositParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenADepositAmount',
            type: 'u64'
          },
          {
            name: 'dcaCycles',
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'InitializeVaultPeriodParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'periodId',
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'InitVaultProtoConfigParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'granularity',
            type: 'u64'
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidGranularity',
      msg: 'Granularity must be an integer larger than 0'
    },
    {
      code: 6001,
      name: 'PeriodicDripAmountIsZero',
      msg: 'Periodic drip amount == 0'
    },
    {
      code: 6002,
      name: 'CannotGetVaultBump',
      msg: 'Cannot get vault bump'
    },
    {
      code: 6003,
      name: 'CannotGetPositionBump',
      msg: 'Cannot get position bump'
    },
    {
      code: 6004,
      name: 'CannotGetVaultPeriodBump',
      msg: 'Cannot get vault_period bump'
    },
    {
      code: 6005,
      name: 'WithdrawableAmountIsZero',
      msg: 'Withdrawable amount is zero'
    },
    {
      code: 6006,
      name: 'DuplicateDCAError',
      msg: 'DCA already triggered for the current period. Duplicate DCA triggers not allowed'
    },
    {
      code: 6007,
      name: 'IncompleteSwapError',
      msg: 'Swap did not complete'
    },
    {
      code: 6008,
      name: 'InvalidSwapFeeAccount',
      msg: 'Invalid swap fee account'
    },
    {
      code: 6009,
      name: 'InvalidSwapAuthorityAccount',
      msg: 'Invalid swap authority account'
    }
  ]
};
