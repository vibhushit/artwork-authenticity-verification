/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const ArtGalleryContract = require('./lib/art-gallery-contract');
const PaintingContract = require('./lib/painting-contract');
const ExpertContract = require('./lib/expert-contract');

module.exports.ArtGalleryContract = ArtGalleryContract;
module.exports.PaintingContract = PaintingContract;
module.exports.ExpertContract = ExpertContract;
module.exports.contracts = [ ArtGalleryContract, PaintingContract, ExpertContract ];
