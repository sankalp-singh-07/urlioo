'use strict';

// Elements
const Form = document.querySelector('.form');
const Input = document.querySelector('.input');
const submitBtn = document.querySelector('.shortURL');
const qrImg = document.getElementById('imgqr');
const qrsec = document.querySelector('.qrSec');
const urlShort = document.querySelector('.urlshort');
const copyBtnQr = document.querySelector('.copyurl');
const loadingUrl = document.querySelector('.loadingUrl');

let linkShort = '';

Form.addEventListener('submit', (e) => {
	e.preventDefault();
	const link = Input.value;
	try {
		if (checkUrl(link)) {
			if (checkhttps(link)) {
				getLink(link);
			} else {
				const s = 'http://' + link;
				getLink(s);
			}
		} else return false;
	} catch (error) {
		console.log(error);
	}
});

const dataArr = {
	url: '',
	old: '',
	views: '',
};

const checkhttps = (link) => link.startsWith('http');

const getLink = async (linkLong) => {
	const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer 2e467fcac664f108511ac60172ca86d99d589f83',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			long_url: linkLong,
		}),
	});
	if (!res.ok) throw new Error('Bitly Error');
	const data = await res.json();
	const { link, created_at } = data;
	linkShort = link;

	//> showing loading
	submitBtn.textContent = 'Generating...';
	loadingUrl.classList.remove('hid');
	setTimeout(() => {
		loadingUrl.classList.add('hid');
		qrsec.classList.remove('hid');
		submitBtn.textContent = 'Generate Link';
	}, 3000);

	//>generate qr
	const qrCode = generateQRCode(link);
	qrImg.src = qrCode;

	urlShort.textContent = link;
};

urlShort.addEventListener('click', () => {
	window.open(linkShort, '_blank');
});

copyBtnQr.addEventListener('click', () => {
	navigator.clipboard
		.writeText(linkShort)
		.then(() => {
			copyBtnQr.textContent = 'Copied';
			setTimeout(() => {
				copyBtnQr.textContent = 'Copy Link';
			}, 3000);
		})
		.catch((error) => alert(error));
});

const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-./?%&=]*)?$/i;

const checkUrl = (url) => {
	return urlPattern.test(url);
};

const generateQRCode = (link) => {
	return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
		link
	)}&size=200x200`;
};
