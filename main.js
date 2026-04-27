import { Vec2f } from './vec2f.js';
import { Beacon } from './beacon.js';

const z = {
	version: 1.4,
	tick: 0,
	ppms: 0.5,
	ttl: 5000,
	antColor: 'white',
	sigColor: 'orange',
	btnColor: '#333',
	lineWidth: 2,
	pings: [],
	frequency: 600,
	sound: false,
};

const resizeCanvas = () => {
	const box = z.can.getBoundingClientRect();
	z.can.width = box.width;
	z.can.height = box.height;
	z.ctx = z.can.getContext('2d');
	z.antPos = new Vec2f(z.can.width / 100 * 85, z.can.height / 3);
};

const drawAntenna = () => {
	const r = 25;
	z.ctx.save();
	z.ctx.fillStyle = z.antColor;
	z.ctx.strokeStyle = z.antColor;
	z.ctx.lineWidth = z.lineWidth;
	z.ctx.beginPath();
	z.ctx.moveTo(z.antPos.x, z.antPos.y);
	z.ctx.lineTo(z.antPos.x + r, z.can.height);
	z.ctx.stroke();
	z.ctx.beginPath();
	z.ctx.moveTo(z.antPos.x, z.antPos.y);
	z.ctx.lineTo(z.antPos.x - r, z.can.height);
	z.ctx.stroke();
	z.ctx.beginPath();
	z.ctx.arc(z.antPos.x, z.antPos.y, 5, 0, 2 * Math.PI);
	z.ctx.fill();

	const ah = z.can.height - z.antPos.y;
	const sh = ah / 3;
	const m = ah / r;

	z.ctx.beginPath();
	z.ctx.moveTo(z.antPos.x - r, z.can.height);
	z.ctx.lineTo(
		z.antPos.x + (z.can.height - sh - z.antPos.y) / m,
		z.can.height - sh,
	);
	z.ctx.stroke();
	z.ctx.moveTo(z.antPos.x + r, z.can.height);
	z.ctx.lineTo(
		z.antPos.x + (z.can.height - sh - z.antPos.y) / -m,
		z.can.height - sh,
	);
	z.ctx.stroke();

	z.ctx.beginPath();
	z.ctx.moveTo(
		z.antPos.x + (z.can.height - sh - z.antPos.y) / -m,
		z.can.height - sh,
	);
	z.ctx.lineTo(
		z.antPos.x + (z.can.height - 2 * sh - z.antPos.y) / m,
		z.can.height - 2 * sh,
	);
	z.ctx.stroke();
	z.ctx.beginPath();
	z.ctx.moveTo(
		z.antPos.x + (z.can.height - sh - z.antPos.y) / m,
		z.can.height - sh,
	);
	z.ctx.lineTo(
		z.antPos.x + (z.can.height - 2 * sh - z.antPos.y) / -m,
		z.can.height - 2 * sh,
	);
	z.ctx.stroke();

	z.ctx.beginPath();
	z.ctx.moveTo(
		z.antPos.x + (z.can.height - 2 * sh - z.antPos.y) / -m,
		z.can.height - 2 * sh,
	);
	z.ctx.lineTo(
		z.antPos.x + (z.can.height - 2.5 * sh - z.antPos.y) / m,
		z.can.height - 2.5 * sh,
	);
	z.ctx.stroke();
	z.ctx.beginPath();
	z.ctx.moveTo(
		z.antPos.x + (z.can.height - 2 * sh - z.antPos.y) / m,
		z.can.height - 2 * sh,
	);
	z.ctx.lineTo(
		z.antPos.x + (z.can.height - 2.5 * sh - z.antPos.y) / -m,
		z.can.height - 2.5 * sh,
	);
	z.ctx.stroke();
	z.ctx.restore();
};

const drawText = () => {
	z.ctx.save();
	z.ctx.font = '100px monospace';
	z.ctx.textAlign = 'left';
	z.ctx.textBaseline = 'middle';
	z.ctx.fillStyle = z.antColor;
	z.ctx.fillText('W1JP', 50, z.can.height / 2);
	z.ctx.font = '14pt monospace';
	z.ctx.textAlign = 'left';
	z.ctx.textBaseline = 'bottom';
	z.ctx.fillText(`©2017–2023 Jon Pellant, v${z.version}`, 60, z.can.height);
	z.ctx.restore();
};

