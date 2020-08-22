/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import {getCredentialType} from '../common/util.js';

/**
 * WalletStore provides CHAPI store features
 * @param aries instance & credential event
 * @class
 */
export class WalletStore {
    constructor(aries, trustblocAgent, opts, credEvent) {
        this.aries = aries
        this.trustblocAgent = trustblocAgent
        this.trustblocStartupOpts = opts
        this.credEvent = credEvent
    }

    async saveCredential(name, credential, isVC) {
        let records = []
        if (isVC) {
            records.push({name, credential})
        } else {
            const vcs = Array.isArray(credential.verifiableCredential) ? credential.verifiableCredential : [credential.verifiableCredential]
            const useSuffix = vcs.length > 1

            vcs.forEach((vc, i) => {
                const frName = useSuffix ? `${name}_${getCredentialType(vc.type)}_${++i}` : name
                records.push({name: frName, credential: vc})
            })
        }

        // Call aries to save credentials
        let status = 'success'
        try {
            for (let r of records) {
                await this.save(r.name, r.credential)
            }
        } catch (e) {
            status = e.toString()
        }

        console.log(`sending status response with status ${status}`)

        // Call Credential Handler callback
        this.credEvent.respondWith(new Promise(function (resolve) {
            return resolve({
                dataType: "Response",
                data: status
            });
        }))
    }

    async save(name, vcData) {
        await this.aries.verifiable.saveCredential({
            name: name,
            verifiableCredential: JSON.stringify(vcData)
        }).then(() => {
                console.log('successfully saved VC:', name)
            }
        ).catch(err => {
            console.log(`vc save failed for ${name} : errMsg=${err}`)
            throw err
        })

        const t = await new this.trustblocAgent.Framework(this.trustblocStartupOpts)

        // Save credential to persistent storage
        await t.credentialclient.saveCredential({
            name: name,
            credential: vcData
        })

    }

    async savePresentation(name, presentation) {
        const t = await new this.trustblocAgent.Framework(this.trustblocStartupOpts)

        // Save presentation to persistent storage
        await t.presentationclient.savePresentation({
            name: name,
            credential: presentation
        })
    }

    cancel() {
        this.credEvent.respondWith(new Promise(function (resolve) {
            return resolve({
                dataType: "Response",
                data: 'cancelled'
            });
        }))
    }
}