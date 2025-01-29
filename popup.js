document.addEventListener('DOMContentLoaded', function () {

    window.onload = function () {
        const textInfo = document.getElementById("popTextCircle");
    
        if (textInfo) {
            textInfo.classList.add("pop--expand--text");
            setTimeout(() => {
                textInfo.classList.remove("pop--expand--text"); 
                textInfo.classList.add("pop--retract--text"); 
                setTimeout(() => {
                    textInfo.style.display = "none"; 
                }, 700); 
            }, 6000); 
        }
    };
    
    document.getElementById("popButtonLike").addEventListener("click", () => {
        buttonLike = document.getElementById("icon-like");
        if (buttonLike.style.color === "red") {
            buttonLike.style.color = "white";
        } else {
            buttonLike.style.color = "red";
        }
        
    })
    
    document.getElementById("popButtonClosed").addEventListener("click", () => {
        const container = document.getElementById('popContainerGlobal');
        container.classList.remove("pop--container--open");
        container.classList.add("pop--container--closed");
        const story = document.getElementById("popStory");
        const circule = document.getElementById("popCircle");
        story.style.display = "none";
        circule.style.display = "block";

    })
    
    document.getElementById("popCircle").addEventListener("click", () => {
        const container = document.getElementById('popContainerGlobal');
        const story = document.getElementById("popStory");
        const circule = document.getElementById("popCircle");
        const textInfo = document.getElementById("popTextCircle");
    
        // Remove a classe antiga e adiciona a nova classe
        container.classList.remove("pop--container--closed");
        container.classList.add("pop--container--open");
    
        const videos = [
            "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/isDog.mp4",
            "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/70962-536644240_small.mp4",
            "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/isDog.mp4"
        ];
    
        const videoPlayer = document.getElementById('popVideoStorie');
        const progressContainer = document.querySelector(".popStoryBarContainer");
        progressContainer.innerHTML = ""; // Limpa as barras existentes
        let currentVideoIndex = 0;
    
        // Cria as barras de progresso
        const progressBars = [];
        videos.forEach((_, index) => {
            const progressBarWrapper = document.createElement("div");
            progressBarWrapper.classList.add("pop--story--bar");
    
            const progressBarFill = document.createElement("div");
            progressBarFill.classList.add("pop--story--bar--fill", `pop--story--bar--fill--${index}`); // Classe única para cada barra
            progressBarFill.style.display = "block"
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
        document.getElementById("popStory").addEventListener("click", () => {
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
});
