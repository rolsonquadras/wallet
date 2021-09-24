/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

"use strict";

import { config } from "./wdio.shared.conf";

exports.config = {
  ...config,
  walletName: "TrustBloc Wallet",
  walletURL: "https://wallet.stg.trustbloc.dev",
  mediatorURL: "https://router-api.stg.trustbloc.dev",
};
