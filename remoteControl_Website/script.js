const d = document;

// Algumas hard coded playlists
const gothboiclique = [
    {
        "title": "Last Time I Went Thrift Shopping",
        "channel": "Horse Head - Topic",
        "image": "https://i.ytimg.com/vi/00LdK8vfkso/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBiFZTq5nHrrwWNGRrlq0DwG1F3og",
        "duration": "1:59",
        "videoUrl": "/watch?v=00LdK8vfkso&list=PL_i1T7-MAzy4mWxnTcFK3WbgFiyf8sedF&index=17&pp=gAQBiAQB8AUB"
    },
    {
        "title": "Divorce Court - Blindspot (feat. døves) (Official Video)",
        "channel": "Divorce Court",
        "image": "https://i.ytimg.com/vi/pCsl8FJqSIc/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBW4NR_3FnDriENmwo0upbk4ouQNg",
        "duration": "4:58",
        "videoUrl": "/watch?v=pCsl8FJqSIc&list=PL_i1T7-MAzy4mWxnTcFK3WbgFiyf8sedF&index=2&pp=gAQBiAQB8AUB"
    }
];

const redHotPlaylist = [
    {
        "title": "Red Hot Chili Peppers - Save This Lady - B-Side [HD]",
        "channel": "llllphaserllll",
        "image": "https://i.ytimg.com/vi/cL3UsX45PW4/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA4jvisyxuKlOUkEkwLIUCP6qFCKA",
        "duration": "4:17",
        "videoUrl": "/watch?v=cL3UsX45PW4&list=PL_i1T7-MAzy7A8o_7nNFkiZTMulnb2W3z&index=1&pp=gAQBiAQB8AUB"
    },
    {
        "title": "Save the Population",
        "channel": "Red Hot Chili Peppers",
        "image": "https://i.ytimg.com/vi/tSjw2LMtl9U/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA2BY5OdS3cD6MBQ9jro-SztyzJcg",
        "duration": "4:06",
        "videoUrl": "/watch?v=tSjw2LMtl9U&list=PL_i1T7-MAzy7A8o_7nNFkiZTMulnb2W3z&index=2&pp=gAQBiAQB8AUB"
    },
];

let suggestedVideos = [];

const getData = () => {
    fetch('https://myApiAddress/api/dataGet?tableName=videosList', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'a',
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then((data) => { suggestedVideos = data })
        .catch((error) => console.error('Fetch error:', error));
};
getData();

// Busca thumbnails usando serpApi, porém custa muitas chamadas de api.
/* const getThumbnail = async (title) => {
    const response = await fetch(`https://myApiAddress/api/getThumbnail?title=${title}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'a',
        }
    });
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    } 
} */

const postAction = (action) => {
    fetch('https://myApiAddress/api/actionPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'a',
        },
        body: JSON.stringify({
            action: action,
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then((data) => console.log('added action', action))
        .catch((error) => console.error('Fetch error:', error));
};

const showList = (data) => {
    let list = d.querySelector('.videosList');

    data.forEach((video) => {
        let div = d.createElement('div');
        div.className = 'info';
        list.appendChild(div);

        let infoElement = d.createElement('div');
        infoElement.className = 'video-info';
        infoElement.innerHTML = `<span class="title">${video.title}</span><br><span class="channel">${video.channel}</span><br><span class="duration"> ${video.duration}</span>`;

        div.appendChild(infoElement);

        let img = d.createElement('img');
        img.src = video.image || 'https://cdn.icon-icons.com/icons2/1099/PNG/512/1485482355-youtube_78661.png';
        /*  getThumbnail(video.title + ' ' + video.channel).then((data) => {
             img.src = data;
         }); */
        div.appendChild(img);

        div.addEventListener('click', () => {
            postAction(`Play ${video.videoUrl}`);
        });
    });

};

// handle menu buttons

// search button
const searchButton = d.querySelector('.search');
const searchInput = d.querySelector('.search_input');
const searchDiv = d.querySelector('.searchWrapper');

searchButton.addEventListener('click', () => {
    searchDiv.style.display = 'flex';
    searchInput.focus();
});

searchDiv.addEventListener('click', (e) => {
    if (e.target === searchDiv) searchDiv.style.display = 'none';
});

searchDiv.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        postAction(`Search ${searchInput.value}`);
        searchDiv.style.display = 'none';
    }
});

//reset button
const resetButton = d.querySelector('.reset');
resetButton.addEventListener('click', () => {
    postAction('Reset');
    getData();
});

//play pause button
const playButton = d.querySelector('.play_pause');
playButton.addEventListener('click', () => {
    postAction('PlayPause');
});

//volume buttons
const volumeSlider = d.querySelector('#volumeSlider');
volumeSlider.addEventListener('change', () => {
    postAction(`Volume ${volumeSlider.value}`);
});

const volume = d.querySelector('.volume');
volume.addEventListener('click', () => {
    volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
});

//change playlist button
const changePlaylistButton = d.querySelector('.change_list');
changePlaylistButton.addEventListener('click', () => {
    let playlists = d.querySelector('.playlists');
    playlists.style.display = playlists.style.display === 'none' ? 'block' : 'none';
});

const playlists = d.querySelector('.playlists');
playlists.addEventListener('click', (e) => {
    d.querySelector('.videosList').innerHTML = '';

    switch (e.target.innerHTML) {
        case 'Suggested Videos':
            showList(suggestedVideos);
            break;
        case 'Gothboiclique':
            showList(gothboiclique);
            break;
        case 'Red Hot Chili Peppers':
            showList(redHotPlaylist);
            break;
        default:
            break;
    }
    playlists.style.display = 'none';
});

