let phase = 0;

const ASSET_BASE_URL = "https://pub-3d61cedd944c41198454cfdf476e04a9.r2.dev/images";

const body = document.body;
const noiseOverlay = document.getElementById("noise-overlay");
const speakerToggle = document.getElementById("speakerToggle");
const speakerIcon = document.getElementById("speakerIcon");
const speakerStatus = document.getElementById("speakerStatus");
const speakerImage = document.getElementById("speakerImage");
const speakerText = document.getElementById("speakerText");
const tvTrigger = document.getElementById("tvTrigger");
const tvImage = document.getElementById("tvImage");
const tvText = document.getElementById("tvText");
const hiddenAiButton = document.getElementById("hiddenAiButton");
const hiddenLog = document.getElementById("hiddenLog");
const aiImage = document.getElementById("aiImage");
const assistantText = document.getElementById("assistantText");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchHint = document.getElementById("searchHint");
const devicesImage = document.getElementById("devicesImage");
const planText = document.getElementById("planText");
const shareButton = document.getElementById("shareButton");

let speakerPlaying = false;
let speakerStopCount = 0;
let noiseNextAction = null;

function assetUrl(fileName) {
  return `${ASSET_BASE_URL}/${fileName}`;
}

function showGlitch(nextPhase) {
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
    speakerText.textContent = "停止後も、短い通知音が残ることがあります。HOMURAは環境音の乱れを補正しています。";
    tvTrigger.disabled = false;
    tvTrigger.textContent = "映像プレビューを開く";
  }

  if (phase >= 2) {
    tvImage.src = assetUrl("img_tv_frame_glitch_800x600.png");
    tvText.textContent = "プレビューの一部に未処理フレームが含まれています。視聴ログとの差分を再同期してください。";
    hiddenAiButton.disabled = false;
    hiddenAiButton.textContent = "非表示ログを確認";
  }

  if (phase >= 3) {
    aiImage.src = assetUrl("img_ai_hidden_800x600.png");
    assistantText.textContent = "HOMURA AIは、快適さのために行動予測を利用します。予測は提案として表示されます。";
    hiddenLog.classList.add("is-visible");
    searchInput.placeholder = "誘導 設定 解除";
    searchHint.textContent = "検索結果はHOMURA安全性ポリシーにより再構成される場合があります。";
    planText.textContent = "検索で詳細な管理画面へ移動できます。";
  }

  if (phase === 4) {
    devicesImage.src = assetUrl("img_devices_truth_1200x800.png");
    document.querySelector(".hero-media").style.backgroundImage = `url('${assetUrl("img_hero_truth_1200x500.png")}')`;
    document.getElementById("truthSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function toggleSpeaker() {
  if (noiseNextAction !== null) return;

  speakerPlaying = !speakerPlaying;
  speakerIcon.textContent = speakerPlaying ? "■" : "▶";
  speakerStatus.textContent = speakerPlaying ? "音声ガイドを停止" : "音声ガイドを再生";

  if (!speakerPlaying) {
    speakerStopCount += 1;
    speakerStatus.textContent = `停止しました (${speakerStopCount}/5)`;
  }

  if (speakerStopCount >= 5 && phase === 0) {
    showGlitch(1);
  }
}

function triggerTvPhase() {
  if (phase === 1) showGlitch(2);
}

function triggerAiPhase() {
  if (phase === 2) showGlitch(3);
}

function triggerTruth(event) {
  event.preventDefault();
  if (phase === 3) {
    showGlitch(4);
  } else {
    searchHint.textContent = "検索を続けるには、まずデバイスの違和感を確認してください。";
  }
}

function shareToX() {
  const text = `${CONFIG.shareText}\n\n${CONFIG.shareUrl}`;
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener,noreferrer");
}

speakerToggle.addEventListener("click", toggleSpeaker);
tvTrigger.addEventListener("click", triggerTvPhase);
hiddenAiButton.addEventListener("click", triggerAiPhase);
searchForm.addEventListener("submit", triggerTruth);
shareButton.addEventListener("click", shareToX);
noiseOverlay.addEventListener("click", handleNoiseOverlayClick);

applyPhase();
