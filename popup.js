const urlApi = 'https://video-commerce-app-one.vercel.app/api'

class EatablesVideoCommerce extends HTMLElement {
    constructor() {
        super();
    }
}

function setCookie(name, value, days = 365 * 5) { // Padrão: 5 anos
    const maxAge = days * 24 * 60 * 60; // Converte dias para segundos
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Strict; Secure`;
}

function getCookie(nome) {
    let cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        let partes = cookies[i].split('=');
        if (partes[0] === nome) {
            return { nome: partes[0], valor: partes[1] };
        }
    }
    return null;
}

// Adicione estas funções de utilidade para controlar o loading
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Função imediata para buscar os dados
async function fetchInitialData(sessionId) {
    try {
        showLoading();
        const response = await fetch(`${urlApi}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Pathname': window.location.pathname,
                'X-Session-Id': sessionId || '' // Garante que não seja undefined
            },
            body: JSON.stringify({
                shop: 'loja-de-teste-eatables.myshopify.com',
                pageUrl: '/'
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Pegar o session ID do header da resposta
        const newSessionId = response.headers.get("x-session-id");
        if (newSessionId) {
            setCookie("_eatables_session_id", newSessionId);
        }

        const data = await response.json();
        console.log('Dados brutos da API:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return null;
    } finally {
        hideLoading();
    }
}

// Fetch para enviar o like
async function sendLike(sessionId, videoId) {
    try {
        showLoading();
        const response = await fetch(`${urlApi}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Pathname': window.location.pathname,
                'X-Session-Id': sessionId || ''
            },
            body: JSON.stringify({
                shop: 'loja-de-teste-eatables.myshopify.com',
                videoId: videoId
            }),
         })
         if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         // Pegar o session ID do header da resposta
        const newSessionId = response.headers.get("x-session-id");
        if (newSessionId) {
            setCookie("_eatables_session_id", newSessionId);
        }

         const data = await response.json();
         console.log('Resposta da API:', data);
         return data;
    } catch (error) {
        console.error('Erro ao enviar like:', error);
        return null;
    } finally {
        hideLoading();
    }
}

// Fetch para enviar o commentario
async function sendComment(sessionId, videoId, comment) {
    try {
        showLoading();
        const response = await fetch(`${urlApi}/comment/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Pathname': window.location.pathname,
                'X-Session-Id': sessionId || ''
            },
            body: JSON.stringify({
                shop: 'loja-de-teste-eatables.myshopify.com',
                videoId: videoId,
                content: comment
            })
        })
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Pegar o session ID do header da resposta
        const newSessionId = response.headers.get("x-session-id");
        if (newSessionId) {
            setCookie("_eatables_session_id", newSessionId);
        }
        
        const data = await response.json();
        console.log('Resposta da API:', data);
        return data;
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        return null;
    } finally {
        hideLoading();
    }
}

