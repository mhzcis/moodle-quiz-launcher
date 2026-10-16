"use strict";

(function () {
  const CONFIG = Object.freeze({
    moodleBaseUrl: "https://moodle.unrwa.org/moodle",
    androidPackageName: "com.moodle.moodlemobile",
    androidStoreUrl: "https://play.google.com/store/apps/details?id=com.moodle.moodlemobile",
    iosStoreUrl: "https://apps.apple.com/app/moodle/id633359593",
    autoOpenDelayMs: 2000,
    fallbackDelayMs: 2200
  });

  const byId = (id) => document.getElementById(id);
  const params = new URLSearchParams(window.location.search);
  const quizId = (params.get("id") || "").trim();
  const quiz = window.QUIZZES && window.QUIZZES[quizId];

  function showMessage(title, text) {
    byId("loading-state").hidden = true;
    byId("quiz-state").hidden = true;
    byId("message-title").textContent = title;
    byId("message-text").textContent = text;
    byId("message-state").hidden = false;
    document.title = title;
  }

  if (!/^\d+$/.test(quizId) || !quiz) {
    showMessage("⚠️ الرابط غير صحيح", "تعذر العثور على الاختبار المطلوب. يرجى التأكد من استخدام الرابط الصحيح.");
    return;
  }

  if (quiz.active !== true) {
    showMessage("⛔ انتهت فترة الاختبار", "انتهت فترة إتاحة هذا الاختبار. يرجى التواصل مع المعلم عند الحاجة.");
    return;
  }

  const browserUrl = `${CONFIG.moodleBaseUrl}/mod/quiz/view.php?id=${encodeURIComponent(quizId)}`;
  const redirectUrl = encodeURIComponent(browserUrl);
  const moodleUrl = `moodlemobile://${CONFIG.moodleBaseUrl.replace(/^https?:\/\//, "")}?redirect=${redirectUrl}`;
  const androidIntentUrl = `intent://${CONFIG.moodleBaseUrl.replace(/^https?:\/\//, "")}?redirect=${redirectUrl}#Intent;scheme=moodlemobile;package=${CONFIG.androidPackageName};S.browser_fallback_url=${encodeURIComponent(browserUrl)};end`;

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function appUrl() {
    return isAndroid ? androidIntentUrl : moodleUrl;
  }

  function openApp() {
    window.location.href = appUrl();
  }

  byId("course").textContent = quiz.course;
  byId("quiz-title").textContent = quiz.title;
  const deadlineParts = String(quiz.deadline).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  byId("deadline").textContent = deadlineParts[0] || "";
  if (deadlineParts.length > 1) {
    byId("deadline-time").textContent = deadlineParts.slice(1).join(" ");
    byId("time-row").hidden = false;
  }
  byId("duration").textContent = quiz.duration;
  byId("attempts").textContent = quiz.attempts;
  byId("browser-link").href = browserUrl;
  byId("store-link").href = isIOS ? CONFIG.iosStoreUrl : CONFIG.androidStoreUrl;
  byId("store-link").textContent = isIOS ? "🍎 تثبيت Moodle من App Store" : "▶️ تثبيت Moodle من Google Play";

  byId("open-app-primary").addEventListener("click", openApp);

  document.title = quiz.title;
  byId("loading-state").hidden = true;
  byId("quiz-state").hidden = false;

  let seconds = Math.ceil(CONFIG.autoOpenDelayMs / 1000);
  byId("countdown").textContent = String(seconds);
  const countdownTimer = window.setInterval(() => {
    seconds -= 1;
    if (seconds > 0) byId("countdown").textContent = String(seconds);
  }, 1000);

  let pageHidden = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pageHidden = true;
  });
  window.addEventListener("pagehide", () => { pageHidden = true; });

  window.setTimeout(() => {
    window.clearInterval(countdownTimer);
    openApp();

    window.setTimeout(() => {
      if (!pageHidden) {
        byId("auto-open").hidden = true;
        byId("open-app-primary").hidden = false;
        byId("browser-hint").hidden = false;
        byId("fallbacks").hidden = false;
      }
    }, CONFIG.fallbackDelayMs);
  }, CONFIG.autoOpenDelayMs);
})();
