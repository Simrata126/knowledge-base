(function () {
  var KB = window.KB;
  var state = { q: "", tag: null, pstatus: "all" };

  var all = []
    .concat(KB.projects.map(function (x) { x.kind = "project"; return x; }))
    .concat(KB.learnings.map(function (x) { x.kind = "learning"; return x; }))
    .concat(KB.papers.map(function (x) { x.kind = "paper"; return x; }));
  var byId = {};
  all.forEach(function (x) { byId[x.id] = x; });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  // header
  $("siteName").textContent = KB.site.name;
  $("siteTitle").textContent = KB.site.title;
  $("siteTagline").textContent = KB.site.tagline;
  document.title = KB.site.name + " | " + KB.site.title;
  $("siteLinks").innerHTML = (KB.site.links || []).map(function (l) {
    return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
  }).join("");

  var readCount = KB.papers.filter(function (p) { return p.status === "read"; }).length;
  $("stats").innerHTML = [
    [KB.projects.length, "projects"],
    [KB.papers.length, "papers (" + readCount + " read)"],
    [KB.learnings.length, "learnings"],
    [Object.keys(tagCounts()).length, "topics"]
  ].map(function (s) { return '<div class="stat"><b>' + s[0] + "</b><span>" + s[1] + "</span></div>"; }).join("");

  function tagCounts() {
    var c = {};
    all.forEach(function (x) { (x.tags || []).forEach(function (t) { c[t] = (c[t] || 0) + 1; }); });
    return c;
  }

  function renderChips() {
    var c = tagCounts();
    var tags = Object.keys(c).sort(function (a, b) { return c[b] - c[a] || a.localeCompare(b); });
    $("tagChips").innerHTML = tags.map(function (t) {
      return '<button class="chip' + (state.tag === t ? " on" : "") + '" data-tag="' + esc(t) + '">' +
        esc(t) + " " + c[t] + "</button>";
    }).join("");
  }

  function matches(x) {
    if (state.tag && (x.tags || []).indexOf(state.tag) < 0) return false;
    if (!state.q) return true;
    var hay = [x.title, x.summary, x.authors, x.venue, (x.tags || []).join(" "), (x.takeaways || []).join(" ")]
      .join(" ").toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function tagsHtml(x) {
    return '<div class="tags">' + (x.tags || []).map(function (t) {
      return '<button class="tag" data-tag="' + esc(t) + '">#' + esc(t) + "</button>";
    }).join("") + "</div>";
  }
  function relHtml(x) {
    var rel = (x.related || []).filter(function (id) { return byId[id]; });
    if (!rel.length) return "";
    return '<div class="rel">Related:' + rel.map(function (id) {
      return '<a data-go="' + esc(id) + '">' + esc(byId[id].title) + "</a>";
    }).join("") + "</div>";
  }
  function linksHtml(links) {
    if (!links || !links.length) return "";
    return '<div class="alinks">' + links.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("") + "</div>";
  }

  function projectCard(p) {
    return '<article class="card" id="' + esc(p.id) + '"><div class="meta"><span class="badge">' + esc(p.status || "") +
      "</span></div><h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p>" +
      tagsHtml(p) + linksHtml(p.links) + relHtml(p) + "</article>";
  }
  function paperCard(p) {
    var stars = p.rating ? " " + "\u2605".repeat(p.rating) + "\u2606".repeat(5 - p.rating) : "";
    var title = p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>" : esc(p.title);
    var take = (p.takeaways && p.takeaways.length)
      ? '<ul class="take">' + p.takeaways.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "";
    return '<article class="card" id="' + esc(p.id) + '"><div class="meta"><span class="badge">' + esc(p.status) + "</span>" +
      esc([p.authors, p.year, p.venue].filter(Boolean).join(" \u00b7 ")) + esc(stars) + "</div><h3>" + title + "</h3>" +
      take + tagsHtml(p) + relHtml(p) + "</article>";
  }
  function learningCard(l) {
    return '<article class="card" id="' + esc(l.id) + '"><div class="meta">' + esc(l.date || "") + "</div><h3>" + esc(l.title) +
      "</h3><p>" + esc(l.summary) + "</p>" + tagsHtml(l) + relHtml(l) + "</article>";
  }

  function render() {
    var ps = KB.projects.filter(matches);
    var rs = KB.papers.filter(matches).filter(function (p) { return state.pstatus === "all" || p.status === state.pstatus; });
    var ls = KB.learnings.filter(matches).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    $("projectsList").innerHTML = ps.map(projectCard).join("");
    $("papersList").innerHTML = rs.map(paperCard).join("");
    $("learningsList").innerHTML = ls.map(learningCard).join("");
    $("cProjects").textContent = ps.length;
    $("cPapers").textContent = rs.length;
    $("cLearnings").textContent = ls.length;
    $("projects").hidden = !ps.length;
    $("papers").hidden = !rs.length && state.pstatus === "all";
    $("learnings").hidden = !ls.length;
    $("empty").hidden = !!(ps.length || rs.length || ls.length);
    renderChips();
  }

  function go(id) {
    state.q = ""; state.tag = null; state.pstatus = "all";
    $("search").value = "";
    document.querySelectorAll("#paperStatus button").forEach(function (b) { b.classList.toggle("on", b.dataset.s === "all"); });
    render();
    var el = $(id);
    if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("flash"); setTimeout(function () { el.classList.remove("flash"); }, 1700); }
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tag],[data-go],#paperStatus button");
    if (!t) return;
    if (t.dataset.go) return go(t.dataset.go);
    if (t.dataset.tag) { state.tag = state.tag === t.dataset.tag ? null : t.dataset.tag; return render(); }
    if (t.dataset.s) {
      state.pstatus = t.dataset.s;
      document.querySelectorAll("#paperStatus button").forEach(function (b) { b.classList.toggle("on", b === t); });
      render();
    }
  });
  $("search").addEventListener("input", function (e) { state.q = e.target.value.trim(); render(); });

  render();
})();
