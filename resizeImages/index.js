#! /usr/bin/env node

const fs = require('fs');
const lwip = require('lwip');

/**
 * used when target is a folder
 */
const acceptedFileExtenstion = ['jpg', 'png'];

const userInput = {
	type: 'folder',
	target: process.argv[2],
	width: /^\d+$/.test(process.argv[3]) ? parseInt(process.argv[3]) : 'auto',
	height: /^\d+$/.test(process.argv[4]) ? parseInt(process.argv[4]) : 'auto',
};

if( userInput.width === 'auto' && userInput.height === 'auto' ) {
	return 'Please enter size.';
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

	lwip.open(path, (err, img) => {

		let nextWidth = userInput.width;
		let nextHeight = userInput.height;

		if( nextWidth === 'auto') {

			nextWidth = nextHeight * img.width() / img.height();

		} else if ( nextHeight === 'auto' ) {

			nextHeight = nextWidth * img.height() / img.width();

		}

		img.batch()
			.resize(nextWidth, nextHeight)
			.writeFile(path, (err) => {
				if( err ) {
					return console.log(err);
				}

				console.log(`${path} file is resizd`);
			});

	});

};

/**
 * there is only one file
 */
if( userInput.type === 'file' ) {

	resizeImg(userInput.target);

	return;

}

acceptedFileExtenstion.map((type) => {

	const regex = new RegExp(`\.${type}$`);

	fs.readdirSync(userInput.target)
		.filter((file) => regex.test(file))
		.map((file) => resizeImg(`./${userInput.target}/${file}`));

});
