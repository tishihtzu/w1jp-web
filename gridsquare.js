// ©2025 Gatorbot LLC
// All rights reserved

// Gridssqare
//  llPos: {lat: <number>, lng: <number>}
function latlng2grid(llPos) {
	if (!Number.isFinite(llPos.lat) || !Number.isFinite(llPos.lng)) throw new Error(`Invalid llPos object of form {lat: ${llPos.lat}, lng: ${llPos.lng}}. Must be numbers.`);
	let mls = '';
	let X = Math.min(Math.max(llPos.lng + 180, 0), 359.999999); // clamp
	let Y = Math.min(Math.max(llPos.lat + 90, 0), 180); // clamp
	jlog(`X: ${X}, Y: ${Y}`);
	const fields = 'ABCDEFGHIJKLMNOPQR';
	const subSquares = 'abcdefghijklmnopqrstuvwx';
	// calc field
	mls += fields[Math.floor(X/20)];
	mls += fields[Math.floor(Y/10)];
	// square
	let x = 10 * (X/20 - Math.floor(X/20));
	let y = 10 * (Y/10 - Math.floor(Y/10));
	jlog(`x: ${x}, y: ${y}`);
	mls += Math.floor(x);
	mls += Math.floor(y);
	// subsquare
	let xx = x - Math.floor(x);
	let yy = y - Math.floor(y);
	jlog(`xx: ${xx}, yy: ${yy}`);

	mls += subSquares[Math.floor(xx*24)];
	mls += subSquares[Math.floor(yy*24)];
	// extended subsquare
	mls += Math.floor((xx*24 - Math.floor(xx*24)) * 10);
	mls += Math.floor((yy*24 - Math.floor(yy*24)) * 10);

	return mls;
}

// set _DEBUG = true for logging
let _DEBUG = false;
function jlog(m){
	if (_DEBUG) console.log(m);
}