async function events(sessionId, videoId, event) {
    console.log({sessionId, videoId, event})
    try {
        const response = await fetch(`${urlApi}/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'aplication/json',
                'X-Pathname': window.location.pathname,
                'X-Session-Id': sessionId || ''
            },
            body: JSON.stringify({
                shop: 'loja-de-teste-eatables.myshopify.com',
                videoId: videoId,
                event: event
            })
        })
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newSessionId = response.headers.get("x-session-id");
        if (newSessionId) {
            setCookie("_eatables_session_id", newSessionId);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);
        return data;

    } catch (error) {
        console.error('Erro ao enviar video view:', error);
        return null;
    } 
}

function handleTextAnimation(storyData) {
    const textInfo = document.getElementById("popTextCircle");
    textInfo.textContent = storyData.modalConfig.modalText
    textInfo.style.color = storyData.modalConfig.textColor
    textInfo.style.backgroundColor = storyData.modalConfig.color
    if (textInfo) {
        textInfo.classList.add("pop--expand--text");
        setTimeout(() => {
            textInfo.classList.remove("pop--expand--text");
        }, 6000);
    }
}

function toShere(videoId) {
    let sessionId;
    const existingCookie = getCookie("_eatables_session_id");
    if (existingCookie) {
        sessionId = existingCookie.valor;
    }

    const event = "share"
    events(sessionId, videoId, event)

    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).then(() => {
            console.log("Link compartilhado com sucesso!");
        }).catch((error) => {
            console.error("Erro ao compartilhar:", error);
        });
    } else {
        alert("Seu navegador não suporta compartilhamento nativo.");
    } 
}

function openCardMeasures() {
  const popCardMeasures = document.getElementById("popCardMeasures");
  const popCardInformation = document.getElementById("popCardInformation");
  popCardInformation.style.display = "none";
  popCardMeasures.style.display = "block";
  setTimeout(() => {
    popCardMeasures.classList.add("pop--card--comments--open");
}, 10);
}

function closedCardMeasures() {
  const popCardMeasures = document.getElementById("popCardMeasures");
  const popCardInformation = document.getElementById("popCardInformation");
  popCardInformation.style.display = "flex";
  popCardMeasures.style.display = "none";
  popCardMeasures.classList.remove("pop--card--comments--open");
    setTimeout(() => {
        popCardMeasures.style.display = "none";
    }, 300); 
}

function openCardComments() {
    const popCardComments = document.getElementById("popCardComments");
    popCardComments.style.display = "block";
    // Add a small delay to ensure display:block is processed before adding the class
    setTimeout(() => {
        popCardComments.classList.add("pop--card--comments--open");
    }, 10);
}

function closedCardComments() {
    const popCardComments = document.getElementById("popCardComments");
    popCardComments.classList.remove("pop--card--comments--open");
    setTimeout(() => {
        popCardComments.style.display = "none";
    }, 300); 
}

function toggleVolume() {
    const videoPlayer = document.getElementById('popVideoStorie');
    const buttonVolume = document.getElementById('bi-volume-down');
    const buttonVolumeMute = document.getElementById('bi-volume-mute');
    if(videoPlayer.muted) {
        videoPlayer.muted = false;
        buttonVolume.style.display = "block";
        buttonVolumeMute.style.display = "none";
    } else {
        videoPlayer.muted = true;
        buttonVolume.style.display = "none";
        buttonVolumeMute.style.display = "block";
    }
}

function setupEventListeners(storyData) {
    document.getElementById("popCircle").addEventListener("click", () => {
        openPopup(storyData);
    });

    document.getElementById("popButtonLike").addEventListener("click", (event) => {
        event.stopPropagation();
        const videoId = event.currentTarget.getAttribute('data-video-id');
        const isliked = event.currentTarget.getAttribute('data-isliked');
        toggleLikeButton(isliked ,videoId);
    });

    document.getElementById("popButtonClosed").addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que o clique passe para o popStory
        const videoId = event.currentTarget.getAttribute('closed-data-video-id');
        closePopup(videoId);
    });

    // Fecha o popup ao pressionar a tecla Esc
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") { // Verifica se a tecla pressionada é "Esc"
            const videoId = event.currentTarget.getAttribute('closed-data-video-id');
            closePopup(videoId);
        }
    });

    document.getElementById("popButtonShere").addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que o clique passe para o popStory
        const videoId = event.currentTarget.getAttribute('shere-data-video-id');
        toShere(videoId);
    });

    document.getElementById("popButtonRulers").addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que o clique passe para o popStory
        openCardMeasures();
    });

    document.getElementById("popButtonClosedCardMeasures").addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que o clique passe para o popStory
        closedCardMeasures();
    });
    
    document.getElementById("popButtonComments").addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que o clique passe para o popStory
        openCardComments();
    });

    document.getElementById("popButtonClosedCardComments").addEventListener("click", (event) => {
        event.stopPropagation();
        closedCardComments();
    });

    document.getElementById("popButtonVolume").addEventListener("click", (event) => {
        event.stopPropagation();
        toggleVolume();
    });

    document.querySelector(".popCardCommentsForms form").addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const commentInput = document.getElementById("popInputComment");
        const comment = commentInput.value;
        const popSvgSendComment = document.getElementById("popSvgSendComment");
        
        // Obter o ID do vídeo atual
        const videoId = document.getElementById("popButtonLike").getAttribute('data-video-id');
        
        // Obter o session ID
        let sessionId;
        const existingCookie = getCookie("_eatables_session_id");
        if (existingCookie) {
            sessionId = existingCookie.valor;
        }

        const result = await sendComment(sessionId, videoId, comment);
        
        if (result) {
            // Limpar o input após envio bem-sucedido
            popSvgSendComment.style.fill = "#0fb800";

            // Voltar para a cor branca após 2 segundos
            setTimeout(() => {
                popSvgSendComment.style.fill = "#fff";
            }, 2000);
            commentInput.value = '';
            // Aqui você pode adicionar código para atualizar a UI com o novo comentário
        }
    });
}

async function toggleLikeButton(isliked, videoId) {
    if(isliked === 'false') {
        showLoading();
        try {
            let sessionId;
            const existingCookie = getCookie("_eatables_session_id");
            
            if (existingCookie) {
                sessionId = existingCookie.valor;
            } else {
                sessionId = '';
            }
        
            if(await sendLike(sessionId, videoId)) {
                console.log('Like enviado com sucesso!');
            } else {
                console.log('Erro ao enviar like!');
            }
        } finally {
            hideLoading();
        }
    }

    const buttonLike = document.getElementById("icon-like");

    const buttonLikeRed = document.getElementById("icon-like-red");
    if(buttonLike.style.display === "none") {
        buttonLike.style.display = "block";
        buttonLikeRed.style.display = "none";

    } else {
        buttonLike.style.display = "none";
        buttonLikeRed.style.display = "block";
    }
}

function closePopup(videoId) {
    let sessionId;
    const existingCookie = getCookie("_eatables_session_id");
    if (existingCookie) {
        sessionId = existingCookie.valor;
    }
    const event = "video_closed"
    events(sessionId, videoId, event)
    const container = document.getElementById('popContainerGlobal');
    const story = document.getElementById("popStory");
    const circule = document.getElementById("popCircle");
    const videoPlayer = document.getElementById('popVideoStorie');
    
    container.classList.remove("pop--container--open");
    container.classList.add("pop--container--closed");
    story.style.display = "none";
    circule.style.display = "block";
    videoPlayer.pause();
}

function openPopup(storyData) {
    const container = document.getElementById('popContainerGlobal');
    const story = document.getElementById("popStory");
    const circule = document.getElementById("popCircle");
    const textInfo = document.getElementById("popTextCircle");
    
    container.classList.remove("pop--container--closed");
    container.classList.add("pop--container--open");
    
    if (storyData && storyData.videos) {
        initializeVideoPlayer(storyData);
    } else {
        console.error('Dados dos vídeos não disponíveis');
        return;
    }

    textInfo.style.display = "none";
    story.style.display = "block";
    circule.style.display = "none";
}

function initializeVideoPlayer(storyData) {
    const videos = [];
    const videoIds = [];
    const isliked = [];

    if (storyData && storyData.videos && Array.isArray(storyData.videos)) {
        storyData.videos.forEach(video => {
            videos.push(video.video.url);
            videoIds.push(video.video.id);
            isliked.push(video.video.liked);
        });
    } else {
        console.error('Formato de dados inválido:', storyData);
        return;
    }

    if (videos.length === 0) {
        console.error('Nenhum vídeo encontrado nos dados');
        return;
    }

    const videoPlayer = document.getElementById('popVideoStorie');
    const progressContainer = document.querySelector(".popStoryBarContainer");
    progressContainer.innerHTML = "";

    let currentVideoIndex = 0;
    const progressBars = createProgressBars(videos, progressContainer);

    const updateLikeButtonVideoId = () => {
        const likeButton = document.getElementById("popButtonLike");
        const buttonLike = document.getElementById("icon-like");
        const buttonLikeRed = document.getElementById("icon-like-red");
        const popButtonShere = document.getElementById("popButtonShere")
        const popButtonClosed = document.getElementById("popButtonClosed")
        
        likeButton.setAttribute('data-video-id', videoIds[currentVideoIndex]);
        likeButton.setAttribute('data-isliked', isliked[currentVideoIndex]);
        popButtonShere.setAttribute('shere-data-video-id', videoIds[currentVideoIndex])
        popButtonClosed.setAttribute('closed-data-video-id', videoIds[currentVideoIndex])

        // Atualiza o estado visual do botão de like
        if (isliked[currentVideoIndex]) {
            buttonLike.style.display = "none";
            buttonLikeRed.style.display = "block";
        } else {
            buttonLike.style.display = "block";
            buttonLikeRed.style.display = "none";
        }
    };

    function loadNextVideo() {
        if (currentVideoIndex < videos.length) {
            videoPlayer.src = videos[currentVideoIndex];
            videoPlayer.load();
            
            let sessionId;
            const existingCookie = getCookie("_eatables_session_id");
            if (existingCookie) {
                sessionId = existingCookie.valor;
            }
            const event = "video_view"
            const videoId = videos[currentVideoIndex];
            events(sessionId, videoId, event);

            updateLikeButtonVideoId();
            
            videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
            videoPlayer.removeEventListener("ended", handleVideoEnded);
            
            videoPlayer.addEventListener("timeupdate", handleTimeUpdate);
            videoPlayer.addEventListener("ended", handleVideoEnded);
            
            videoPlayer.addEventListener(
                "loadeddata",
                () => videoPlayer.play().catch(console.error),
                { once: true }
            );
        } else {
            resetAll();
        }
    }
    
    function handleTimeUpdate() {
        const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        if (progressBars[currentVideoIndex]) {
            progressBars[currentVideoIndex].style.width = `${percentage}%`;
        }
        if (percentage >= 98 && !videoPlayer.dataset.log98) {
            videoPlayer.dataset.log98 = "true";
            let sessionId;
            const existingCookie = getCookie("_eatables_session_id");
            if (existingCookie) {
                sessionId = existingCookie.valor;
            }
            const event = "video_completed"
            const videoId = videoIds[currentVideoIndex]
            events(sessionId, videoId, event)
        }
    }
    
    function handleVideoEnded() {
        if (progressBars[currentVideoIndex]) {
            progressBars[currentVideoIndex].style.width = "100%";
        }
        currentVideoIndex++;
        loadNextVideo();
    }
    
    function resetAll() {
        currentVideoIndex = 0;
        progressBars.forEach(bar => bar.style.width = "0%");
        loadNextVideo();
    }
    
    document.getElementById("popStory").addEventListener("click", () => {
        if (currentVideoIndex < videos.length - 1) {
            if (progressBars[currentVideoIndex]) {
                progressBars[currentVideoIndex].style.width = "100%";
            }
            currentVideoIndex++;
            loadNextVideo();
        } else {
            resetAll();
        }
    });
    
    loadNextVideo();
}

function createProgressBars(videos, container) {
    return videos.map((_, index) => {
        const progressBarWrapper = document.createElement("div");
        progressBarWrapper.classList.add("pop--story--bar");
        
        const progressBarFill = document.createElement("div");
        progressBarFill.classList.add("pop--story--bar--fill", `pop--story--bar--fill--${index}`);
        progressBarFill.style.display = "block";
        
        progressBarWrapper.appendChild(progressBarFill);
        container.appendChild(progressBarWrapper);
        
        return progressBarFill;
    });
}

// Começo de tudo!
document.addEventListener('DOMContentLoaded', async function () {
    
    let sessionId;
    const existingCookie = getCookie("_eatables_session_id");
    
    if (existingCookie) {
        sessionId = existingCookie.valor;
    } else {
        sessionId = '';
    }

    const popContainerGlobal = document.getElementById("popContainerGlobal");
    const popContainerCircle = document.getElementById("popContainerCircle");
    const popCircle = document.getElementById("popCircle");
    const popVideoCircle = document.getElementById("popVideoCircle");
    const popTextCircle = document.getElementById("popTextCircle");

    popContainerGlobal.style.display = "none";

    const storyData = await fetchInitialData(sessionId);
    
    if (storyData) {
        popContainerGlobal.style.display = "flex";
        if(storyData.modalConfig.position === "bottom-left" || storyData.modalConfig.position === "top-left") {
            if(storyData.modalConfig.position === "top-left") {
                popContainerGlobal.style.removeProperty("bottom");
                popContainerGlobal.style.marginTop = "1rem";
            } else {
                popContainerGlobal.style.bottom = "0";
            }
            popContainerGlobal.style.left = "0";
            popCircle.style.marginLeft = "1rem";
            popTextCircle.classList.add("pop--expand--text");
            popTextCircle.style.paddingLeft = "1rem";
            popTextCircle.style.borderRadius = "0 20px 20px 0";
            popTextCircle.style.right = "10px";
            popTextCircle.style.transform = "translateX(-50%)";

        } else if(storyData.modalConfig.position === "bottom-right" || storyData.modalConfig.position === "top-right") {
            if(storyData.modalConfig.position === "top-right") {
                popContainerGlobal.style.removeProperty("bottom");
                popContainerGlobal.style.marginTop = "1rem";
            } else {
                popContainerGlobal.style.bottom = "0";
            }
            popContainerGlobal.style.right = "0";
            popContainerCircle.style.flexDirection = "row-reverse";
            popCircle.style.marginRight = "1rem";
            popTextCircle.classList.add("pop--expand--text--reverse");
            popTextCircle.style.paddingRight = "1rem";
            popTextCircle.style.borderRadius = "20px 0 0 20px";
            popTextCircle.style.left = "10px";
            popTextCircle.style.transform = "translateX(50%)";
        } 

        popVideoCircle.src = storyData.videos[0].video.url;
        popCircle.style.borderColor = storyData.modalConfig.color;

        customElements.define("eatables-video-commerce", EatablesVideoCommerce);
        window.onload = handleTextAnimation(storyData);
        setupEventListeners(storyData);
    }

});