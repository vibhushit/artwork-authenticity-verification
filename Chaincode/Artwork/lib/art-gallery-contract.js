/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ArtGalleryContract extends Contract {

    async queryAllPaintings(ctx) {
        const queryString = {
            selector: {
            }
        };
        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getAllResults(resultIterator, false);
        return JSON.stringify(result);
    }

    async queryVerifiedPaintings(ctx) {
        const queryString = {
            selector: {
                verified: true
            }
        };
        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getAllResults(resultIterator, false);
        return JSON.stringify(result);
    }

    async getAllResults(iterator, isHistory) {
        let allResult = [];
        for (let res = await iterator.next(); !res.done; res = await iterator.next()) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.TimeStamp = res.value.timestamp;
                    jsonRes.Record = JSON.parse(res.value.value.toString());

                }
                else {
                    jsonRes.Key = res.value.key;
                    jsonRes.Record = JSON.parse(res.value.value.toString());
                }
                allResult.push(jsonRes);

            }
        }
        await iterator.close();
        return allResult;
    }

    // async registerPainting(ctx, paintingId, artist, title, yearCreated) {

    //     const invokingOrganization = ctx.clientIdentity.getMSPID();
    //     if (invokingOrganization !== 'gallery-art-com') {
    //         throw new Error('Unauthorized access to registerPainting transaction');
    //     }

    //     const paintingExists = await this.paintingExists(ctx, paintingId);
    //     if (paintingExists) {
    //         throw new Error(`The painting ${paintingId} already exists`);
    //     }

    //     const painting = {
    //         artist,
    //         title,
    //         yearCreated,
    //         gallery: ctx.clientIdentity.getID(), // Store the gallery's identity in the painting data
    //         verified: false // Initialize the 'verified' flag as false
    //     };

    //     const buffer = Buffer.from(JSON.stringify(painting));
    //     await ctx.stub.putState(paintingId, buffer);
    // }

    // async getPainting(ctx, paintingId) {

    //     const invokingOrganization = ctx.clientIdentity.getMSPID();
    //     if (invokingOrganization !== 'gallery-art-com') {
    //         throw new Error('Unauthorized access to getPainting transaction');
    //     }

    //     const paintingExists = await this.paintingExists(ctx, paintingId);
    //     if (!paintingExists) {
    //         throw new Error(`The painting ${paintingId} does not exist`);
    //     }

    //     const buffer = await ctx.stub.getState(paintingId);
    //     const painting = JSON.parse(buffer.toString());
    //     return painting;
    // }

    // async updatePainting(ctx, paintingId, title, yearCreated) {
    //     const paintingExists = await this.paintingExists(ctx, paintingId);
    //     if (!paintingExists) {
    //         throw new Error(`The painting ${paintingId} does not exist`);
    //     }

    //     const buffer = await ctx.stub.getState(paintingId);
    //     const painting = JSON.parse(buffer.toString());

    //     painting.title = title;
    //     painting.yearCreated = yearCreated;

    //     const updatedBuffer = Buffer.from(JSON.stringify(painting));
    //     await ctx.stub.putState(paintingId, updatedBuffer);
    // }

    // async deletePainting(ctx, paintingId) {
    //     const paintingExists = await this.paintingExists(ctx, paintingId);
    //     if (!paintingExists) {
    //         throw new Error(`The painting ${paintingId} does not exist`);
    //     }

    //     await ctx.stub.deleteState(paintingId);
    // }

    // async paintingExists(ctx, paintingId) {
    //     const buffer = await ctx.stub.getState(paintingId);
    //     return (!!buffer && buffer.length > 0);
    // }

    // async viewAllPaintings(ctx) {
    //     const invokingOrganization = ctx.clientIdentity.getMSPID();
    //     if (invokingOrganization !== 'gallery-art-com') {
    //         throw new Error('Unauthorized access to viewAllPaintings transaction');
    //     }

    //     const iterator = await ctx.stub.getStateByRange('', '');
    //     const paintings = [];

    //     // eslint-disable-next-line no-constant-condition
    //     while (true) {
    //         const result = await iterator.next();
    //         if (result.value && result.value.value.toString()) {
    //             const painting = JSON.parse(result.value.value.toString());
    //             if (painting.gallery === ctx.clientIdentity.getID()) {
    //                 paintings.push(painting);
    //             }
    //         }
    //         if (result.done) {
    //             await iterator.close();
    //             break;
    //         }
    //     }

    //     return paintings;
    // }

}

module.exports = ArtGalleryContract;
