#! /usr/bin/env node

const fs = require('fs');
const lwip = require('lwip');

/**
 * used when target is a folder
 */
const acceptExtenstion = [ 'jpg', 'png' ];

const usr = {
	type: 'folder',
	target: process.argv[2],
	width: /^\d+$/.test(process.argv[3]) ? parseInt(process.argv[3]) : 'auto',
	height: /^\d+$/.test(process.argv[4]) ? parseInt(process.argv[4]) : 'auto',
};

if( usr.width === 'auto' && usr.height === 'auto' ) {
	return 'Please enter size.';
}

/**
 * handle target type (folder / file)
 */
if( fs.statSync(usr.target).isDirectory() ) {
	/**
	 * clear path
	 */
	if( usr.target.substr(-1) === '/' ) {
		usr.target = usr.target.substr(0, usr.target.length - 1);
	}
}
else {
	usr.type = 'file';
}

/**
 * resize single image
 */
const resizeImg = (path) => {

	lwip.open( path, (err, img) => {

		let nextWidth = usr.width;
		let nextHeight = usr.height;

		if( nextWidth === 'auto') {

			nextWidth = nextHeight * img.width() / img.height();

		} else if ( nextHeight === 'auto' ) {

			nextHeight = nextWidth * img.height() / img.width();

		}

		img.batch()
			.resize(nextWidth, nextHeight)
			.writeFile( path, (err) => {
				if(err) {
					return console.log(err);
				}

				console.log(`${path} file is resizd`);
			});

	});

};

if( usr.type === 'folder' ) {

	acceptExtenstion.map( (type) => {

		const regex = new RegExp( `\.${type}$` );
		fs.readdirSync( usr.target )
			.filter( (file) => regex.test(file) )
			.map( (file) => resizeImg(`./${usr.target}/${file}`) );

	});

}
else {
	resizeImg(usr.target);
}
