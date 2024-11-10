/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { ExpertContract } = require('..');
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

describe('ExpertContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new ExpertContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"expert 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"expert 1002 value"}'));
    });

    describe('#expertExists', () => {

        it('should return true for a expert', async () => {
            await contract.expertExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a expert that does not exist', async () => {
            await contract.expertExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createExpert', () => {

        it('should create a expert', async () => {
            await contract.createExpert(ctx, '1003', 'expert 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"expert 1003 value"}'));
        });

        it('should throw an error for a expert that already exists', async () => {
            await contract.createExpert(ctx, '1001', 'myvalue').should.be.rejectedWith(/The expert 1001 already exists/);
        });

    });

    describe('#readExpert', () => {

        it('should return a expert', async () => {
            await contract.readExpert(ctx, '1001').should.eventually.deep.equal({ value: 'expert 1001 value' });
        });

        it('should throw an error for a expert that does not exist', async () => {
            await contract.readExpert(ctx, '1003').should.be.rejectedWith(/The expert 1003 does not exist/);
        });

    });

    describe('#updateExpert', () => {

        it('should update a expert', async () => {
            await contract.updateExpert(ctx, '1001', 'expert 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"expert 1001 new value"}'));
        });

        it('should throw an error for a expert that does not exist', async () => {
            await contract.updateExpert(ctx, '1003', 'expert 1003 new value').should.be.rejectedWith(/The expert 1003 does not exist/);
        });

    });

    describe('#deleteExpert', () => {

        it('should delete a expert', async () => {
            await contract.deleteExpert(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a expert that does not exist', async () => {
            await contract.deleteExpert(ctx, '1003').should.be.rejectedWith(/The expert 1003 does not exist/);
        });

    });

});
