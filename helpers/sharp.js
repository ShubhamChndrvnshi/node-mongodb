const sharp = require("sharp");
const fs = require("fs").promises;
// const logger = require("../helpers/logger");

/**
 * Compress image.
 * 
 * @param {String}      imagePath
 * @param {Number}      width
 * 
 * @returns {null}
 */
exports.compress = (imagePath, width) =>{
	sharp(imagePath)
	// .resize({   width: 1110, height: 350, fit: 'outside' })
		.resize({ width: width || 1200, fit: "outside" })
		.withMetadata() 
		.toBuffer()
		.then(thumbnail => {       
			return fs.writeFile(imagePath, thumbnail);
		});
};
