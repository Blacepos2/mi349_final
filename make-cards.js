const TAG_ITEM = tag => `<li class="tag">${tag}</li>`;

const CARD_ITEM = (user, i) => {
	const userTags = user.tags.map(TAG_ITEM).reduce((acc, v) => acc + v, "");

	return `<li class="card">
				<img class="profile-picture" src="${user.image}" alt="${user.name} Profile Image">
				<h3 class="profile-name">${user.name}</h3>
				<div class="profile-extra">
					<h4>Listen to ${user.name}</h4>
					<button class="play-button" id="${user.id}-sample"><img src="assets/images/play.png" alt="Play Button" id="${user.id}-playbutton"></button>
					<h4>Tags</h4>
					<ul class="tag-list">
						${userTags}
					</ul>
				</div>
				<audio id="${user.id}-audio" src="${user.preview}">
					Your browser does not support the <code>audio</code> element.
				</audio>
			</li>`;
}

// tutorial video used for query strings: https://www.youtube.com/watch?v=kybCYJ2loTc
window.onload = () => {
	var tags = [];

	try {
		var url_str = (window.location.href).toLowerCase();
		var url = new URL(url_str);
		tags = url.searchParams.get("tags").split(' ');
		
		tags = tags.filter(tag => tag != '');

		if (tags[0] != '') {
			setupFilters(tags);
		} else {
			tags = [];
		}

	} catch (err) {
		tags = [];
	}

	setupCards(tags);
}

function setupFilters(tags) {
	const filterList = document.getElementById("current-tags");
	const inputBox = document.getElementById("tag-bar");

	const filterItems = tags.map(TAG_ITEM).reduce((acc, v) => acc + v, "");

	const joinedTags = tags.reduce((acc, v) => acc + ' ' + v, "");
	
	filterList.innerHTML = filterItems;
	inputBox.setAttribute("value", joinedTags);
}

async function setupCards(tags) {
	const response = await fetch('assets/data/users.json');
	const allUsers = await response.json();
	
	const users = tags.length > 0
		? allUsers.filter(user => tags.every(filtertag => user.tags.includes(filtertag))
								  || tags.includes(user.id))
		: allUsers;

	const userCards = users.map(CARD_ITEM).reduce((acc, v) => acc + v, "");

	const cardList = document.getElementById("user-cards");
	cardList.innerHTML = userCards;

	users.forEach(user => {
		const button = document.getElementById(`${user.id}-sample`);
		const sound = document.getElementById(`${user.id}-audio`);
		const playbutton = document.getElementById(`${user.id}-playbutton`);

		button.addEventListener('click', () => {
			if (sound.currentTime > 0.1) {
				sound.pause();
			} else {
				sound.play();
			}
		});

		sound.addEventListener('pause', () => {
			sound.currentTime = 0;
			playbutton.src = "assets/images/play.png";
		});

		sound.addEventListener('play', () => {
			playbutton.src = "assets/images/pause.png";
		});
	});
}