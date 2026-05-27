let phase = 0;

const ASSET_BASE_URL = "https://pub-3d61cedd944c41198454cfdf476e04a9.r2.dev/images";
const VIDEO_BASE_URL = "https://pub-3d61cedd944c41198454cfdf476e04a9.r2.dev/videos";
const ANOMALY_START = 16.0;
const ANOMALY_END = 17.0;
const NORMAL_VIDEO_DURATION = 29;

const body = document.body;
const noiseOverlay = document.getElementById("noise-overlay");
const speakerImage = document.getElementById("speakerImage");
const speakerText = document.getElementById("speakerText");
const playlistList = document.getElementById("playlistList");
const audioStop = document.getElementById("audioStop");
const protocolBlank = document.getElementById("protocolBlank");
const protocolItem = document.getElementById("protocolItem");
const tvText = document.getElementById("tvText");
const videoPanel = document.getElementById("videoPanel");
const sampleVideo = document.getElementById("sampleVideo");
const videoToggle = document.getElementById("videoToggle");
const videoTrack = document.getElementById("videoTrack");
const videoTime = document.getElementById("videoTime");
const videoProgress = document.getElementById("videoProgress");
const aiImage = document.getElementById("aiImage");
const assistantText = document.getElementById("assistantText");
const integrationTable = document.getElementById("integrationTable");
const hiddenInstituteRow = document.getElementById("hiddenInstituteRow");
const hiddenLog = document.getElementById("hiddenLog");
const resetStateButton = document.getElementById("resetStateButton");
const purchaseButton = document.getElementById("purchaseButton");
const purchaseMessage = document.getElementById("purchaseMessage");
const topShareButton = document.getElementById("topShareButton");

let noiseNextAction = null;
let protocolRevealed = false;
let scrubCount = 0;
let currentAudio = null;
let anomalyLoopActive = false;
let anomalyArmedAt = null;
let anomalyAllLoaded = false;
let switchingVideoSource = false;

function assetUrl(fileName) {
  return `${ASSET_BASE_URL}/${fileName}`;
}

function videoUrl(fileName) {
  return `${VIDEO_BASE_URL}/${fileName}`;
}

function showAlteration(nextPhase) {
  runSiteAlteredOverlay(() => {
    phase = nextPhase;
    applyPhase();
  });
}

function runSiteAlteredOverlay(nextAction = null) {
  if (!noiseOverlay) return;

  noiseNextAction = nextAction;
  noiseOverlay.classList.add("is-active");
  noiseOverlay.setAttribute("aria-hidden", "false");
}

function closeSiteAlteredOverlay() {
  if (!noiseOverlay) return;

  noiseOverlay.classList.remove("is-active");
  noiseOverlay.setAttribute("aria-hidden", "true");
}

function handleNoiseOverlayClick() {
  closeSiteAlteredOverlay();

  if (typeof noiseNextAction === "function") {
    const action = noiseNextAction;
    noiseNextAction = null;
    action();
    return;
  }

  noiseNextAction = null;
}

function applyPhase() {
  body.dataset.phase = String(phase);
  body.classList.toggle("truth-mode", phase === 4);

  if (phase >= 1) {
    setSpeakerAnomalyState();
  }

  if (phase >= 2) {
    tvText.textContent = "29秒の自然風景サンプルです。停止位置によっては、未処理フレームが残る場合があります。";
    videoPanel.classList.add("has-anomaly");
    loadAnomalyAllVideo();
  }

  if (phase >= 3) {
    aiImage.src = assetUrl("img_ai_hidden_800x600.png");
    assistantText.textContent = "HOMURA AIは、睡眠環境、連携先、刺激反応を統合して最適化します。";
    integrationTable.classList.add("is-sensitive");
  }

  if (phase === 4) {
    applyAlteredTop();
    sessionStorage.setItem("homuraTruthReached", "1");
    window.location.href = "./truth.html";
  }
}

function applyAlteredTop() {
  body.classList.add("truth-mode");
}

