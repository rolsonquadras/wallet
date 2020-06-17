/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import {WalletGet} from "./getCredentials";
import jp from 'jsonpath';
import {PresentationExchange} from '../common/presentationExchange'

const responseType = "VerifiablePresentation"
const queryType = "PresentationDefinitionQuery"

/**
 * WalletGetByQuery provides CHAPI get vp features
 * @param aries instance & credential event
 * @class
 */
export class WalletGetByQuery extends WalletGet {
    constructor(aries, credEvent) {
        super(aries, credEvent);

        // validate query and init Presentation Exchange
        let query = jp.query(credEvent, '$..credentialRequestOptions.web.VerifiablePresentation.query[*]');

        if (query.length > 0 && query[0].type != queryType) {
            throw "invalid request, incorrect query type"
        }

        this.exchange = new PresentationExchange(query[0].presentationDefinitionQuery)
    }

    requirementDetails() {
        return this.exchange.requirementDetails()
    }

    async getPresentationSubmission() {
        let credentials = await super.getCredentialRecords()

        let vcs = []
        for (let credential of credentials) {
            const resp = await this.aries.verifiable.getCredential({
                id: credential.key
            })
            vcs.push(JSON.parse(resp.verifiableCredential))
        }

        return this.exchange.createPresentationSubmission(vcs)
    }

    async createAndSendPresentation(walletUser, presentationSubmission) {

        try {
            let data
            await this.aries.verifiable.generatePresentation({
                presentation: presentationSubmission,
                did: walletUser.did,
                domain: this.domain,
                challenge: this.challenge,
                skipVerify: true,
                signatureType: walletUser.signatureType
            }).then(resp => {
                    data = resp.verifiablePresentation
                }
            )

            this.sendResponse(responseType, data)
        } catch (e) {
            this.sendResponse("error", e)
        }

    }
}