var Jimp = require("jimp");
const logger = require("../helpers/logger");


exports.compress = (absolutePath, quality, width, height) => {
	width && !height ? height= Jimp.AUTO: {};
	!width && height ? height= Jimp.AUTO: {};
	Jimp.read(absolutePath)
		.then(lenna => {
			return lenna
				.resize( width || 2500, height || Jimp.AUTO ) 
				.quality(quality || 100) 
				.write(absolutePath); 
		})
		.catch(err => {
			logger.error(err);
		});
};