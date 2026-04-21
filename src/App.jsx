import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Link as LinkIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";

const starterProfile = {
  name: "averout",
  bio: "building small products, one by one.",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
};

const starterLinks = [
  {
    id: crypto.randomUUID(),
    title: "GitHub",
    url: "https://github.com/averout",
    icon: "code",
  },
  {
    id: crypto.randomUUID(),
    title: "Instagram",
    url: "https://instagram.com",
    icon: "social",
  },
  {
    id: crypto.randomUUID(),
    title: "Portfolio",
    url: "https://example.com",
    icon: "default",
  },
];

function getSavedProfile() {
  const saved = localStorage.getItem("averra_links_profile");
  if (!saved) return starterProfile;

  try {
    return JSON.parse(saved);
  } catch {
    return starterProfile;
  }
}

function getSavedLinks() {
  const saved = localStorage.getItem("averra_links_items");
  if (!saved) return starterLinks;

  try {
    return JSON.parse(saved);
  } catch {
    return starterLinks;
  }
}

function makeLink(data = {}) {
  return {
    id: crypto.randomUUID(),
    title: "",
    url: "",
    icon: "default",
    ...data,
  };
}

function getLinkTone(icon) {
  if (icon === "code") {
    return {
      wrapper: "bg-[#eef1ff] text-[#6d62ff]",
      badge: "Code",
    };
  }

  if (icon === "social") {
    return {
      wrapper: "bg-[#fff0f4] text-[#db5b8a]",
      badge: "Social",
    };
  }

  return {
    wrapper: "bg-[#f6f3ff] text-[#8d6bff]",
    badge: "Link",
  };
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AverraLinks() {
  const [profile, setProfile] = useState(getSavedProfile);
  const [links, setLinks] = useState(getSavedLinks);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(makeLink());
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("averra_links_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("averra_links_items", JSON.stringify(links));
  }, [links]);

  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return links;

    return links.filter((item) => {
      return `${item.title} ${item.url}`.toLowerCase().includes(query);
    });
  }, [links, search]);

  const formIsValid = draft.title.trim() && isValidUrl(draft.url.trim());

  function openCreate() {
    setEditingId(null);
    setDraft(makeLink());
    setEditorOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setDraft(item);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditingId(null);
    setDraft(makeLink());
    setEditorOpen(false);
  }

  function saveLink() {
    if (!formIsValid) return;

    if (editingId) {
      setLinks((prev) =>
        prev.map((item) => (item.id === editingId ? { ...draft } : item))
      );
    } else {
      setLinks((prev) => [...prev, { ...draft, id: crypto.randomUUID() }]);
    }

    closeEditor();
  }

  function removeLink(id) {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  }

  function moveLink(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= links.length) return;

    const copied = [...links];
    [copied[index], copied[newIndex]] = [copied[newIndex], copied[index]];
    setLinks(copied);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#efe8ff_0%,#f6f1ff_30%,#fbfbfd_65%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-6 px-4 py-6 md:grid-cols-[380px_1fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(142,116,255,0.12)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Averra</p>
              <h1 className="text-3xl font-semibold tracking-tight">Links</h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8d6bff] text-white shadow-lg shadow-violet-200">
              <LinkIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="mb-4 rounded-[28px] border border-white/80 bg-white/75 p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-violet-100"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80";
                }}
              />

              <div className="min-w-0 flex-1">
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-transparent text-xl font-semibold outline-none"
                  placeholder="Username"
                />
                <input
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="mt-1 w-full bg-transparent text-sm text-slate-500 outline-none"
                  placeholder="Short bio"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-[#f6f3ff] px-3 py-3">
              <User className="h-4 w-4 text-slate-400" />
              <input
                value={profile.avatar}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, avatar: e.target.value }))
                }
                placeholder="Avatar URL"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
            <LinkIcon className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search links"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <StatCard label="Links" value={links.length} />
            <StatCard label="Found" value={filteredLinks.length} />
            <StatCard label="Brand" value="A" />
          </div>

          <button
            onClick={openCreate}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8d6bff] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 transition active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add link
          </button>

          <div className="space-y-3">
            <AnimatePresence>
              {filteredLinks.map((item, index) => {
                const tone = getLinkTone(item.icon);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-[26px] border border-white/80 bg-white/75 p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.wrapper}`}>
                          <LinkIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold">{item.title}</h3>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                              {tone.badge}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-500">{item.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveLink(index, -1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ff] text-slate-500 transition active:scale-95"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveLink(index, 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ff] text-slate-500 transition active:scale-95"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f3ff] text-slate-500 transition active:scale-95"
                          aria-label="Edit link"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeLink(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-rose-500 transition active:scale-95"
                          aria-label="Delete link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-2xl bg-[#faf8ff] px-4 py-3 text-sm font-medium text-slate-700 transition hover:translate-y-[-1px]"
                    >
                      Open link
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredLinks.length === 0 && (
              <div className="rounded-[26px] border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
                No links yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(245,241,255,0.92))] p-5 shadow-[0_18px_50px_rgba(142,116,255,0.10)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Live preview</p>
              <h2 className="text-2xl font-semibold tracking-tight">Public page</h2>
            </div>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Share
            </button>
          </div>

          <div className="mx-auto max-w-md rounded-[40px] border border-white/80 bg-[radial-gradient(circle_at_top,#faf8ff_0%,#f2ecff_38%,#ede7fb_100%)] p-5 shadow-[0_24px_60px_rgba(141,107,255,0.14)]">
            <div className="mb-6 flex flex-col items-center text-center">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-white"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80";
                }}
              />
              <h3 className="text-2xl font-semibold tracking-tight">{profile.name || "username"}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                {profile.bio || "A short bio will appear here."}
              </p>
            </div>

            <div className="space-y-3">
              {filteredLinks.map((item, index) => {
                const tone = getLinkTone(item.icon);

                return (
                  <motion.a
                    key={item.id}
                    href={item.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-center justify-between rounded-[24px] border border-white/80 bg-white/80 px-4 py-4 shadow-sm transition hover:translate-y-[-2px] hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.wrapper}`}>
                        <LinkIcon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{item.title || "Untitled"}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-3 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-md rounded-[30px] border border-white/80 bg-white/85 p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={closeEditor}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ff] text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
                <p className="text-sm font-medium text-slate-500">
                  {editingId ? "Edit link" : "New link"}
                </p>
                <button
                  onClick={saveLink}
                  disabled={!formIsValid}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                    formIsValid ? "bg-[#8d6bff]" : "bg-slate-300"
                  }`}
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full rounded-2xl bg-[#f6f3ff] px-4 py-3 text-sm outline-none"
                />
                <input
                  value={draft.url}
                  onChange={(e) => setDraft((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-2xl bg-[#f6f3ff] px-4 py-3 text-sm outline-none"
                />
                <select
                  value={draft.icon}
                  onChange={(e) => setDraft((prev) => ({ ...prev, icon: e.target.value }))}
                  className="w-full rounded-2xl bg-[#f6f3ff] px-4 py-3 text-sm outline-none"
                >
                  <option value="default">Default link</option>
                  <option value="code">Code / GitHub</option>
                  <option value="social">Social</option>
                </select>

                {!draft.url.trim() || formIsValid ? null : (
                  <p className="text-xs text-rose-500">
                    Enter a valid URL starting with http:// or https://
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] bg-white/80 p-4 text-center shadow-sm">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

console.assert(isValidUrl("https://github.com/averout") === true, "Expected https URL to be valid");
console.assert(isValidUrl("http://example.com") === true, "Expected http URL to be valid");
console.assert(isValidUrl("github.com/averout") === false, "Expected URL without protocol to be invalid");
console.assert(isValidUrl("not-a-url") === false, "Expected malformed URL to be invalid");
