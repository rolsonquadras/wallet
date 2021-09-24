/*
Copyright SecureKey Technologies Inc. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

"use strict";

const { chapi, wallet, adapter } = require("../helpers");

const credential = new Map();
credential.set("PermanentResidentCard", {
  name: "Permanent Resident Card",
  vc: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/citizenship/v1",
      "https://w3id.org/vc-revocation-list-2020/v1",
      "https://w3id.org/security/bbs/v1",
    ],
    credentialStatus: {
      id: "https://issuer-vcs.trustbloc.local/status/1#3",
      revocationListCredential: "https://issuer-vcs.trustbloc.local/status/1",
      revocationListIndex: "3",
      type: "RevocationList2020Status",
    },
    credentialSubject: {
      birthCountry: "Bahamas",
      birthDate: "1958-07-17",
      familyName: "Pasteur",
      gender: "Male",
      givenName: "Louis",
      id: "did:orb:AiMP4:EiA2Gtl-qHKjTouzu-Rd0cYOwQxJ-qN0DO0HNnhfXXCqCg",
      lprCategory: "C09",
      lprNumber: "999-999-999",
      residentSince: "2015-01-01",
      type: ["Person", "PermanentResident"],
    },
    description: "Permanent Resident Card of Mr.Louis Pasteur",
    id: "http://example.com/eb299a34-529e-4a84-a67c-573865db4aa7",
    issuanceDate: "2021-03-11T14:52:00.8492482Z",
    issuer: {
      id: "did:key:zUC72c7u4BYVmfYinDceXkNAwzPEyuEE23kUmJDjLy8495KH3pjLwFhae1Fww9qxxRdLnS2VNNwni6W3KbYZKsicDtiNNEp76fYWR6HCD8jAz6ihwmLRjcHH6kB294Xfg1SL1qQ",
      name: "didkey-bbsblssignature2020-bls12381g2",
    },
    name: "Permanent Resident Card",
    proof: {
      created: "2021-07-06T18:16:57.739627-04:00",
      proofPurpose: "assertionMethod",
      proofValue:
        "koyKGr8WwjCOUqm-HV_7SVtvIIM4EhnJJ_8P2k0RF3ElQP2ntQJMKKtpoQTqk5l3QI5jN0Zn8nHJm3gyFkKdYJpC4IseNTU98u9UTijHlABpAhGbDaKTHs-b1IDsHkx_DrR3BSktz1Va_cilRP2WqA",
      type: "BbsBlsSignature2020",
      verificationMethod:
        "did:key:zUC73A7EHiDAxxy29qox4hD5Dyc6fXqStkWjbW2V5uVtmdpAr33Lhtz2sb9m8WotP6WxvjWxGb4iVsPPM5EGkwq5NCNwb6sn9breK588SiEcBtQEPyK7wXzXBT9QcCZ3S5XWygm#zUC73A7EHiDAxxy29qox4hD5Dyc6fXqStkWjbW2V5uVtmdpAr33Lhtz2sb9m8WotP6WxvjWxGb4iVsPPM5EGkwq5NCNwb6sn9breK588SiEcBtQEPyK7wXzXBT9QcCZ3S5XWygm",
    },
    type: ["VerifiableCredential", "PermanentResidentCard"],
  },
  vcSubjectData: [
    { name: "Given Name", value: "Louis" },
    { name: "Family Name", value: "Pasteur" },
    { name: "Gender", value: "Male" },
    { name: "Date of birth", value: "1958-07-17" },
    { name: "Country of Birth", value: "Bahamas" },
    { name: "Resident Since", value: "2015-01-01" },
  ],
  vpRequest: {
    type: "QueryByExample",
    credentialQuery: {
      reason: "Please present your identity document.",
      example: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/citizenship/v1",
          "https://w3id.org/security/bbs/v1",
        ],
        type: ["PermanentResidentCard"],
      },
    },
  },
});

describe("TrustBloc Wallet - Store/Share credential flow (CHAPI)", () => {
  const ctx = {
    email: `ui-aut-${new Date().getTime()}@test.com`,
  };

  // runs once before the first test in this block
  before(async () => {
    await browser.reloadSession();
    await browser.maximizeWindow();
  });

  beforeEach(function () {});

  it(`User Sign up (${ctx.email})`, async function () {
    this.timeout(90000);

    // 1. Navigate to Wallet Website
    await browser.navigateTo(browser.config.walletURL);

    // 2. Initialize Wallet (register/sign-up/etc.)
    await wallet.init(ctx);
  });

  it.skip(`User Stores Permanent Resident Card Credential`, async function () {
    // mock issuer (wallet page with sample requests)
    await browser.navigateTo(browser.config.walletURL + "/web-wallet");

    const vcSampleBtn = await $("#store-vc-sample-1");
    await vcSampleBtn.waitForExist();
    await vcSampleBtn.click();

    let vprs = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: "VerifiablePresentation",
      verifiableCredential: [credential["PermanentResidentCard"].vc],
    };

    const sampleText = await $("#vcDataTextArea");
    await sampleText.clearValue();
    await sampleText.addValue(vprs);

    const storeButton = await $("button*=Store");
    await storeButton.waitForClickable();
    await storeButton.click();

    await chapi.chooseWallet({
      name: browser.config.walletName,
    });

    await wallet.storeCredentials(ctx);
    await browser.switchToFrame(null);

    const storeSuccessMsg = await $(
      "div*=Successfully stored verifiable presentation to wallet."
    );
    await storeSuccessMsg.waitForExist();
  });

  it(`User goes to verifier and clicks on redirect`, async function () {
    // rp agent
    rp = new adapter.VerifierAdapter("verifier", browser.config.mediatorURL);
    await rp.init();

    let invitation = await rp.createInvitation();
    rp.acceptExchangeRequest();
    rp.acceptPresentationProposal({
      id: "22c77155-edf2-4ec5-8d44-b393b4e4fa38",
      input_descriptors: [
        {
          id: "20b073bb-cede-4912-9e9d-334e5702077b",
          schema: [
            { uri: "https://w3id.org/citizenship#PermanentResidentCard" },
          ],
          constraints: {
            fields: [{ path: ["$.credentialSubject.familyName"] }],
          },
        },
      ],
    });
  });

  it(`User shares the credential`, async function () {});
});
