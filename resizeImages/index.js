#! /usr/bin/env node

const fs = require('fs');
const Jimp = require('jimp');

/**
 * used when target is a folder
 */
const acceptedFileExtenstion = ['jpg', 'png'];

const userInput = {
	type: 'folder',
	target: process.argv[2],
	width: /^\d+$/.test(process.argv[3]) && parseInt(process.argv[3]),
	height: /^\d+$/.test(process.argv[4]) && parseInt(process.argv[4]),
};

if( !userInput.width && !userInput.height ) {
	console.log('Please enter a new size.');
	return;
}

/**
 * handle target type (folder / file)
 */
if( fs.statSync(userInput.target).isDirectory() ) {
	/**
	 * remove the final slack in the path
	 */
	if( userInput.target.substr(-1) === '/' ) {
		userInput.target = userInput.target.substr(0, userInput.target.length - 1);
	}
}
else {
	userInput.type = 'file';
}

/**
 * resize single image
 */
const resizeImg = (path) => {

	Jimp.read(path)
		.then((image) => {

			image
				.resize(
					userInput.width || Jimp.AUTO,
					userInput.height || Jimp.AUTO
				)
				.write(path);

		})
		.catch((err) => console.log(err));

};

/**
 * there is only one file
 */
if( userInput.type === 'file' ) {

	resizeImg(userInput.target);

	return;

}

acceptedFileExtenstion.forEach((type) => {

	const regex = new RegExp(`\.${type}$`);

	fs.readdirSync(userInput.target)
		.filter((filename) => regex.test(filename))
		.forEach((filename) => resizeImg(`./${userInput.target}/${filename}`));

});