function setSpeakerAnomalyState() {
  speakerImage.src = assetUrl("img_speaker_alt_800x600.png");
  speakerText.textContent = "睡眠音源の一部に、分類されていない項目が混在しています。実際に音楽が鳴ります。ご注意ください。";
  protocolRevealed = true;
  protocolBlank.hidden = true;
  protocolItem.hidden = false;
  protocolItem.classList.add("is-revealing");
}

function restoreTruthTopState() {
  phase = 4;
  applyAlteredTop();
  setSpeakerAnomalyState();
  body.dataset.phase = "4";
}

function loadAnomalyAllVideo() {
  if (anomalyAllLoaded) return;

  const wasPaused = sampleVideo.paused;
  const previousTime = sampleVideo.currentTime || 0;
  switchingVideoSource = true;
  sampleVideo.loop = false;
  sampleVideo.controls = true;
  sampleVideo.src = videoUrl("anomalyall.mp4");
  sampleVideo.load();
  sampleVideo.addEventListener("loadedmetadata", () => {
    sampleVideo.currentTime = Math.min(previousTime, sampleVideo.duration || previousTime);
    switchingVideoSource = false;
    updateVideoDisplay();
    if (!wasPaused) {
      sampleVideo.play();
    }
  }, { once: true });
  window.setTimeout(() => {
    switchingVideoSource = false;
  }, 1200);
  anomalyAllLoaded = true;
}

function revealProtocol() {
  if (protocolRevealed) return;

  protocolRevealed = true;
  phase = Math.max(phase, 1);
  protocolBlank.hidden = true;
  protocolItem.hidden = false;
  protocolItem.classList.add("is-revealing");
  applyPhase();
}

function stopCurrentAudio() {
  if (!currentAudio) return;

  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
  document.querySelectorAll(".playlist-item").forEach((button) => button.classList.remove("is-playing"));
  speakerText.textContent = "音源を停止しました。実際に音楽が鳴ります。ご注意ください。";
}

function playPlaylistAudio(event) {
  const item = event.target.closest("[data-audio]");
  if (!item) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(item.dataset.audio);
  currentAudio.loop = true;
  currentAudio.volume = 0.45;
  currentAudio.play().catch(() => {
    speakerText.textContent = "ブラウザの設定により音声を開始できませんでした。もう一度選択してください。";
  });

  document.querySelectorAll(".playlist-item").forEach((button) => button.classList.remove("is-playing"));
  item.classList.add("is-playing");
  speakerText.textContent = `${item.textContent} を再生しています。実際に音楽が鳴ります。ご注意ください。`;
}

function activateProtocol(event) {
  if (event) {
    window.setTimeout(() => {
      if (protocolRevealed && phase === 1) {
        showAlteration(2);
      }
    }, 450);
    return;
  }

  if (protocolRevealed && phase === 1) {
    showAlteration(2);
  }
}

function toggleVideo() {
  if (anomalyLoopActive) {
    handleVideoPanelClick();
    return;
  }

  if (sampleVideo.paused) {
    sampleVideo.play();
  } else {
    sampleVideo.pause();
  }
}

function updateVideoDisplay() {
  const current = anomalyLoopActive ? anomalyArmedAt || ANOMALY_START : sampleVideo.currentTime || 0;
  const duration = NORMAL_VIDEO_DURATION;
  const seconds = Math.floor(current).toString().padStart(2, "0");
  const total = Math.floor(duration).toString().padStart(2, "0");
  videoTime.textContent = `00:${seconds} / 00:${total}`;
  videoProgress.style.width = `${Math.min(100, (current / duration) * 100)}%`;
  videoToggle.textContent = anomalyLoopActive ? "確認" : sampleVideo.paused ? "再生" : "停止";
  videoPanel.classList.toggle("is-playing", !sampleVideo.paused);
  videoPanel.classList.toggle("is-looping-anomaly", anomalyLoopActive);
}

function handleVideoPanelClick() {
  if (phase === 2 && anomalyLoopActive) {
    showAlteration(3);
  }
}

