function playVideosSequentially(videos) {
    const videoPlayer = document.getElementById('src-video');
    let currentVideoIndex = 0;

    function loadNextVideo() {
        if (currentVideoIndex < videos.length) {
            videoPlayer.src = videos[currentVideoIndex];
            videoPlayer.load();
            videoPlayer.addEventListener('loadeddata', () => {
                videoPlayer.play().catch(error => {
                    console.error("Erro ao tentar reproduzir o vídeo:", error);
                });
            }, { once: true });
        } else {
            console.log("Todos os vídeos foram reproduzidos.");
        }
    }

    videoPlayer.addEventListener('ended', () => {
        currentVideoIndex++;
        loadNextVideo();
    });

    loadNextVideo();
}

window.onload = function () {
    const textInfo = document.getElementById("textInfo");

    if (textInfo) {
        textInfo.classList.add("expandWith");
        setTimeout(() => {
            textInfo.classList.remove("expandWith"); 
            textInfo.classList.add("animationDiminuiWidth"); 
            setTimeout(() => {
                textInfo.style.display = "none"; 
            }, 700); 
        }, 6000); 
    }
};

document.getElementById("like").addEventListener("click", () => {
    buttonLike = document.getElementById("icon-like");
    if (buttonLike.style.color === "red") {
        buttonLike.style.color = "white";
    } else {
        buttonLike.style.color = "red";
    }
    
})

document.getElementById("close").addEventListener("click", () => {
    const container = document.getElementById('container');
    container.classList.remove("containerAberto");
    container.classList.add("containerFechado");
    const story = document.getElementById("story");
    const circule = document.getElementById("circule");
    story.style.display = "none";
    circule.style.display = "block";

})

document.getElementById("circule").addEventListener("click", () => {
    const container = document.getElementById('container');
    const story = document.getElementById("story");
    const circule = document.getElementById("circule");
    const textInfo = document.getElementById("textInfo");

    // Remove a classe antiga e adiciona a nova classe
    container.classList.remove("containerFechado");
    container.classList.add("containerAberto");

    const videos = [
        "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/isDog.mp4",
        "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/70962-536644240_small.mp4",
        "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/isDog.mp4"
    ];

    const videoPlayer = document.getElementById('src-video');
    const progressContainer = document.querySelector(".progress-bar-container");
    progressContainer.innerHTML = ""; // Limpa as barras existentes
    let currentVideoIndex = 0;

    // Cria as barras de progresso
    const progressBars = [];
    videos.forEach((_, index) => {
        const progressBarWrapper = document.createElement("div");
        progressBarWrapper.classList.add("progress-bar");

        const progressBarFill = document.createElement("div");
        progressBarFill.classList.add("progress-bar-fill", `progress-bar-fill-${index}`); // Classe única para cada barra
        progressBarWrapper.appendChild(progressBarFill);

        progressBars.push(progressBarFill);
        progressContainer.appendChild(progressBarWrapper);
    });

    // Função para carregar e reproduzir o próximo vídeo
    function loadNextVideo() {
        if (currentVideoIndex < videos.length) {
            videoPlayer.src = videos[currentVideoIndex];
            videoPlayer.load();

            // Remove eventos anteriores de "timeupdate" e "ended"
            videoPlayer.removeEventListener("timeupdate", handleTimeUpdate);
            videoPlayer.removeEventListener("ended", handleVideoEnded);

            // Define os eventos para o vídeo atual
            videoPlayer.addEventListener("timeupdate", handleTimeUpdate);
            videoPlayer.addEventListener("ended", handleVideoEnded);

            // Reproduz o vídeo
            videoPlayer.addEventListener(
                "loadeddata",
                () => {
                    videoPlayer.play().catch((error) => {
                        console.error("Erro ao tentar reproduzir o vídeo:", error);
                    });
                },
                { once: true }
            );
        } else {
            console.log("Todos os vídeos foram reproduzidos.");
            resetAll();
        }
    }

    // Adiciona um evento de clique no elemento story para passar o vídeo
    document.getElementById("story").addEventListener("click", () => {
        if (currentVideoIndex < videos.length - 1) {
            // Marca o vídeo atual como completo
            const currentProgressBar = progressBars[currentVideoIndex];
            if (currentProgressBar) {
                currentProgressBar.style.width = "100%";
            }

            // Avança para o próximo vídeo
            currentVideoIndex++;
            loadNextVideo();
        } else {
            // Caso seja o último vídeo, reinicia tudo
            console.log("Todos os vídeos foram reproduzidos. Reiniciando...");
            resetAll();
        }
    });

    // Atualiza a barra de progresso do vídeo atual
    function handleTimeUpdate() {
        const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        const currentProgressBar = progressBars[currentVideoIndex];
        if (currentProgressBar) {
            currentProgressBar.style.width = `${percentage}%`;
        }
    }

    // Função para reiniciar tudo
    function resetAll() {
        // Redefine o índice atual
        currentVideoIndex = 0;

        // Reseta todas as barras de progresso
        progressBars.forEach((progressBar) => {
            progressBar.style.width = "0%";
        });

        // Reinicia o player de vídeo
        loadNextVideo();
    }

    // Quando o vídeo termina, carrega o próximo vídeo
    function handleVideoEnded() {
        const currentProgressBar = progressBars[currentVideoIndex];
        if (currentProgressBar) {
            currentProgressBar.style.width = "100%"; // Marca a barra atual como completa
        }
        currentVideoIndex++;
        loadNextVideo(); // Carrega o próximo vídeo
    }

    // Inicia o primeiro vídeo
    loadNextVideo();

    // Mostra o elemento story
    textInfo.style.display = "none";
    story.style.display = "block";
    circule.style.display = "none";
});

