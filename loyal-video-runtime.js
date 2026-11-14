/* LOYAL TATTOO VIDEO RUNTIME v1.0 | GitHub */
(function (w, d) {
  'use strict';
  if (!/^(www\.)?bavariancustomirons\.jp$/.test(location.hostname)) return;
  var KEY = '__LOYAL_VIDEO_RUNTIME_V1__';
  if (w[KEY]) { w[KEY].scan(); return; }
  var DEFAULT_ID = '-M8B3dFWKjQ';
  var PATTERN = /^\[\[LOYAL-VIDEO:([\w-]{11})(?::(9x16|16x9))?\]\]$/i;
  var seq = 0, apiPromise = null, active = null;
  var CSS =
    '.lvr-widget{box-sizing:border-box;clear:both;max-width:760px;width:100%;margin:26px auto 36px;padding:16px 12px;background:#fff;border:1px solid #ddd;border-radius:15px;color:#171717;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;text-align:center}' +
    '.lvr-widget *{box-sizing:border-box}' +
    '.lvr-widget .lvr-title{font-size:clamp(19px,4vw,26px);font-weight:800;line-height:1.4;margin:0 0 4px}' +
    '.lvr-widget .lvr-sub{margin:0 0 15px;color:#777;font-size:11px;letter-spacing:.04em}' +
    '.lvr-widget .lvr-stage{position:relative;width:100%;max-width:405px;aspect-ratio:9/16;background:#111;overflow:hidden;border-radius:9px;margin:0 auto}' +
    '.lvr-widget .lvr-stage[data-ratio="16x9"]{max-width:680px;aspect-ratio:16/9}' +
    '.lvr-widget .lvr-stage iframe{position:absolute;inset:0;width:100%;height:100%;display:block;border:0}' +
    '.lvr-widget .lvr-cover{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background-color:#171717;background-size:cover;background-position:center;z-index:2}' +
    '.lvr-widget .lvr-play{display:flex;justify-content:center;align-items:center;width:80px;height:80px;border:2px solid #fff;border-radius:50%;background:rgba(0,0,0,.35);color:#fff;cursor:pointer;font:32px Arial,sans-serif}' +
    '.lvr-widget .lvr-message{font-size:12px;line-height:1.6;min-height:19px;color:#666;margin:11px auto}' +
    '.lvr-widget .lvr-sound{font:700 12px Arial,sans-serif;min-height:38px;padding:7px 17px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#222;cursor:pointer}' +
    '.lvr-widget .lvr-sound:disabled{opacity:.45;cursor:default}' +
    '.lvr-widget .lvr-link{display:block;max-width:405px;margin:12px auto 0;padding:12px;border:1px solid #ccc;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none!important;color:#191919!important}' +
    '.lvr-widget a:focus-visible,.lvr-widget button:focus-visible{outline:3px solid #777;outline-offset:3px}' +
    '@media(max-width:480px){.lvr-widget{padding:11px 8px;margin:22px auto 30px}.lvr-widget .lvr-play{width:70px;height:70px}}';

  function elt(tag, cls, txt) {
    var n = d.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  }
  function put(p, n) { p.appendChild(n); return n; }
  function cssOnce() {
    if (d.getElementById('loyal-video-runtime-style')) return;
    var s = elt('style'); s.id = 'loyal-video-runtime-style'; s.textContent = CSS;
    put(d.head || d.documentElement, s);
  }
  function getAPI() {
    if (w.YT && typeof w.YT.Player === 'function') return Promise.resolve(w.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve, reject) {
      var existing = d.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      var s = existing || elt('script');
      if (!existing) {
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        (d.head || d.body || d.documentElement).appendChild(s);
      }
      var tries = 0;
      var poll = setInterval(function () {
        if (w.YT && typeof w.YT.Player === 'function') {
          clearInterval(poll); resolve(w.YT);
        } else if (++tries >= 75) {
          clearInterval(poll); reject(new Error('YouTube API timeout'));
        }
      }, 200);
    });
    return apiPromise;
  }
  function validVideo(s) { return /^[A-Za-z0-9_-]{11}$/.test(s || ''); }
  function render(mount, id, ratio) {
    if (!mount || mount.getAttribute('data-lvr-initialized') === '1' || !validVideo(id)) return;
    mount.setAttribute('data-lvr-initialized', '1');
    cssOnce();
    ratio = ratio === '16x9' ? '16x9' : '9x16';
    var root = put(mount, elt('section', 'lvr-widget'));
    root.setAttribute('aria-label', 'LOYAL TATTOO 動画作品');
    put(root, elt('h2', 'lvr-title', 'LOYAL TATTOO VIDEO'));
    put(root, elt('p', 'lvr-sub', 'OFFICIAL TATTOO VIDEO'));
    var stage = put(root, elt('div', 'lvr-stage'));
    stage.setAttribute('data-ratio', ratio);
    var slot = put(stage, elt('div'));
    slot.id = 'loyal-video-player-' + (++seq);
    var cover = put(stage, elt('div', 'lvr-cover'));
    cover.style.backgroundImage = 'url("https://i.ytimg.com/vi/' + id + '/hqdefault.jpg")';
    var button = put(cover, elt('button', 'lvr-play', '▶'));
    button.type = 'button'; button.setAttribute('aria-label', '動画を再生');
    var status = put(root, elt('p', 'lvr-message', '画面内に入ると無音で自動再生します。'));
    status.setAttribute('aria-live', 'polite');
    var sound = put(root, elt('button', 'lvr-sound', '音声をオンにする'));
    sound.type = 'button'; sound.disabled = true;
    var original = put(root, elt('a', 'lvr-link', 'YouTubeで元動画を開く'));
    original.href = (ratio === '9x16' ? 'https://www.youtube.com/shorts/' : 'https://www.youtube.com/watch?v=') + id;
    original.target = '_blank'; original.rel = 'noopener noreferrer';
    var player = null, ready = false, visible = false, requested = false, manual = false;
    var self = { pause: function () { if (ready) try { player.pauseVideo(); } catch (e) {} } };
    function msg(t) { status.textContent = t; }
    function canPlay() { return (visible || manual) && !d.hidden; }
    function sync() {
      if (!ready) return;
      try {
        if (canPlay()) {
          if (active && active !== self) active.pause();
          active = self;
          player.playVideo();
        } else player.pauseVideo();
      } catch (e) {}
    }
    function init() {
      if (player) return;
      try {
        player = new w.YT.Player(slot, {
          videoId: id,
          playerVars: {
            autoplay: 0, mute: 1, playsinline: 1,
            controls: 1, rel: 0, loop: 1, playlist: id,
            origin: location.origin
          },
          events: {
            onReady: function (e) {
              ready = true;
              try {
                var iframe = e.target.getIframe();
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
                e.target.mute();
              } catch (err) { try { e.target.mute(); } catch (ignore) {} }
              sound.disabled = false;
              cover.style.display = 'none';
              msg('無音再生 / ループ再生に対応');
              sync();
            },
            onStateChange: function (e) {
              if (e.data === 1 && !canPlay()) self.pause();
              if (e.data === 0 && canPlay()) {
                try { e.target.seekTo(0, true); e.target.playVideo(); } catch (ignore) {}
              }
            },
            onAutoplayBlocked: function () {
              cover.style.display = 'none';
              msg('ブラウザによる自動再生制限：動画内の再生ボタンから視聴できます。');
            },
            onError: function () {
              cover.style.display = 'none';
              msg('埋め込み再生が制限されました。YouTubeリンクから視聴できます。');
            }
          }
        });
      } catch (e) { msg('プレーヤーの生成に失敗しました。YouTubeリンクをご利用いただけます。'); }
    }
    function load() {
      if (requested) { sync(); return; }
      requested = true;
      msg('動画を読み込んでいます。');
      getAPI().then(init).catch(function () {
        msg('動画の読み込みを確認できません。YouTubeリンクをご利用いただけます。');
      });
    }
    button.addEventListener('click', function () { manual = true; load(); sync(); });
    sound.addEventListener('click', function () {
      if (!ready) return;
      try {
        if (player.isMuted()) { player.unMute(); player.setVolume(70); sound.textContent = '音声をオフにする'; }
        else { player.mute(); sound.textContent = '音声をオンにする'; }
      } catch (e) {}
    });
    d.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.target !== stage) return;
          visible = entry.isIntersecting && entry.intersectionRatio >= 0.45;
          if (visible) load(); else { manual = false; sync(); }
        });
      }, { threshold: [0, 0.45, 0.75] });
      io.observe(stage);
    } else { visible = true; load(); }
  }
  function scanTokens() {
    var body = d.querySelector('.blog_body');
    if (!body) return;
    var candidates = body.querySelectorAll('p,h3,h4,li,div');
    for (var i = 0; i < candidates.length; i++) {
      var n = candidates[i];
      if (n.closest && n.closest('.lvr-widget')) continue;
      if (!n.parentNode || n.hasAttribute('data-lvr-initialized')) continue;
      var hit = (n.textContent || '').trim().match(PATTERN);
      if (!hit) continue;
      if (n.querySelector('iframe,video,img,script,.loyal-video-mount')) continue;
      var holder = elt('div', 'loyal-video-mount');
      holder.setAttribute('data-video', hit[1]);
      holder.setAttribute('data-ratio', hit[2] || '9x16');
      n.parentNode.replaceChild(holder, n);
    }
  }
  function scan() {
    if (!/^\/blog\//.test(location.pathname)) return;
    scanTokens();
    var mounts = d.querySelectorAll('.loyal-video-mount,#loyal-scar-shorts-mount,[data-loyal-video]');
    for (var i = 0; i < mounts.length; i++) {
      var m = mounts[i];
      var id = m.getAttribute('data-video') || m.getAttribute('data-loyal-video') || DEFAULT_ID;
      var ratio = m.getAttribute('data-ratio') || '9x16';
      render(m, id, ratio);
    }
  }
  w[KEY] = { scan: scan };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', scan, { once: true });
  else scan();
})(window, document);
