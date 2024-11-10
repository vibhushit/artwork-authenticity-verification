/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { PaintingContract } = require('..');
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

describe('PaintingContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new PaintingContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"painting 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"painting 1002 value"}'));
    });

    describe('#paintingExists', () => {

        it('should return true for a painting', async () => {
            await contract.paintingExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a painting that does not exist', async () => {
            await contract.paintingExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createPainting', () => {

        it('should create a painting', async () => {
            await contract.createPainting(ctx, '1003', 'painting 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"painting 1003 value"}'));
        });

        it('should throw an error for a painting that already exists', async () => {
            await contract.createPainting(ctx, '1001', 'myvalue').should.be.rejectedWith(/The painting 1001 already exists/);
        });

    });

    describe('#readPainting', () => {

        it('should return a painting', async () => {
            await contract.readPainting(ctx, '1001').should.eventually.deep.equal({ value: 'painting 1001 value' });
        });

        it('should throw an error for a painting that does not exist', async () => {
            await contract.readPainting(ctx, '1003').should.be.rejectedWith(/The painting 1003 does not exist/);
        });

    });

    describe('#updatePainting', () => {

        it('should update a painting', async () => {
            await contract.updatePainting(ctx, '1001', 'painting 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"painting 1001 new value"}'));
        });

        it('should throw an error for a painting that does not exist', async () => {
            await contract.updatePainting(ctx, '1003', 'painting 1003 new value').should.be.rejectedWith(/The painting 1003 does not exist/);
        });

    });

    describe('#deletePainting', () => {

        it('should delete a painting', async () => {
            await contract.deletePainting(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a painting that does not exist', async () => {
            await contract.deletePainting(ctx, '1003').should.be.rejectedWith(/The painting 1003 does not exist/);
        });

    });

});
