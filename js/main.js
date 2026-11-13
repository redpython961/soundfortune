/* =========================================================
   Sound Fortune Productions — main.js
   Vanilla JS, no dependencies. The only external script loaded
   (on demand) is the official SoundCloud Widget API, which powers
   the custom audio players.
   ========================================================= */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

  /* ---------------------------------------------------------
     1. Graceful fallback for any missing image
     --------------------------------------------------------- */
  $$("img").forEach(function (img) {
    function fail() {
      img.classList.add("is-missing");
      if (img.parentElement) img.parentElement.classList.add("has-missing");
    }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) fail();
    img.addEventListener("error", fail, { once: true });
  });

  /* ---------------------------------------------------------
     2. Navigation: scrolled state, mobile menu, active section
     --------------------------------------------------------- */
  var nav = $("#nav");
  var toggle = $("#navToggle");
  var fab = $("#fabTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("is-scrolled", y > 24);
    fab.classList.toggle("is-visible", y > window.innerHeight * 0.9);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    doc.body.classList.remove("is-locked");
  }
  toggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("is-locked", open);
  });
  $$("[data-nav]").forEach(function (a) { a.addEventListener("click", closeMenu); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 960) closeMenu(); });

  // Active section indicator
  var links = $$("[data-nav]");
  var sections = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
  setActive("home");

  /* ---------------------------------------------------------
     3. Reveal-on-scroll with light staggering
     --------------------------------------------------------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    // stagger siblings that share a parent
    var groups = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement;
      var n = groups.get(p) || 0;
      el.style.setProperty("--d", Math.min(n * 0.08, 0.48) + "s");
      groups.set(p, n + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------------------------------------------------
     4. Subtle parallax (rAF, transform-only)
     --------------------------------------------------------- */
  var parallax = $$("[data-parallax]");
  if (parallax.length && !reduceMotion.matches) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      parallax.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------------------------------------------------------
     5. Hover details: card spotlight + poster tilt
     --------------------------------------------------------- */
  $$(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
  if (window.matchMedia("(hover: hover)").matches && !reduceMotion.matches) {
    $$(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(1000px) rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 6).toFixed(2) + "deg)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------
     6. Video lightbox (YouTube privacy-enhanced embeds)
     --------------------------------------------------------- */
  var lb = $("#lightbox");
  var lbFrame = $("#lightboxFrame");
  var lbTitle = $("#lightboxTitle");
  var lastFocus = null;

  function openVideo(id, title) {
    Players.pauseAll();
    lastFocus = doc.activeElement;
    lbTitle.textContent = title || "";
    var iframe = doc.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    iframe.title = title || "Video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    lbFrame.innerHTML = "";
    lbFrame.appendChild(iframe);
    lb.hidden = false;
    doc.body.classList.add("is-locked");
    $(".lightbox__close", lb).focus();
  }
  function closeVideo() {
    lb.hidden = true;
    lbFrame.innerHTML = "";
    doc.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () { openVideo(btn.getAttribute("data-video"), btn.getAttribute("data-title")); });
  });
  $$("[data-close]", lb).forEach(function (el) { el.addEventListener("click", closeVideo); });
  doc.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeVideo();
    if (e.key === "Tab") { e.preventDefault(); $(".lightbox__close", lb).focus(); } // simple focus trap
  });

  /* ---------------------------------------------------------
     7. Copy email
     --------------------------------------------------------- */
  $$("[data-copy]").forEach(function (btn) {
    var hint = $(".copy__hint", btn);
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () { hint.textContent = "Copied"; setTimeout(function () { hint.textContent = "Copy"; }, 1800); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = "mailto:" + text; });
      } else {
        window.location.href = "mailto:" + text;
      }
    });
  });

  /* ---------------------------------------------------------
     8. Custom audio players (SoundCloud Widget API engine)
     --------------------------------------------------------- */
  var ICONS = {
    play: '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    vol: '<svg class="i-vol" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    muted: '<svg class="i-muted" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
  };

  function fmt(ms) {
    if (!isFinite(ms) || ms <= 0) return "0:00";
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }

  // Deterministic pseudo-waveform per track (visual only)
  function makePeaks(seed, n) {
    var x = seed * 9301 + 49297, peaks = [];
    function rnd() { x = (x * 9301 + 49297) % 233280; return x / 233280; }
    for (var i = 0; i < n; i++) {
      var t = i / n;
      var env = 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.75 + 0.25 * Math.sin(t * 18 + seed));
      peaks.push(Math.max(0.12, Math.min(1, env * (0.55 + rnd() * 0.6))));
    }
    return peaks;
  }

  var apiPromise = null;
  function loadApi() {
    if (window.SC && window.SC.Widget) return Promise.resolve();
    if (apiPromise) return apiPromise;
    apiPromise = new Promise(function (resolve, reject) {
      var s = doc.createElement("script");
      s.src = "https://w.soundcloud.com/player/api.js";
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { apiPromise = null; reject(new Error("SoundCloud API failed to load")); };
      doc.head.appendChild(s);
    });
    return apiPromise;
  }

  var Players = {
    list: [],
    pauseAll: function (except) { this.list.forEach(function (p) { if (p !== except) p.pause(); }); }
  };

  function Player(el) {
    var self = this;
    this.el = el;
    this.project = el.closest(".project");
    this.trackUrl = el.getAttribute("data-track");
    this.title = el.getAttribute("data-title");
    this.artist = el.getAttribute("data-artist");
    this.seed = parseInt(el.getAttribute("data-seed"), 10) || 1;
    this.accent = (this.project && this.project.getAttribute("data-accent")) || "#9B5CFF";
    this.peaks = makePeaks(this.seed, 140);
    this.duration = 0; this.position = 0; this.hover = -1;
    this.volume = 80; this.muted = false; this.playing = false;
    this.widget = null; this.ready = false; this.wantPlay = false;

    if (this.project) this.project.style.setProperty("--pa", this.accent);
    el.style.setProperty("--pa", this.accent);

    el.innerHTML =
      '<div class="player__top">' +
        '<button class="player__btn" type="button" aria-label="Play ' + this.title + ' by ' + this.artist + '">' + ICONS.play + ICONS.pause + '</button>' +
        '<div class="player__titles"><p class="player__track">' + this.title + '</p><p class="player__artist">' + this.artist + '</p></div>' +
        '<div class="player__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
      '</div>' +
      '<div class="player__wave" role="slider" tabindex="0" aria-label="Seek ' + this.title + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0:00"><canvas></canvas></div>' +
      '<div class="player__bottom">' +
        '<span class="player__time"><span data-cur>0:00</span> / <span data-dur>--:--</span></span>' +
        '<span class="player__vol">' +
          '<button class="player__mute" type="button" aria-label="Mute">' + ICONS.vol + ICONS.muted + '</button>' +
          '<input class="range" type="range" min="0" max="100" value="80" aria-label="Volume">' +
        '</span>' +
        '<a class="player__ext" href="#" target="_blank" rel="noopener" hidden>SoundCloud ' + ICONS.ext + '</a>' +
      '</div>' +
      '<p class="player__err" role="status"></p>' +
      '<div class="player__engine"></div>';

    this.btn = $(".player__btn", el);
    this.wave = $(".player__wave", el);
    this.canvas = $("canvas", el);
    this.ctx = this.canvas.getContext("2d");
    this.cur = $("[data-cur]", el);
    this.dur = $("[data-dur]", el);
    this.range = $(".range", el);
    this.muteBtn = $(".player__mute", el);
    this.ext = $(".player__ext", el);
    this.err = $(".player__err", el);
    this.engine = $(".player__engine", el);

    this.btn.addEventListener("click", function () { self.toggle(); });
    this.range.addEventListener("input", function () { self.setVolume(+self.range.value); });
    this.muteBtn.addEventListener("click", function () { self.setMuted(!self.muted); });

    // seeking (click / drag / keyboard)
    var dragging = false;
    function ratioFrom(e) { var r = self.wave.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); }
    this.wave.addEventListener("pointerdown", function (e) { dragging = true; self.wave.setPointerCapture(e.pointerId); self.hover = ratioFrom(e); self.draw(); });
    this.wave.addEventListener("pointermove", function (e) { self.hover = ratioFrom(e); self.draw(); });
    this.wave.addEventListener("pointerup", function (e) { if (dragging) { dragging = false; self.seek(ratioFrom(e)); } });
    this.wave.addEventListener("pointerleave", function () { if (!dragging) { self.hover = -1; self.draw(); } });
    this.wave.addEventListener("keydown", function (e) {
      if (!self.duration) return;
      var step = 5000;
      if (e.key === "ArrowRight") { e.preventDefault(); self.seek((self.position + step) / self.duration); }
      if (e.key === "ArrowLeft") { e.preventDefault(); self.seek((self.position - step) / self.duration); }
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); self.toggle(); }
    });

    window.addEventListener("resize", function () { self.resize(); });
    this.resize();
    Players.list.push(this);
  }

  Player.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this.wave.clientWidth, h = this.wave.clientHeight;
    if (!w) return;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  };

  Player.prototype.draw = function () {
    var c = this.ctx, w = this.wave.clientWidth, h = this.wave.clientHeight;
    if (!w) return;
    c.clearRect(0, 0, w, h);
    var gap = 2, bw = Math.max(2, (w - gap * 80) / 80);
    var bars = Math.floor(w / (bw + gap));
    var prog = this.duration ? this.position / this.duration : 0;
    var t = performance.now() / 1000;
    var grad = c.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#D4BCFF"); grad.addColorStop(0.5, this.accent); grad.addColorStop(1, "#7A3CF0");
    for (var i = 0; i < bars; i++) {
      var p = this.peaks[Math.floor(i / bars * this.peaks.length)];
      if (this.playing && !reduceMotion.matches) p *= 0.86 + 0.14 * Math.sin(t * 6 + i * 0.55);
      var bh = Math.max(3, p * h);
      var x = i * (bw + gap), y = (h - bh) / 2;
      var r = i / bars;
      if (r < prog) c.fillStyle = grad;
      else if (this.hover >= 0 && r < this.hover) c.fillStyle = "rgba(183,138,255,.45)";
      else c.fillStyle = "rgba(212,188,255,.18)";
      roundRect(c, x, y, bw, bh, Math.min(bw / 2, 2));
    }
    // playhead
    if (prog > 0) {
      c.fillStyle = "#fff";
      c.fillRect(Math.round(prog * w) - 1, 4, 2, h - 8);
    }
  };
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.fill();
  }

  Player.prototype.loop = function () {
    var self = this;
    if (this._raf) return;
    var tick = function () {
      self.draw();
      self._raf = self.playing ? requestAnimationFrame(tick) : null;
    };
    this._raf = requestAnimationFrame(tick);
  };

  // Create the hidden SoundCloud widget for this player
  Player.prototype.init = function () {
    var self = this;
    if (this._init) return this._init;
    this._init = loadApi().then(function () {
      return new Promise(function (resolve) {
        var iframe = doc.createElement("iframe");
        iframe.title = "SoundCloud audio engine: " + self.title;
        iframe.allow = "autoplay";
        iframe.src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(self.trackUrl) +
          "&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false&color=%239b5cff";
        self.engine.appendChild(iframe);
        var W = window.SC.Widget, E = W.Events;
        var widget = W(iframe);
        self.widget = widget;
        widget.bind(E.READY, function () {
          self.ready = true;
          widget.setVolume(self.muted ? 0 : self.volume);
          widget.getDuration(function (d) { self.setDuration(d); });
          widget.getCurrentSound(function (s) {
            if (s && s.permalink_url) { self.ext.href = s.permalink_url; self.ext.hidden = false; }
            if (s && s.duration) self.setDuration(s.duration);
          });
          resolve();
          if (self.wantPlay) widget.play();
        });
        widget.bind(E.PLAY, function () {
          clearTimeout(self._guard);
          Players.pauseAll(self);
          self.setPlaying(true);
          self.el.classList.remove("is-loading");
        });
        widget.bind(E.PAUSE, function () { self.setPlaying(false); });
        widget.bind(E.FINISH, function () { self.setPlaying(false); self.position = 0; self.updateTime(); self.draw(); });
        widget.bind(E.PLAY_PROGRESS, function (e) {
          self.position = e.currentPosition;
          if (!self.duration && e.relativePosition) self.setDuration(e.currentPosition / e.relativePosition);
          self.updateTime();
        });
        widget.bind(E.ERROR, function () { self.fail("This track couldn't be streamed right now."); });
      });
    }).catch(function () {
      self._init = null;
      self.fail("Audio player unavailable — check your connection.");
      throw new Error("sc");
    });
    return this._init;
  };

  Player.prototype.setDuration = function (d) {
    if (!d || d <= 0) return;
    this.duration = d;
    this.dur.textContent = fmt(d);
    this.draw();
  };
  Player.prototype.updateTime = function () {
    this.cur.textContent = fmt(this.position);
    var pct = this.duration ? Math.round(this.position / this.duration * 100) : 0;
    this.wave.setAttribute("aria-valuenow", pct);
    this.wave.setAttribute("aria-valuetext", fmt(this.position) + " of " + fmt(this.duration));
  };
  Player.prototype.setPlaying = function (on) {
    this.playing = on;
    this.el.classList.toggle("is-playing", on);
    if (this.project) this.project.classList.toggle("is-playing", on);
    this.btn.setAttribute("aria-label", (on ? "Pause " : "Play ") + this.title + " by " + this.artist);
    if (on) this.loop(); else this.draw();
  };
  Player.prototype.fail = function (msg) {
    var self = this;
    this.el.classList.remove("is-loading");
    this.el.classList.add("has-error");
    this.err.innerHTML = msg + ' <a href="' + (this.ext.href && this.ext.href !== "#" ? this.ext.href : "https://soundcloud.com") + '" target="_blank" rel="noopener" style="color:#D4BCFF;text-decoration:underline">Listen on SoundCloud</a>';
    setTimeout(function () { self.el.classList.remove("has-error"); }, 8000);
  };
  // If the browser blocks programmatic playback (some mobile browsers),
  // reveal the official SoundCloud player so the visitor can tap it directly.
  Player.prototype.revealEngine = function () {
    this.el.classList.remove("is-loading");
    this.engine.classList.add("is-visible");
    this.err.textContent = "Your browser needs one more tap — use the SoundCloud player below.";
    this.el.classList.add("has-error");
  };

  Player.prototype.play = function () {
    var self = this;
    Players.pauseAll(this);
    this.wantPlay = true;
    this.el.classList.add("is-loading");
    this.init().then(function () {
      if (!self.wantPlay) return;
      self.widget.play();
      clearTimeout(self._guard);
      self._guard = setTimeout(function () { if (!self.playing && self.wantPlay) self.revealEngine(); }, 4500);
    }, function () {});
  };
  Player.prototype.pause = function () {
    this.wantPlay = false;
    clearTimeout(this._guard);
    this.el.classList.remove("is-loading");
    if (this.widget && this.ready) this.widget.pause();
    if (this.playing) this.setPlaying(false);
  };
  Player.prototype.toggle = function () { if (this.playing || this.wantPlay) this.pause(); else this.play(); };
  Player.prototype.seek = function (ratio) {
    var self = this;
    ratio = Math.min(1, Math.max(0, ratio));
    this.init().then(function () {
      var go = function () {
        self.position = ratio * self.duration;
        self.widget.seekTo(self.position);
        self.updateTime(); self.draw();
      };
      if (self.duration) go(); else self.widget.getDuration(function (d) { self.setDuration(d); go(); });
    }, function () {});
  };
  Player.prototype.setVolume = function (v) {
    this.volume = v;
    this.range.style.setProperty("--v", v + "%");
    if (v > 0 && this.muted) this.setMuted(false);
    if (this.widget && this.ready && !this.muted) this.widget.setVolume(v);
  };
  Player.prototype.setMuted = function (m) {
    this.muted = m;
    this.el.classList.toggle("is-muted", m);
    this.muteBtn.setAttribute("aria-label", m ? "Unmute" : "Mute");
    if (this.widget && this.ready) this.widget.setVolume(m ? 0 : this.volume);
  };

  var playerEls = $$(".player[data-track]");
  playerEls.forEach(function (el) { new Player(el); });

  // Warm up the SoundCloud widgets when the music section approaches,
  // so durations show and the first press responds instantly.
  var music = $("#music");
  if (music && "IntersectionObserver" in window) {
    var warm = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        warm.disconnect();
        Players.list.forEach(function (p, i) { setTimeout(function () { p.init().catch(function () {}); }, i * 250); });
      }
    }, { rootMargin: "400px 0px" });
    warm.observe(music);
  }

  // Pause audio if the tab is hidden for a video lightbox, etc. (keeps one-at-a-time rule tidy)
  window.Players = Players;
})();
