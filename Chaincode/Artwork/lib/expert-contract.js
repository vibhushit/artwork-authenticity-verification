/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ExpertContract extends Contract {

    async verifyAuthenticity(ctx, paintingId) {

        const invokingOrganization = ctx.clientIdentity.getMSPID();
        if (invokingOrganization !== 'expert-art-com') {
            throw new Error('Unauthorized access to verifyAuthenticity transaction');
        }

        const paintingExists = await this.paintingExists(ctx, paintingId);
        if (!paintingExists) {
            throw new Error(`The painting ${paintingId} does not exist`);
        }

        // Perform authenticity verification logic here
        // For example, you can connect to external systems or invoke external APIs
        // Once the verification is done, update the painting's 'verified' flag
        const buffer = await ctx.stub.getState(paintingId);
        const painting = JSON.parse(buffer.toString());
        painting.verified = true;

        const updatedBuffer = Buffer.from(JSON.stringify(painting));
        await ctx.stub.putState(paintingId, updatedBuffer);
    }

    async getPaintingAuthenticity(ctx, paintingId) {

        const invokingOrganization = ctx.clientIdentity.getMSPID();
        if (invokingOrganization !== 'expert-art-com') {
            throw new Error('Unauthorized access to getPaintingAuthenticity transaction');
        }

        const paintingExists = await this.paintingExists(ctx, paintingId);
        if (!paintingExists) {
            throw new Error(`The painting ${paintingId} does not exist`);
        }

        const buffer = await ctx.stub.getState(paintingId);
        const painting = JSON.parse(buffer.toString());
        return painting.verified;
    }

    async paintingExists(ctx, paintingId) {
        const buffer = await ctx.stub.getState(paintingId);
        return (!!buffer && buffer.length > 0);
    }
}

module.exports = ExpertContract;
