#! /usr/bin/env node

const fs = require('fs');
const lwip = require('lwip');

// used while target is a folder
const acceptExtenstion = [ 'jpg', 'png' ];

const usr = {
	type: 'folder',
	target: process.argv[2],
	width: parseInt(process.argv[3]),
	height: parseInt(process.argv[4] || process.argv[3]),
};

// handle target type (folder / file)
if( fs.statSync(usr.target).isDirectory() ) {
	if( usr.target.substr(-1) === '/' ) {
		usr.target = usr.target.substr(0, usr.target.length - 1);
	}
}
else {
	usr.type = 'file';
}

// resize single image
const resizeImg = (path) => {

	lwip.open( path, (err, img) => {

		img.batch()
			.resize(usr.width, usr.height)
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