const drawButtons = () => {
	const btnWidth = 30;
	const text = z.sound ? '🔈' : '🔇';
	const btn = new Vec2f(z.can.width - btnWidth - 5, z.can.height - btnWidth - 5);
	z.ctx.save();
	z.ctx.font = '14pt monospace';
	z.ctx.textAlign = 'center';
	z.ctx.textBaseline = 'middle';
	z.ctx.fillStyle = z.btnColor;
	z.ctx.fillRect(btn.x, btn.y, btnWidth, btnWidth);
	z.ctx.fillStyle = z.antColor;
	z.ctx.fillText(text, btn.x + btnWidth / 2, btn.y + btnWidth / 2);
	z.ctx.restore();
};

const updatePings = (timer) => {
	z.pings.forEach((ping, i) => {
		let elapsed = timer - ping.start;
		if (elapsed < 0) elapsed = 0;
		if (elapsed > z.ttl) {
			z.pings.splice(i, 1);
		} else {
			z.ctx.save();
			z.ctx.strokeStyle = z.sigColor;
			z.ctx.lineWidth = ping.type === 1 ? z.lineWidth : z.lineWidth * 3;
			z.ctx.beginPath();
			z.ctx.arc(z.antPos.x, z.antPos.y, z.ppms * elapsed, 0, 2 * Math.PI);
			z.ctx.stroke();
			z.ctx.restore();
		}
	});
};

const newPing = (type) => {
	z.pings.push({ type, start: performance.now() });
	if (z.ax && z.sound) {
		z.gain.gain.value = 1;
		window.setTimeout(() => {
			z.gain.gain.value = 0;
		}, type === 1 ? z.beacon.tickPeriod : 3 * z.beacon.tickPeriod);
	}
};

const eClick = () => {
	z.sound = !z.sound;
	if (z.sound) z.ax.resume();
	else z.ax.suspend();
};

function doAlert() {
	alert('WPM must be between 5 and 40 inclusively. Farnsworth speed must be greater or equal to WPM.');
}

function sendMessage() {
	const wpm = Number(document.getElementById('wpm').value);
	const farns = Number(document.getElementById('farns').value);
	const btn = document.getElementById('btnSend');
	const statusMessage = document.getElementById('sendStatus');

	btn.disabled = true;
	btn.innerText = 'Sending...';

	if (wpm < 5 || wpm > 40) doAlert();
	else if (farns < wpm) doAlert();
	else {
		z.beacon.setOptions({ wpm, farnsworth: farns });
		z.beacon.enQueue(`${document.getElementById('message').value.toUpperCase()}  `);
	}

	statusMessage.className = 'alert alert-success mt-2';
	statusMessage.innerText = 'Successfully enqueued.';
	btn.disabled = false;
	btn.innerText = 'Send';
	setTimeout(() => {
		statusMessage.classList.add('d-none');
	}, 5000);
}

const draw = (timer) => {
	z.ctx.clearRect(0, 0, z.can.width, z.can.height);
	drawText();
	drawAntenna();
	drawButtons();
	if (z.pings.length > 0) updatePings(timer);
	window.requestAnimationFrame(draw);
};

function init() {
	z.can = document.getElementById('can');
	z.beacon = new Beacon(newPing);
	resizeCanvas();

	const AudioFactory = window.AudioContext || window.webkitAudioContext;
	if (AudioFactory) {
		z.ax = new AudioFactory();
		z.ax.suspend();
		z.osc = z.ax.createOscillator();
		z.osc.type = 'sine';
		z.osc.frequency.value = z.frequency;
		z.gain = z.ax.createGain();
		z.gain.gain.value = 0;
		z.osc.connect(z.gain);
		z.gain.connect(z.ax.destination);
		z.osc.start();
		z.can.onclick = eClick;
	}
	window.addEventListener('resize', resizeCanvas);
	document.getElementById('btnSend').addEventListener('click', sendMessage);
	z.beacon.play();
	window.requestAnimationFrame(draw);
}

window.addEventListener('DOMContentLoaded', init);
