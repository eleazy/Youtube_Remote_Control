const d = document;

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
        .then((data) => {
            suggestedVideos = data
            grabSuggestedVideos();
        })
        .catch((error) => console.error('Fetch error:', error));
};
getData();// Os registros na tabela são compararados com os vídeos sugeridos na página para evitar duplicatas.

const addList = (list) => {
    list.forEach(item => {
        fetch(`https://myApiAddress/api/videosListPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'a',
            },
            body: JSON.stringify({
                title: item[0],
                channel: item[1],
                image: item[2],
                duration: item[3],
                videoUrl: item[4],
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => { })
            .catch(error => console.error('Fetch error:', error));
    });
};

const deleteList = () => {
    fetch('https://myApiAddress/api/dataDelete?tableName=videosList', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'a',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { })
        .catch(error => console.error('Fetch error:', error));
};

const checkForAction = () => {
    fetch('https://myApiAddress/api/dataGet?tableName=actionList', {
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
        .then((data) => handleAction(data[0].action))
        .catch((error) => console.error('Fetch error:', error));
};

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
        .then((data) => { })
        .catch((error) => console.error('Fetch error:', error));
};

const handleAction = (action) => {
    const actionTrigger = action.split(' ')[0] || action;
    switch (actionTrigger) {
        case 'Play':
            window.location.href = `https://www.youtube.com${action.slice(5)}`;
            !window.location.href.includes('index') && getData(); // Se estiver numa playlist (url possui "index"), não pega os vídeos sugeridos.
            break;
        case 'Search':
            window.location.href = `https://www.youtube.com/results?search_query=${action.slice(7)}`;
            getData();
            break;
        case 'PlayPause':
            const playPause = d.querySelector('button[aria-keyshortcuts="k"]');
            if (playPause) playPause.click();
            break;
        case 'Volume':
            let vid = d.querySelector('.video-stream');
            vid.volume = Number(action.split(' ')[1]) / 100;
            break;
        case 'Reset':
            deleteList();
            getData();
            break;
    }

    if (action !== 'none') postAction('none');
};

const fullVideo = () => {
    const player = d.querySelector("#player-container[role='complementary']");
    player.style.width = "100vw";
    player.style.height = "100vh";
    player.style.zIndex = "9999";

    const video = d.querySelector("video");
    video.style.width = "1920px";
    video.style.height = "1080px";

    d.body.style.overflow = 'hidden';
    let ytdPlayer = d.querySelector("#ytd-player");
    ytdPlayer.style.backgroundColor = "black";

    ytdPlayer.scrollIntoView({ behavior: 'smooth' });
};

const grabSuggestedVideos = () => {
    let videoListQuery = 'ytd-compact-video-renderer';
    let channelQuery = '#channel-name';

    if (window.location.href.includes('index')) { // Coleta os elementos conforme a página que está sendo acessada.
        videoListQuery = "ytd-playlist-panel-video-renderer";
        channelQuery = 'span[id="byline"]';
    } else if (!window.location.href.includes('watch')) {
        videoListQuery = 'ytd-video-renderer';
        channelQuery = '#text a';
    }

    let videoList = d.querySelectorAll(videoListQuery);

    let videoArray = [];
    videoList.forEach((video) => {
        if (video.querySelector('#time-status span#text') === null) return;
        if (suggestedVideos.some(v => v.videoUrl === video.querySelector('a#thumbnail').getAttribute('href'))) {
            return
        };

        let title = video.querySelector('#video-title').innerText;
        let channel = video.querySelector(channelQuery).innerText;
        let image = video.querySelector('img').getAttribute('src');
        let duration = video.querySelector('#time-status span#text').innerText;
        let videoUrl = video.querySelector('a#thumbnail').getAttribute('href');

        videoArray.push([title, channel, image, duration.replaceAll(/\n\s*/g, ''), videoUrl]);

    });
    addList(videoArray);
    //console.log('rewrote list');
};

setInterval(() => { checkForAction(); }, 4000);

if (!window.location.href.includes('index') && window.location.href.includes('watch')) setTimeout(() => getData(), 3000); // Se estiver numa playlist (url possui "index"), ou na página inicial, não pega os vídeos sugeridos.

const observerOptions = { childList: true, subtree: true, };
const controlsObserver = new MutationObserver(() => {
    fullVideo();
    controlsObserver.disconnect();
});
const controls = d.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls");
controlsObserver.observe(controls, observerOptions);