function seekVideo(event) {
  event.stopPropagation();
  const rect = videoTrack.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const duration = sampleVideo.duration && Number.isFinite(sampleVideo.duration) ? sampleVideo.duration : NORMAL_VIDEO_DURATION;
  sampleVideo.currentTime = ratio * duration;
  updateVideoDisplay();
}

function handleVideoPause() {
  if (phase !== 2 || anomalyLoopActive || switchingVideoSource) return;

  const stoppedInAnomalyWindow = sampleVideo.currentTime >= ANOMALY_START && sampleVideo.currentTime <= ANOMALY_END;
  if (stoppedInAnomalyWindow) {
    startAnomalyLoop();
  }
}

function startAnomalyLoop() {
  anomalyLoopActive = true;
  anomalyArmedAt = Math.min(ANOMALY_END, Math.max(ANOMALY_START, sampleVideo.currentTime));
  sampleVideo.loop = true;
  sampleVideo.controls = false;
  tvText.textContent = "異常フレームが固定されました。映像を確認してください。";
  if (!sampleVideo.src.includes("/videos/anomaly.mp4")) {
    switchingVideoSource = true;
    sampleVideo.src = videoUrl("anomaly.mp4");
    sampleVideo.load();
  }
  sampleVideo.addEventListener("loadedmetadata", () => {
    sampleVideo.currentTime = 0;
    switchingVideoSource = false;
    sampleVideo.play();
    updateVideoDisplay();
  }, { once: true });
  window.setTimeout(() => {
    switchingVideoSource = false;
  }, 1200);
  if (sampleVideo.readyState >= 1) {
    sampleVideo.currentTime = 0;
    sampleVideo.play();
    updateVideoDisplay();
  }
}

function scrubIntegrationList() {
  if (phase < 3 || !hiddenInstituteRow.hidden) return;

  scrubCount += 1;
  integrationTable.style.setProperty("--scrub", Math.min(scrubCount / 18, 1));

  if (scrubCount >= 18) {
    hiddenInstituteRow.hidden = false;
    hiddenInstituteRow.classList.add("is-visible");
    hiddenLog.classList.add("is-visible");
  }
}

function activateInstitute() {
  if (phase === 3 && !hiddenInstituteRow.hidden) {
    showAlteration(4);
  }
}

function shareToX() {
  const text = `${CONFIG.shareText}\n\n${CONFIG.shareUrl}`;
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener,noreferrer");
}

function resetExplorationState() {
  sessionStorage.removeItem("homuraTruthReached");
  window.location.href = "./index.html";
}

function showPurchaseMessage() {
  purchaseMessage.textContent = "ご購入ありがとうございます。近日中にお届けにまいります。";
}

protocolBlank.addEventListener("click", revealProtocol);
protocolItem.addEventListener("click", activateProtocol);
audioStop.addEventListener("click", stopCurrentAudio);
videoToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleVideo();
});
videoPanel.addEventListener("click", handleVideoPanelClick);
videoPanel.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleVideoPanelClick();
  }
});
videoTrack.addEventListener("click", seekVideo);
sampleVideo.addEventListener("timeupdate", updateVideoDisplay);
sampleVideo.addEventListener("play", updateVideoDisplay);
sampleVideo.addEventListener("pause", () => {
  updateVideoDisplay();
  handleVideoPause();
});
sampleVideo.addEventListener("click", handleVideoPanelClick);
integrationTable.addEventListener("pointermove", scrubIntegrationList);
integrationTable.addEventListener("touchmove", scrubIntegrationList);
hiddenInstituteRow.addEventListener("click", activateInstitute);
noiseOverlay.addEventListener("click", handleNoiseOverlayClick);
resetStateButton.addEventListener("click", resetExplorationState);
purchaseButton.addEventListener("click", showPurchaseMessage);
if (topShareButton) {
  topShareButton.addEventListener("click", shareToX);
}

videoPanel.classList.add("is-enabled");
videoToggle.disabled = false;
protocolBlank.hidden = false;
playlistList.addEventListener("click", playPlaylistAudio);

if (sessionStorage.getItem("homuraTruthReached") === "1") {
  restoreTruthTopState();
} else {
  applyPhase();
}
