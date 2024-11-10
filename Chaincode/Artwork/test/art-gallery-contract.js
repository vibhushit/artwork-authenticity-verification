/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { ArtGalleryContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('ArtGalleryContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new ArtGalleryContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"art gallery 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"art gallery 1002 value"}'));
    });

    describe('#artGalleryExists', () => {

        it('should return true for a art gallery', async () => {
            await contract.artGalleryExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a art gallery that does not exist', async () => {
            await contract.artGalleryExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createArtGallery', () => {

        it('should create a art gallery', async () => {
            await contract.createArtGallery(ctx, '1003', 'art gallery 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"art gallery 1003 value"}'));
        });

        it('should throw an error for a art gallery that already exists', async () => {
            await contract.createArtGallery(ctx, '1001', 'myvalue').should.be.rejectedWith(/The art gallery 1001 already exists/);
        });

    });

    describe('#readArtGallery', () => {

        it('should return a art gallery', async () => {
            await contract.readArtGallery(ctx, '1001').should.eventually.deep.equal({ value: 'art gallery 1001 value' });
        });

        it('should throw an error for a art gallery that does not exist', async () => {
            await contract.readArtGallery(ctx, '1003').should.be.rejectedWith(/The art gallery 1003 does not exist/);
        });

    });

    describe('#updateArtGallery', () => {

        it('should update a art gallery', async () => {
            await contract.updateArtGallery(ctx, '1001', 'art gallery 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"art gallery 1001 new value"}'));
        });

        it('should throw an error for a art gallery that does not exist', async () => {
            await contract.updateArtGallery(ctx, '1003', 'art gallery 1003 new value').should.be.rejectedWith(/The art gallery 1003 does not exist/);
        });

    });

    describe('#deleteArtGallery', () => {

        it('should delete a art gallery', async () => {
            await contract.deleteArtGallery(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a art gallery that does not exist', async () => {
            await contract.deleteArtGallery(ctx, '1003').should.be.rejectedWith(/The art gallery 1003 does not exist/);
        });

    });

});
