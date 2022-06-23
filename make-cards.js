
// tutorial video used: https://www.youtube.com/watch?v=kybCYJ2loTc
window.onload = () => {
	try {
		var url_str = (window.location.href).toLowerCase();
		var url = new URL(url_str);
		var tags = url.searchParams.get("tags");
		setupCards(tags.split(' '));
	} catch (err) {
		console.log("Invalid parameters - " + err);
	}
}

async function setupCards(tags) {
	console.log(tags);
	const users = await fetch('assets/data/users.json');
	console.log(users);
}

