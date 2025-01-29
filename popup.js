document.addEventListener('DOMContentLoaded', function () {
    window.onload = handleTextAnimation;
    
    setupEventListeners();
});

function handleTextAnimation() {
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
}

function setupEventListeners() {
    document.getElementById("popButtonLike").addEventListener("click", toggleLikeButton);
    document.getElementById("popButtonClosed").addEventListener("click", closePopup);
    document.getElementById("popCircle").addEventListener("click", openPopup);
}

function toggleLikeButton() {
    const buttonLike = document.getElementById("icon-like");
    buttonLike.style.color = buttonLike.style.color === "red" ? "white" : "red";
}

function closePopup() {
    const container = document.getElementById('popContainerGlobal');
    const story = document.getElementById("popStory");
    const circule = document.getElementById("popCircle");
    
    container.classList.remove("pop--container--open");
    container.classList.add("pop--container--closed");
    story.style.display = "none";
    circule.style.display = "block";
}

function openPopup() {
    const container = document.getElementById('popContainerGlobal');
    const story = document.getElementById("popStory");
    const circule = document.getElementById("popCircle");
    const textInfo = document.getElementById("popTextCircle");
    
    container.classList.remove("pop--container--closed");
    container.classList.add("pop--container--open");
    
    initializeVideoPlayer();
    
    textInfo.style.display = "none";
    story.style.display = "block";
    circule.style.display = "none";
}

function initializeVideoPlayer() {
    const videos = [
        "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/isDog.mp4",
        "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/70962-536644240_small.mp4",
        "https://lp.lovechocolate.com.br/wp-content/uploads/2025/01/isDog.mp4"
    ];
    
    const videoPlayer = document.getElementById('popVideoStorie');
    const progressContainer = document.querySelector(".popStoryBarContainer");
    progressContainer.innerHTML = "";
    
    let currentVideoIndex = 0;
    const progressBars = createProgressBars(videos, progressContainer);
    
    function loadNextVideo() {
        if (currentVideoIndex < videos.length) {
            videoPlayer.src = videos[currentVideoIndex];
            videoPlayer.load();
            
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
