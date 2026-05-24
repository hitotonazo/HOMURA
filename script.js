let phase = 0;

const ASSET_BASE_URL = "https://pub-3d61cedd944c41198454cfdf476e04a9.r2.dev/images";
const ANOMALY_START = 14.0;
const ANOMALY_END = 15.0;

const body = document.body;
const noiseOverlay = document.getElementById("noise-overlay");
const speakerImage = document.getElementById("speakerImage");
const speakerText = document.getElementById("speakerText");
const playlistList = document.getElementById("playlistList");
const protocolBlank = document.getElementById("protocolBlank");
const protocolItem = document.getElementById("protocolItem");
const tvImage = document.getElementById("tvImage");
const tvText = document.getElementById("tvText");
const videoPanel = document.getElementById("videoPanel");
const videoToggle = document.getElementById("videoToggle");
const videoTime = document.getElementById("videoTime");
const videoTrack = document.getElementById("videoTrack");
const videoProgress = document.getElementById("videoProgress");
const tvOverlay = document.getElementById("tvOverlay");
const aiImage = document.getElementById("aiImage");
const assistantText = document.getElementById("assistantText");
const integrationButton = document.getElementById("integrationButton");
const integrationCount = document.getElementById("integrationCount");
const hiddenInstitute = document.getElementById("hiddenInstitute");
const hiddenLog = document.getElementById("hiddenLog");
const searchInput = document.getElementById("searchInput");
const searchHint = document.getElementById("searchHint");
const devicesImage = document.getElementById("devicesImage");
const planText = document.getElementById("planText");
const shareButton = document.getElementById("shareButton");

let noiseNextAction = null;
let protocolRevealed = false;
let playlistClicks = 0;
let videoPlaying = false;
let videoCurrentTime = 0;
let videoTimer = null;
let integrationClicks = 0;

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
    protocolBlank.hidden = false;
  }

  if (phase >= 2) {
    tvImage.src = assetUrl("img_tv_frame_glitch_800x600.png");
    tvText.textContent = "30秒の自然風景サンプルです。停止位置によっては、未処理フレームが残る場合があります。";
    videoPanel.classList.add("is-enabled");
    videoToggle.disabled = false;
  }

  if (phase >= 3) {
    aiImage.src = assetUrl("img_ai_hidden_800x600.png");
    assistantText.textContent = "HOMURA AIは、睡眠環境、連携先、刺激反応を統合して最適化します。";
    integrationButton.disabled = false;
  }

  if (phase === 4) {
    applyTruthMode();
  }
}

function applyTruthMode() {
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
  document.getElementById("truthSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function revealProtocol() {
  if (phase !== 1 || protocolRevealed) return;

  protocolRevealed = true;
  protocolBlank.hidden = true;
  protocolItem.hidden = false;
  protocolItem.classList.add("is-revealing");
}

function handlePlaylistClick(event) {
  if (phase !== 0 || !event.target.classList.contains("playlist-item")) return;

  playlistClicks += 1;
  if (playlistClicks >= 5) {
    showAlteration(1);
  }
}

function activateProtocol() {
  if (phase === 1 && protocolRevealed) {
    showAlteration(2);
  }
}

function toggleVideo() {
  if (phase < 2) return;

  videoPlaying = !videoPlaying;
  videoToggle.textContent = videoPlaying ? "停止" : "再生";
  videoPanel.classList.toggle("is-playing", videoPlaying);

  if (videoPlaying) {
    videoTimer = window.setInterval(tickVideo, 100);
  } else {
    window.clearInterval(videoTimer);
  }
}

function tickVideo() {
  videoCurrentTime += 0.1;
  if (videoCurrentTime >= 30) {
    videoCurrentTime = 0;
  }
  updateVideoDisplay();
}

function updateVideoDisplay() {
  const seconds = Math.floor(videoCurrentTime).toString().padStart(2, "0");
  videoTime.textContent = `00:${seconds} / 00:30`;
  videoProgress.style.width = `${(videoCurrentTime / 30) * 100}%`;

  const inAnomaly = videoCurrentTime >= ANOMALY_START && videoCurrentTime <= ANOMALY_END;
  tvOverlay.classList.toggle("is-visible", inAnomaly);
}

function handleVideoPanelClick() {
  const pausedNearAnomaly = !videoPlaying && videoCurrentTime >= ANOMALY_START - 0.8 && videoCurrentTime <= ANOMALY_END + 0.8;
  if (phase === 2 && pausedNearAnomaly) {
    showAlteration(3);
  }
}

function seekVideo(event) {
  if (phase < 2) return;

  event.stopPropagation();
  const rect = videoTrack.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  videoCurrentTime = ratio * 30;
  updateVideoDisplay();
}

function handleIntegrationClick() {
  if (phase !== 3) return;

  integrationClicks += 1;
  integrationCount.textContent = `${integrationClicks}/5`;

  if (integrationClicks >= 5) {
    hiddenInstitute.hidden = false;
    hiddenInstitute.classList.add("is-visible");
    hiddenLog.classList.add("is-visible");
  }
}

function activateInstitute() {
  if (phase === 3 && integrationClicks >= 5) {
    showAlteration(4);
  }
}

function shareToX() {
  const text = `${CONFIG.shareText}\n\n${CONFIG.shareUrl}`;
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener,noreferrer");
}

protocolBlank.addEventListener("click", revealProtocol);
protocolItem.addEventListener("click", activateProtocol);
playlistList.addEventListener("click", handlePlaylistClick);
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
integrationButton.addEventListener("click", handleIntegrationClick);
hiddenInstitute.addEventListener("click", activateInstitute);
shareButton.addEventListener("click", shareToX);
noiseOverlay.addEventListener("click", handleNoiseOverlayClick);

applyPhase();
