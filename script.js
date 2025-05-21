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

const curr = {
	old: '',
	new: '',
	time: new Date().getTime(),
};

let arr = JSON.parse(localStorage.getItem('shortLinks')) ?? [];

Form.addEventListener('submit', (e) => {
	e.preventDefault();
	const link = Input.value;
	curr.old = link;
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

const checkhttps = (link) => link.startsWith('http');

const getLink = async (linkLong) => {
	const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ac97dfccc2169fececa29173535c199e6584aed1',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			long_url: linkLong,
		}),
	});
	if (!res.ok) throw new Error('Bitly Error');
	const data = await res.json();
	const { link, created_at } = data;
	curr.new = link;
	linkShort = link;

	//> showing loading
	submitBtn.textContent = 'Generating...';
	qrsec.classList.add('hid');
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
	arrUpdate({ ...curr });
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

//> Previous links
function arrUpdate(curr) {
	arr.push(curr);

	console.log(arr);

	localStorage.setItem('shortLinks', JSON.stringify(arr));

	const trimmed = arr.slice(0, 3);
	console.log(trimmed);
}

//> Previous Links shown
const wrapper = document.querySelector('.links-wrapper');
const existing = JSON.parse(localStorage.getItem('shortLinks')) || [];
existing.forEach((ele) => {
	const prev = document.createElement('div');
	prev.classList.add('link-item');
	prev.innerHTML = `
		<p class="original-link">${ele.old}</p>
		<div class="link-details">
			<span class="short-link">${ele.new}</span>
			<div class="copyPart">
				<button class="copy-btn" data-copy="original">Copy Original</button>
				<button class="copy-btn" data-copy="short">Copy Short</button>
				<span class="delete">X</span>
			</div>
		</div>
	`;

	wrapper.appendChild(prev);
});

wrapper.addEventListener('click', (e) => {
	if (e.target.classList.contains('copy-btn')) {
		const btn = e.target;
		const dataset = btn.dataset.copy;
		const linkItem = btn.closest('.link-item');
		const text =
			dataset === 'original'
				? linkItem.querySelector('.original-link').textContent
				: linkItem.querySelector('.short-link').textContent;

		navigator.clipboard
			.writeText(text)
			.then(() => {
				btn.textContent = 'Copied';
				setTimeout(() => {
					btn.textContent =
						dataset === 'original' ? 'Copy Original' : 'Copy Short';
				}, 2000);
			})
			.catch((err) => {
				alert('Copy failed: ' + err);
			});
	}
});

wrapper.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete')) {
		const btn = e.target;
		const linkItem = btn.closest('.link-item');
		const shortLink = linkItem.querySelector('.short-link').textContent;
		// console.log(shortLink);
		linkItem.remove();

		const newArr = arr.filter((item) => item.new != shortLink);
		localStorage.setItem('shortLinks', JSON.stringify(newArr));
	}
});

//> Field focus
const inputField = document.getElementById('inputField');
document.querySelector('.footerBTN').addEventListener('click', () => {
	inputField.focus();
	document.querySelector('.navbar').scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	});
});

document.querySelector('.links').addEventListener('click', () => {
	document.querySelector('.prev-links-section').scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	});
});
