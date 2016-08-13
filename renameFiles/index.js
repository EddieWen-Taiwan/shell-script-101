#! /usr/bin/env node

const fs = require('fs');

if( process.argv[2] === undefined || process.argv[3] === undefined || process.argv[4] === undefined
	|| process.argv[2] === '-h' || process.argv[2] === '--help' ) {
	return console.log('Usage: node renameFiles.js <folder-path> <prev-ext> <next-ext>\n');
}
else {

	let scanFolder = process.argv[2];
	if( scanFolder.substr(-1) === '/' ) {
		scanFolder = scanFolder.substr(0, scanFolder.length-1);
	}

	const prevExtReg = new RegExp( `${process.argv[3]}$` );

	const renameFiles = (path) => {

		console.log(`Scan folder: ${path}`);
		const filesArr = fs.readdirSync(path);

		Array.prototype.forEach.call( filesArr, (file) => {

			const filename = `${path}/${file}`;

			if( fs.statSync(filename).isDirectory() ) {

				// Scan this folder
				renameFiles(filename);

			}
			else {

				// It is a file, check file extension
				if( prevExtReg.test(file) ) {

					const newFileName = file.replace( prevExtReg, process.argv[4] );
					fs.renameSync( filename, `${path}/${newFileName}` );

				}

			}

		});

	};

	// Service Go!
	renameFiles(scanFolder);

}
