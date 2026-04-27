function earthRadiusAtLatitude(latDeg, a = 6378137.0, b = 6356752.314245) {
	const phi = latDeg * Math.PI / 180;
	const cos = Math.cos(phi);
	const sin = Math.sin(phi);

	const numerator = (a * a * cos) ** 2 + (b * b * sin) ** 2;
	const denominator = (a * cos) ** 2 + (b * sin) ** 2;

	return Math.sqrt(numerator / denominator);
}

const FT_PER_M = 3.280839895;
const M_PER_KM = 1000;
const M_PER_MI = 1609.344;

function formatValue(value, decimals = 3) {
	if (!Number.isFinite(value)) return '';
	return value.toFixed(decimals);
}

function calculateHorizonArc(radius, height) {
	return radius * Math.acos(radius / (radius + height));
}

function initHorizon() {
	const unitSelect = document.getElementById('unitSelect');
	const latitudeInput = document.getElementById('latitude');
	const txHeightInput = document.getElementById('txHeight');
	const rxHeightInput = document.getElementById('rxHeight');

	const earthRadiusOutput = document.getElementById('earthRadius');
	const txHorizonOutput = document.getElementById('txHorizon');
	const rxHorizonOutput = document.getElementById('rxHorizon');
	const totalDistanceOutput = document.getElementById('totalDistance');

	const radiusUnit = document.getElementById('radiusUnit');
	const distanceUnits = [
		document.getElementById('distanceUnit1'),
		document.getElementById('distanceUnit2'),
		document.getElementById('distanceUnit3'),
	];

	function updateUnitLabels() {
		const unit = unitSelect.value;

		document.querySelectorAll('.unit-label').forEach((el) => {
			el.textContent = unit;
		});

		radiusUnit.textContent = unit;
		distanceUnits.forEach((el) => {
			el.textContent = 'mi / km';
		});
	}

	function clearResults() {
		earthRadiusOutput.value = '';
		txHorizonOutput.value = '';
		rxHorizonOutput.value = '';
		totalDistanceOutput.value = '';
	}

	function formatDistancePair(distanceMeters) {
		const miles = distanceMeters / M_PER_MI;
		const kilometers = distanceMeters / M_PER_KM;
		return `${formatValue(miles, 3)} / ${formatValue(kilometers, 3)}`;
	}

	function calculate() {
		const unit = unitSelect.value;
		const lat = parseFloat(latitudeInput.value);
		const txHeightRaw = parseFloat(txHeightInput.value);
		const rxHeightRaw = parseFloat(rxHeightInput.value);

		if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
			clearResults();
			return;
		}

		const radiusAtLatitude = unit === 'ft'
			? earthRadiusAtLatitude(lat) * FT_PER_M
			: earthRadiusAtLatitude(lat);

		earthRadiusOutput.value = formatValue(radiusAtLatitude, 2);

		if (
			!Number.isFinite(txHeightRaw) || txHeightRaw < 0 ||
			!Number.isFinite(rxHeightRaw) || rxHeightRaw < 0
		) {
			txHorizonOutput.value = '';
			rxHorizonOutput.value = '';
			totalDistanceOutput.value = '';
			return;
		}

		const radiusMeters = earthRadiusAtLatitude(lat);
		const txHeightMeters = unit === 'ft' ? txHeightRaw / FT_PER_M : txHeightRaw;
		const rxHeightMeters = unit === 'ft' ? rxHeightRaw / FT_PER_M : rxHeightRaw;

		const transmitterHorizonMeters = calculateHorizonArc(radiusMeters, txHeightMeters);
		const receiverHorizonMeters = calculateHorizonArc(radiusMeters, rxHeightMeters);
		const totalDistanceMeters = transmitterHorizonMeters + receiverHorizonMeters;

		txHorizonOutput.value = formatDistancePair(transmitterHorizonMeters);
		rxHorizonOutput.value = formatDistancePair(receiverHorizonMeters);
		totalDistanceOutput.value = formatDistancePair(totalDistanceMeters);
	}

	[unitSelect, latitudeInput, txHeightInput, rxHeightInput].forEach((el) => {
		el.addEventListener('input', () => {
			updateUnitLabels();
			calculate();
		});
		el.addEventListener('change', () => {
			updateUnitLabels();
			calculate();
		});
	});

	updateUnitLabels();
	calculate();
}

window.addEventListener('DOMContentLoaded', initHorizon);
