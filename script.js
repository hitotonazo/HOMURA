let phase = 0;

const ASSET_BASE_URL = "https://pub-3d61cedd944c41198454cfdf476e04a9.r2.dev/images";
const ANOMALY_START = 16.0;
const ANOMALY_END = 17.0;

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
const videoTime = document.getElementById("videoTime");
const videoTrack = document.getElementById("videoTrack");
const videoProgress = document.getElementById("videoProgress");
const aiImage = document.getElementById("aiImage");
const assistantText = document.getElementById("assistantText");
const integrationTable = document.getElementById("integrationTable");
const hiddenInstituteRow = document.getElementById("hiddenInstituteRow");
const hiddenLog = document.getElementById("hiddenLog");
const searchInput = document.getElementById("searchInput");
const searchHint = document.getElementById("searchHint");
const devicesImage = document.getElementById("devicesImage");
const planText = document.getElementById("planText");
const shareButton = document.getElementById("shareButton");
const resetStateButton = document.getElementById("resetStateButton");
const delayedGlitchButton = document.getElementById("delayedGlitchButton");
const purchaseButton = document.getElementById("purchaseButton");
const purchaseMessage = document.getElementById("purchaseMessage");

let noiseNextAction = null;
let protocolRevealed = false;
let scrubCount = 0;
let currentAudio = null;

function assetUrl(fileName) {
  return `${ASSET_BASE_URL}/${fileName}`;
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
    speakerImage.src = assetUrl("img_speaker_alt_800x600.png");
    speakerText.textContent = "睡眠音源の一部に、分類されていない項目が混在しています。";
  }

  if (phase >= 2) {
    tvText.textContent = "30秒の自然風景サンプルです。停止位置によっては、未処理フレームが残る場合があります。";
    videoPanel.classList.add("has-anomaly");
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
  devicesImage.src = assetUrl("img_devices_truth_1200x800.png");
  document.querySelector(".hero-media").style.backgroundImage = `url('${assetUrl("img_hero_truth_1200x500.png")}')`;

  document.querySelector(".hero .eyebrow").textContent = "Behavior Control Record";
  document.querySelector(".hero h1").textContent = "HOMURA OBSERVATION LOG";
  document.querySelector(".hero-copy p:not(.eyebrow)").textContent =
    "スマートホームデバイスを用いた人間行動制御実験の記録ページ。音声、映像、AI応答による誘導結果を表示しています。";

  document.querySelector("#devices .section-heading .eyebrow").textContent = "SUBJECT STATUS";
  document.querySelector("#devices h2").textContent = "被験者番号：HM-0427";
  document.querySelector("#devices .section-heading p").textContent =
    "精神安定度：安定 / 従順性スコア：92% / 睡眠誘導成功率：87% / 好奇心抑制：完了";

  speakerText.textContent = "夜間音声刺激：成功。反復再生後、自己選択感を維持したまま睡眠移行を確認。";
  tvText.textContent = "映像刺激反応：定着率87%。1秒未満の命令語挿入に対する視線停止を確認。";
  assistantText.textContent = "AI最適化ログ：探索傾向は低下。連携先開示への反応は好奇心抑制プロトコルへ移行済み。";

  hiddenLog.classList.add("is-visible");
  searchInput.placeholder = "SUBJECT HM-0427";
  searchHint.textContent = "この記録はInstitute for the Unfettered Mindにより管理されています。";
  planText.textContent = "観測状態：継続。次回刺激配信まで 06:00:00。";
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
  speakerText.textContent = `${item.textContent} を再生しています。`;
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
  if (sampleVideo.paused) {
    sampleVideo.play();
  } else {
    sampleVideo.pause();
  }
}

function updateVideoDisplay() {
  const current = sampleVideo.currentTime || 0;
  const duration = sampleVideo.duration && Number.isFinite(sampleVideo.duration) ? sampleVideo.duration : 30;
  const seconds = Math.floor(current).toString().padStart(2, "0");
  const total = Math.floor(duration).toString().padStart(2, "0");
  videoTime.textContent = `00:${seconds} / 00:${total}`;
  videoProgress.style.width = `${Math.min(100, (current / duration) * 100)}%`;
  videoToggle.textContent = sampleVideo.paused ? "再生" : "停止";
  videoPanel.classList.toggle("is-playing", !sampleVideo.paused);
}

function handleVideoPanelClick() {
  const pausedNearAnomaly = sampleVideo.paused && sampleVideo.currentTime >= ANOMALY_START && sampleVideo.currentTime <= ANOMALY_END;
  if (phase === 2 && pausedNearAnomaly) {
    showAlteration(3);
  }
}

function seekVideo(event) {
  event.stopPropagation();
  const rect = videoTrack.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const duration = sampleVideo.duration && Number.isFinite(sampleVideo.duration) ? sampleVideo.duration : 30;
  sampleVideo.currentTime = ratio * duration;
  updateVideoDisplay();
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

function scheduleGlitchDemo() {
  delayedGlitchButton.disabled = true;
  delayedGlitchButton.textContent = "5秒後に実行中";
  window.setTimeout(() => {
    runSiteAlteredOverlay(() => {
      delayedGlitchButton.disabled = false;
      delayedGlitchButton.textContent = "5秒後に改変演出";
    });
  }, 5000);
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
sampleVideo.addEventListener("pause", updateVideoDisplay);
integrationTable.addEventListener("pointermove", scrubIntegrationList);
integrationTable.addEventListener("touchmove", scrubIntegrationList);
hiddenInstituteRow.addEventListener("click", activateInstitute);
if (shareButton) {
  shareButton.addEventListener("click", shareToX);
}
noiseOverlay.addEventListener("click", handleNoiseOverlayClick);
resetStateButton.addEventListener("click", resetExplorationState);
delayedGlitchButton.addEventListener("click", scheduleGlitchDemo);
purchaseButton.addEventListener("click", showPurchaseMessage);

videoPanel.classList.add("is-enabled");
videoToggle.disabled = false;
protocolBlank.hidden = false;
playlistList.addEventListener("click", playPlaylistAudio);
if (sessionStorage.getItem("homuraTruthReached") === "1") {
  phase = 4;
  body.classList.add("truth-mode");
  applyAlteredTop();
} else {
  applyPhase();
}
