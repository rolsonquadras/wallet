/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

// import {connectToMediator, getMediatorConnections, waitForEvent} from '@trustbloc/wallet-sdk';

import {
  //     DIDEXCHANGE_STATE_REQUESTED,
  //     DIDEXCHANGE_STATE_TOPIC,
  loadFrameworks,
  //     POST_STATE,
  //     PRESENT_PROOF_ACTION_TOPIC,
  //     retryWithDelay,
  //     testConfig
} from "./common";

// import {expect} from "chai";

// var uuid = require('uuid/v4')

/**
 * Adapter mocks common issuer or rp adapter features
 *
 * @param agent instance
 * @class
 */
export class Adapter {
  constructor(label, mediatorEndPoint) {
    this.label = label;
    this.mediatorEndPoint = mediatorEndPoint;
  }

  async init() {
    this.agent = await loadFrameworks({ name: this.label });

    // await connectToMediator(this.agent, this.mediatorEndPoint)

    // let conns = await getMediatorConnections(this.agent)
    // expect(conns).to.not.empty
  }

  // async createInvitation() {
  //     let response = await this.agent.mediatorclient.createInvitation({
  //         label: this.label,
  //         router_connection_id: await getMediatorConnections(this.agent, {single: true})
  //     })

  //     return response.invitation
  // }

  // async acceptExchangeRequest(timeout) {
  //     return await waitForEvent(this.agent, {
  //         stateID: DIDEXCHANGE_STATE_REQUESTED,
  //         type: POST_STATE,
  //         topic: DIDEXCHANGE_STATE_TOPIC,
  //         timeout,
  //         callback: async (payload) => {
  //             await this.agent.didexchange.acceptExchangeRequest({
  //                 id: payload.Properties.connectionID,
  //                 router_connections: await getMediatorConnections(this.agent, {single: true}),
  //             })
  //         }
  //     })
  // }

  // async destroy() {
  //     return await this.agent.destroy()
  // }
}

/**
 * VerifierAdapter mocks verifier(relying party) adapter features.
 *
 * @param agent instance
 * @class
 */
export class VerifierAdapter extends Adapter {
  constructor(label, mediatorEndPoint) {
    super(label, mediatorEndPoint);
  }

  async init() {
    return await super.init();
  }

  // async acceptPresentationProposal(query = {}, timeout) {
  //     return await waitForEvent(this.agent, {
  //         topic: PRESENT_PROOF_ACTION_TOPIC,
  //         timeout,
  //         callback: async (payload) => {
  //             let id = uuid()
  //             let {myDID, theirDID, piid} = payload.Properties
  //             await this.agent.presentproof.sendRequestPresentation({
  //                 my_did: myDID,
  //                 their_did: theirDID,
  //                 request_presentation: {
  //                     will_confirm: true,
  //                     formats: [
  //                         {
  //                             attach_id: id,
  //                             format: "dif/presentation-exchange/definitions@v1.0",
  //                         },
  //                     ],
  //                     "request_presentations~attach": [
  //                         {
  //                             "@id": id,
  //                             lastmod_time: "0001-01-01T00:00:00Z",
  //                             data: {
  //                                 json: {
  //                                     presentation_definition: query,
  //                                 },
  //                             },
  //                         },
  //                     ],
  //                 },
  //             });
  //         }
  //     })
  // }

  // async acceptPresentProof(timeout) {
  //     let presentation
  //     await waitForEvent(this.agent, {
  //         topic: PRESENT_PROOF_ACTION_TOPIC,
  //         timeout,
  //         callback: async (payload) => {
  //             let {Message} = payload
  //             presentation = Message["presentations~attach"][0].data.json
  //         }
  //     })

  //     return presentation
  // }
}
