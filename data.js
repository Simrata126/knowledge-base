/* ------------------------------------------------------------------
   YOUR CONTENT LIVES HERE. Edit this file; the site rebuilds itself.
   - "id" must be unique. Use it in "related" to crosslink any two items
     (projects, learnings and papers can all point at each other).
   - "tags" drive the filter chips and the topic map.
   - Delete the sample entries and add your own.
------------------------------------------------------------------- */
window.KB = {
  site: {
    name: "Your Name",
    title: "Projects, Learnings & Reading Notes",
    tagline: "One place to track what I build, what I learn, and what I read.",
    links: [
      { label: "GitHub", url: "https://github.com/your-username" },
      { label: "Blog", url: "https://example.com" }
    ]
  },

  projects: [
    {
      id: "p-homelab",
      title: "Homelab Monitoring Stack",
      summary: "Prometheus + Grafana dashboards for my home network, with alerting on disk and temperature.",
      status: "active",            // idea | active | done | paused
      tags: ["devops", "monitoring"],
      links: [{ label: "Repo", url: "https://github.com/your-username/homelab" }],
      related: ["l-cardinality", "r-dapper"]
    },
    {
      id: "p-notes-cli",
      title: "Notes CLI",
      summary: "A tiny command-line tool for capturing notes into markdown files.",
      status: "done",
      tags: ["python", "tooling"],
      links: [],
      related: ["l-argparse"]
    }
  ],

  learnings: [
    {
      id: "l-cardinality",
      title: "High-cardinality labels will eat your Prometheus",
      date: "2026-10-12",
      summary: "Every unique label combination creates a new time series. Keep user IDs and URLs out of labels.",
      tags: ["monitoring", "devops"],
      related: ["p-homelab"]
    },
    {
      id: "l-argparse",
      title: "argparse subcommands keep CLIs tidy",
      date: "2026-09-03",
      summary: "Use add_subparsers for git-style commands instead of a pile of flags.",
      tags: ["python", "tooling"],
      related: ["p-notes-cli"]
    }
  ],

  papers: [
    {
      id: "r-dapper",
      title: "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure",
      authors: "Sigelman et al.",
      year: 2010,
      venue: "Google Technical Report",
      url: "https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/",
      status: "read",               // to-read | reading | read
      rating: 5,                    // 1-5, optional
      takeaways: [
        "Low overhead plus sampling makes always-on tracing practical.",
        "Application-transparent instrumentation drives adoption."
      ],
      tags: ["monitoring", "distributed-systems"],
      related: ["p-homelab"]
    },
    {
      id: "r-raft",
      title: "In Search of an Understandable Consensus Algorithm (Raft)",
      authors: "Ongaro, Ousterhout",
      year: 2014,
      venue: "USENIX ATC",
      url: "https://raft.github.io/raft.pdf",
      status: "to-read",
      rating: null,
      takeaways: [],
      tags: ["distributed-systems"],
      related: []
    }
  ]
};
