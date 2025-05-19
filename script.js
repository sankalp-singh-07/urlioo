'use strict';

// Elements
const Form = document.querySelector('.form');
const Input = document.querySelector('.input');
const submitBtn = document.querySelector('.shortURL');

Form.addEventListener('submit', (e) => {
	e.preventDefault();
	const link = Input.value;
	if (checkUrl(link)) {
		getLink(link);
		alert('success');
	} else console.log(false);
});

const dataArr = {
	url: '',
	old: '',
	views: '',
};

const getLink = async (link) => {
	const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer 2e467fcac664f108511ac60172ca86d99d589f83',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			long_url: link,
		}),
	});
	const data = await res.json();
	console.log(data);
};

const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-./?%&=]*)?$/i;

const checkUrl = (url) => {
	return urlPattern.test(url);
};
