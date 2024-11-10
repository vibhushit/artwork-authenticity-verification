/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PaintingContract extends Contract {

    async paintingExists(ctx, paintingId) {
        const buffer = await ctx.stub.getState(paintingId);
        return (!!buffer && buffer.length > 0);
    }

    async createPainting(ctx, paintingId, artist, title, yearCreated) {

        const invokingOrganization = ctx.clientIdentity.getMSPID();
        if (invokingOrganization !== 'artist-art-com') {
            throw new Error('Unauthorized access to createPainting transaction');
        }

        const exists = await this.paintingExists(ctx, paintingId);
        if (exists) {
            throw new Error(`The painting ${paintingId} already exists`);
        }
        const asset = {
            artist,
            title,
            yearCreated,
            verified: false // Add a 'verified' flag to indicate authenticity verification status
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(paintingId, buffer);
        let addPaintingEventData = { Type: 'Painting creation', Artist: artist };
        await ctx.stub.setEvent('addPaintingEvent', Buffer.from(JSON.stringify(addPaintingEventData)));
    }

    async readPainting(ctx, paintingId) {
        const exists = await this.paintingExists(ctx, paintingId);
        if (!exists) {
            throw new Error(`The painting ${paintingId} does not exist`);
        }
        const buffer = await ctx.stub.getState(paintingId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updatePainting(ctx, paintingId, newValue) {

        const invokingOrganization = ctx.clientIdentity.getMSPID();
        if (invokingOrganization !== 'artist-art-com') {
            throw new Error('Unauthorized access to updatePainting transaction');
        }

        const exists = await this.paintingExists(ctx, paintingId);
        if (!exists) {
            throw new Error(`The painting ${paintingId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(paintingId, buffer);
    }

    async deletePainting(ctx, paintingId) {

        const invokingOrganization = ctx.clientIdentity.getMSPID();
        if (invokingOrganization !== 'artist-art-com') {
            throw new Error('Unauthorized access to deletePainting transaction');
        }

        const exists = await this.paintingExists(ctx, paintingId);
        if (!exists) {
            throw new Error(`The painting ${paintingId} does not exist`);
        }
        await ctx.stub.deleteState(paintingId);
    }

    // async queryAllPaintings(ctx) {
    //     const queryString = {
    //         selector: {
    //             verified: true
    //         }
    //     };
    //     let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    //     let result = await this.getAllResults(resultIterator, false);
    //     return JSON.stringify(result);
    // }

    // async getAllResults(iterator, isHistory) {
    //     let allResult = [];
    //     for (let res = await iterator.next(); !res.done; res = await iterator.next()) {
    //         if (res.value && res.value.value.toString()) {
    //             let jsonRes = {};
    //             if (isHistory && isHistory === true) {
    //                 jsonRes.TxId = res.value.txId;
    //                 jsonRes.TimeStamp = res.value.timestamp;
    //                 jsonRes.Record = JSON.parse(res.value.value.toString());

    //             }
    //             else {
    //                 jsonRes.Key = res.value.key;
    //                 jsonRes.Record = JSON.parse(res.value.value.toString());
    //             }
    //             allResult.push(jsonRes);

    //         }
    //     }
    //     await iterator.close();
    //     return allResult;
    // }

    // async verifyPainting(ctx, paintingId) {

    //     const invokingOrganization = ctx.clientIdentity.getMSPID();
    //     if (invokingOrganization !== 'expert-art-com') {
    //         throw new Error('Unauthorized access to verifyPainting transaction');
    //     }

    //     const exists = await this.paintingExists(ctx, paintingId);
    //     if (!exists) {
    //         throw new Error(`The painting ${paintingId} does not exist`);
    //     }
    //     const buffer = await ctx.stub.getState(paintingId);
    //     const asset = JSON.parse(buffer.toString());
    //     // Perform authenticity verification logic here
    //     // For example, you can connect to external systems or invoke external APIs
    //     asset.verified = true; // Update the 'verified' flag to indicate authenticity verification has been performed

    //     const updatedBuffer = Buffer.from(JSON.stringify(asset));
    //     await ctx.stub.putState(paintingId, updatedBuffer);
    // }
}

module.exports = PaintingContract;
