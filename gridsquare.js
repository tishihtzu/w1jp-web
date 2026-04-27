// ©2025 Gatorbot LLC
// All rights reserved

export function latlng2grid(llPos) {
	if (!Number.isFinite(llPos.lat) || !Number.isFinite(llPos.lng)) {
		throw new Error(`Invalid llPos object of form {lat: ${llPos.lat}, lng: ${llPos.lng}}. Must be numbers.`);
	}

	let mls = '';
	const xCoord = Math.min(Math.max(llPos.lng + 180, 0), 359.999999);
	const yCoord = Math.min(Math.max(llPos.lat + 90, 0), 180);
	jlog(`X: ${xCoord}, Y: ${yCoord}`);

	const fields = 'ABCDEFGHIJKLMNOPQR';
	const subSquares = 'abcdefghijklmnopqrstuvwx';

	mls += fields[Math.floor(xCoord / 20)];
	mls += fields[Math.floor(yCoord / 10)];

	const x = 10 * (xCoord / 20 - Math.floor(xCoord / 20));
	const y = 10 * (yCoord / 10 - Math.floor(yCoord / 10));
	jlog(`x: ${x}, y: ${y}`);
	mls += Math.floor(x);
	mls += Math.floor(y);

	const xx = x - Math.floor(x);
	const yy = y - Math.floor(y);
	jlog(`xx: ${xx}, yy: ${yy}`);

	mls += subSquares[Math.floor(xx * 24)];
	mls += subSquares[Math.floor(yy * 24)];
	mls += Math.floor((xx * 24 - Math.floor(xx * 24)) * 10);
	mls += Math.floor((yy * 24 - Math.floor(yy * 24)) * 10);

	return mls;
}

const DEBUG = false;

function jlog(message) {
	if (DEBUG) console.log(message);
}

function loc2pos(loc) {
	return { coords: { latitude: loc.lat, longitude: loc.lng } };
}

function pos2loc(pos) {
	return { lat: pos.coords.latitude, lng: pos.coords.longitude };
}

function initGridsquare() {
	const form = document.getElementById('gs_latlng');
	const gsLat = document.getElementById('gs_lat');
	const gsLng = document.getElementById('gs_lng');
	const gsMls = document.getElementById('mls');
	const button = document.getElementById('locate');
	const home = { lat: 26.972727201250866, lng: -82.37389332860616 };
	const defaultZoom = 13;
	const leaflet = window.L;

	const map = leaflet.map('map').setView([home.lat, home.lng], defaultZoom);
	const locMarker = leaflet.marker(home, { draggable: true, autoPan: true });
	locMarker.addTo(map);

	leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	function getMls() {
		const lat = parseFloat(gsLat.value);
		const lng = parseFloat(gsLng.value);
		let text;

		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			text = 'Waiting for valid input...';
		} else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
			text = 'Out of range (lat -90..90, lng -180..180)';
		} else {
			try {
				const grid = latlng2grid({ lat, lng });
				text = grid || 'Could not compute grid.';
			} catch (err) {
				text = `Error computing grid. pos: {lat: ${lat}, lng: ${lng}}`;
				console.error(err);
			}
		}

		gsMls.textContent = text;
	}

	function updateMarker(loc) {
		locMarker.setLatLng(loc);
	}

	function updateMap(loc) {
		map.setView(loc, map.getZoom());
		updateMarker(loc);
	}

	function updateEverything(loc) {
		gsLat.value = loc.lat;
		gsLng.value = loc.lng;
		getMls();
		updateMap(loc);
	}

	function locateSuccess(pos) {
		updateEverything(pos2loc(pos));
	}

	function locateFailure() {
		gsMls.textContent = 'Error retrieving location.';
	}

	form.addEventListener('input', getMls);

	button.addEventListener('click', () => {
		navigator.geolocation.getCurrentPosition(locateSuccess, locateFailure, {
			enableHighAccuracy: true,
			timeout: 10000,
		});
	});

	locMarker.on('dragend', (event) => {
		updateEverything(event.target.getLatLng());
	});

	map.on('click', (event) => {
		updateEverything(event.latlng);
	});

	updateEverything(pos2loc(loc2pos(home)));
}

window.addEventListener('DOMContentLoaded', initGridsquare);
