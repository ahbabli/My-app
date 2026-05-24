import { useEffect, useMemo, useState } from 'react';
import { TbArrowLeft } from 'react-icons/tb';
import { apiUrl } from '../utils/api.js';

const TOKEN_KEY = 'portfolio_admin_token';

const emptyProject = {
  title: '',
  category: 'UI UX',
  excerpt: '',
  description: '',
  image_url: '',
  year: new Date().getFullYear(),
  status: 'Published',
  tagsText: '',
  linksText: '',
  sort_order: 0,
  is_featured: false,
  is_hidden: false,
  is_favorite: false,
};

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [role, setRole] = useState(token ? 'admin' : 'visitor');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingSlug, setEditingSlug] = useState(null);
  const [profileForm, setProfileForm] = useState(null);
  const [activePanel, setActivePanel] = useState('projects');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = role === 'admin' && Boolean(token);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!token) {
      setRole('visitor');
      return;
    }

    api('/api/admin/me', { token })
      .then(() => setRole('admin'))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setRole('visitor');
      });
  }, [token]);

  const metrics = useMemo(() => {
    const featured = projects.filter((project) => project.is_featured || project.status === 'Featured').length;
    const favorite = projects.filter((project) => project.is_favorite).length;
    const hidden = projects.filter((project) => project.is_hidden).length;
    const published = projects.filter((project) => project.status === 'Published' || project.status === 'Featured').length;

    return [
      { label: 'Projects', value: projects.length, change: 'Total in database' },
      { label: 'Published', value: published, change: 'Visible if not hidden' },
      { label: 'Favourite', value: favorite, change: 'Shown in Favourite tab' },
      { label: 'Hidden', value: hidden, change: 'Removed from public UI' },
    ];
  }, [isAdmin, projects]);

  async function refreshData() {
    setError('');
    try {
      const projectPath = token ? '/api/admin/projects' : '/api/projects';
      const [profileData, projectData] = await Promise.all([api('/api/profile'), api(projectPath, { token })]);
      setProfile(profileData);
      setProfileForm(toProfileForm(profileData));
      setProjects(projectData);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const data = await api('/api/admin/login', {
        method: 'POST',
        body: { password },
      });

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setRole(data.role);
      setPassword('');
      await refreshDataWithToken(data.token);
      setStatus('Admin access enabled.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setRole('visitor');
    setStatus('Signed out. You are viewing as visitor.');
  }

  async function refreshDataWithToken(authToken) {
    setError('');
    const [profileData, projectData] = await Promise.all([api('/api/profile'), api('/api/admin/projects', { token: authToken })]);
    setProfile(profileData);
    setProfileForm(toProfileForm(profileData));
    setProjects(projectData);
  }

  function editProject(project) {
    setEditingSlug(project.slug);
    setProjectForm({
      title: project.title ?? '',
      category: project.category ?? '',
      excerpt: project.excerpt ?? '',
      description: project.description ?? '',
      image_url: project.image_url ?? '',
      year: project.year ?? new Date().getFullYear(),
      status: project.status ?? 'Published',
      tagsText: (project.tags ?? []).join(', '),
      linksText: (project.links ?? []).map((link) => `${link.label}|${link.url}`).join('\n'),
      sort_order: project.sort_order ?? 0,
      is_featured: Boolean(project.is_featured),
      is_hidden: Boolean(project.is_hidden),
      is_favorite: Boolean(project.is_favorite),
    });
    setActivePanel('projects');
  }

  function resetProjectForm() {
    setEditingSlug(null);
    setProjectForm(emptyProject);
  }

  async function saveProject(event) {
    event.preventDefault();
    requireAdmin();
    setIsSaving(true);
    setError('');
    setStatus('');

    const payload = {
      title: projectForm.title,
      category: projectForm.category,
      excerpt: projectForm.excerpt,
      description: projectForm.description || null,
      image_url: projectForm.image_url || null,
      year: Number(projectForm.year),
      status: projectForm.status,
      tags: splitCsv(projectForm.tagsText),
      links: parseLinks(projectForm.linksText),
      sort_order: Number(projectForm.sort_order) || 0,
      is_featured: projectForm.is_featured,
      is_hidden: projectForm.is_hidden,
      is_favorite: projectForm.is_favorite,
    };

    try {
      await api(editingSlug ? `/api/projects/${editingSlug}` : '/api/projects', {
        method: editingSlug ? 'PUT' : 'POST',
        token,
        body: payload,
      });
      resetProjectForm();
      await refreshData();
      setStatus(editingSlug ? 'Project updated in the database.' : 'Project added to the database.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProject(project) {
    requireAdmin();

    if (!window.confirm(`Remove "${project.title}" from the database?`)) {
      return;
    }

    setError('');
    setStatus('');

    try {
      await api(`/api/projects/${project.slug}`, {
        method: 'DELETE',
        token,
      });
      await refreshData();
      if (editingSlug === project.slug) {
        resetProjectForm();
      }
      setStatus('Project removed from the database.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function updateProjectFlags(project, flags) {
    requireAdmin();
    setError('');
    setStatus('');

    try {
      await api(`/api/projects/${project.slug}`, {
        method: 'PATCH',
        token,
        body: flags,
      });
      await refreshDataWithToken(token);
      setStatus('Project visibility updated.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    requireAdmin();
    setIsSaving(true);
    setError('');
    setStatus('');

    try {
      const updatedProfile = await api('/api/profile', {
        method: 'PUT',
        token,
        body: {
          name: profileForm.name,
          handle: profileForm.handle,
          role: profileForm.role,
          bio: profileForm.bio,
          contactHref: profileForm.contactHref,
          cvHref: profileForm.cvHref,
          socialHref: profileForm.socialHref,
          photoUrl: profileForm.photoUrl || null,
          storyPhotoUrl: profileForm.storyPhotoUrl || null,
          skills: normalizeSkills(profileForm.skillsText, profile?.skills ?? []),
        },
      });

      setProfile(updatedProfile);
      setProfileForm(toProfileForm(updatedProfile));
      setStatus('Profile updated in the database.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function requireAdmin() {
    if (!isAdmin) {
      throw new Error('Admin login is required for this action.');
    }
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-white antialiased">
        <section className="w-full max-w-[460px] rounded-[8px] border border-white/10 bg-[#080a12] p-5 shadow-2xl shadow-black/30 sm:p-7">
          <p className="font-filter text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-brand">Protected admin area</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white">Sign in to manage content</h1>
          <p className="mt-3 text-sm leading-relaxed text-mist">Only admins can access the dashboard, project editor, and profile editor.</p>
          <LoginPanel password={password} setPassword={setPassword} onLogin={handleLogin} />
          <StatusMessages error={error} status={status} />
          <a
            className="mt-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-mist transition hover:border-cyan-brand hover:bg-cyan-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand"
            href="/"
            aria-label="Back to public portfolio"
          >
            <TbArrowLeft className="h-5 w-5" aria-hidden="true" />
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-white antialiased">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 2xl:px-0">
        <div className="overflow-hidden rounded-[8px] border border-white/10 bg-[#080a12] shadow-2xl shadow-black/30">
          <AdminTopbar profile={profile} role={role} onLogout={handleLogout} />

          <div className="grid lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-white/10 bg-white/[0.025] p-4 lg:min-h-[calc(100vh-96px)] lg:border-b-0 lg:border-r lg:p-5">
              <nav className="grid gap-2 text-sm font-bold text-white/58" aria-label="Admin navigation">
                {[
                  ['projects', 'Projects'],
                  ['profile', 'Profile'],
                ].map(([id, label]) => (
                  <button
                    className={`rounded-[8px] px-4 py-3 text-left transition hover:bg-white/8 hover:text-white ${
                      activePanel === id ? 'bg-white text-ink shadow-lg shadow-black/15' : ''
                    }`}
                    type="button"
                    onClick={() => setActivePanel(id)}
                    key={id}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 rounded-[8px] border border-white/10 bg-ink p-4">
                <p className="font-filter text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-brand">Access</p>
                <p className="mt-3 text-sm font-bold text-white">{isAdmin ? 'Admin' : 'Visitor'}</p>
                <p className="mt-1 text-xs leading-snug text-mist">{isAdmin ? 'You can create, update, and remove content.' : 'Log in to unlock database writes.'}</p>
              </div>
            </aside>

            <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-filter text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-brand">Admin dashboard</p>
                  <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">Manage live portfolio data</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">A simple workspace for projects, visibility, favourites, and profile content.</p>
                </div>

                <a className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-mist px-5 text-sm font-bold text-ink transition hover:bg-white" href="/">
                  View public page
                </a>
              </div>

              <StatusMessages error={error} status={status} />

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <article className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5" key={metric.label}>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/42">{metric.label}</p>
                    <p className="mt-4 text-4xl font-bold text-white">{metric.value}</p>
                    <p className="mt-2 text-xs text-mist">{metric.change}</p>
                  </article>
                ))}
              </div>

              {activePanel === 'projects' ? (
                <ProjectsAdmin
                  isAdmin={isAdmin}
                  projects={projects}
                  form={projectForm}
                  setForm={setProjectForm}
                  editingSlug={editingSlug}
                  onSave={saveProject}
                  onEdit={editProject}
                  onDelete={deleteProject}
                  onToggleFlags={updateProjectFlags}
                  onCancel={resetProjectForm}
                  isSaving={isSaving}
                />
              ) : null}

              {activePanel === 'profile' && profileForm ? (
                <ProfileAdmin isAdmin={isAdmin} form={profileForm} setForm={setProfileForm} onSave={saveProfile} isSaving={isSaving} />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminTopbar({ profile, role, onLogout }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <a className="text-xl font-bold leading-none text-white transition hover:text-cyan-brand" href="/admin">
          Portfolio Admin
        </a>
        <p className="mt-1 text-xs text-white/38">Logged in as {profile?.handle ?? 'admin'}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-brand text-xs font-bold text-white">
            {(profile?.name ?? 'Admin').slice(0, 2).toUpperCase()}
          </span>
          <span className="text-sm font-bold text-white">{role}</span>
        </div>
        {role === 'admin' ? (
          <button className="min-h-10 rounded-[8px] border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:border-cyan-brand hover:text-white" type="button" onClick={onLogout}>
            Sign out
          </button>
        ) : null}
      </div>
    </header>
  );
}

function LoginPanel({ password, setPassword, onLogin }) {
  return (
    <form className="mt-6 grid gap-3 rounded-[8px] border border-cyan-brand/30 bg-cyan-brand/10 p-4 sm:grid-cols-[1fr_auto]" onSubmit={onLogin}>
      <div>
        <label className="text-sm font-bold text-white" htmlFor="admin-password">
          Admin password
        </label>
        <input
          id="admin-password"
          className="mt-2 w-full rounded-[8px] border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-brand"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="enter password"
        />
      </div>
      <button className="min-h-11 self-end rounded-[8px] bg-cyan-brand px-5 text-sm font-bold text-white transition hover:bg-mist hover:text-ink" type="submit">
        Enter admin
      </button>
    </form>
  );
}

function ProjectsAdmin({ isAdmin, projects, form, setForm, editingSlug, onSave, onEdit, onDelete, onToggleFlags, onCancel, isSaving }) {
  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-[420px_1fr]">
      <form className="rounded-[8px] border border-white/10 bg-white/[0.035] p-5 xl:sticky xl:top-6 xl:self-start" onSubmit={onSave}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">{editingSlug ? 'Edit project' : 'Add project'}</h2>
            <p className="mt-1 text-xs text-mist">{editingSlug ? 'Update the selected project.' : 'Create a new portfolio item.'}</p>
          </div>
          {editingSlug ? (
            <button className="rounded-[8px] border border-white/10 px-3 py-2 text-xs font-bold text-mist transition hover:text-white" type="button" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4">
          <TextField label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
          <TextField label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} required />
          <TextArea label="Excerpt" value={form.excerpt} onChange={(value) => setForm({ ...form, excerpt: value })} required rows={3} />
          <TextArea label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} rows={4} />
          <TextField label="Image URL" value={form.image_url} onChange={(value) => setForm({ ...form, image_url: value })} />

          <div className="grid grid-cols-2 gap-3">
            <TextField label="Year" type="number" value={form.year} onChange={(value) => setForm({ ...form, year: value })} required />
            <TextField label="Sort order" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
          </div>

          <label className="grid gap-2 text-sm font-bold text-white">
            Status
            <select className="rounded-[8px] border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none focus:border-cyan-brand" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>Published</option>
              <option>Draft</option>
              <option>Review</option>
            </select>
          </label>

          <TextField label="Tags, comma separated" value={form.tagsText} onChange={(value) => setForm({ ...form, tagsText: value })} required />
          <TextArea label="Links, one per line as Label|URL" value={form.linksText} onChange={(value) => setForm({ ...form, linksText: value })} rows={3} />

          <div className="grid gap-2 rounded-[8px] border border-white/10 bg-ink p-3">
            <ProjectToggle label="Featured" checked={form.is_featured} onChange={(checked) => setForm({ ...form, is_featured: checked })} />
            <ProjectToggle label="Favourite" checked={form.is_favorite} onChange={(checked) => setForm({ ...form, is_favorite: checked })} />
            <ProjectToggle label="Hidden from public UI" checked={form.is_hidden} onChange={(checked) => setForm({ ...form, is_hidden: checked })} />
          </div>

          <button className="min-h-11 rounded-[8px] bg-cyan-brand px-5 text-sm font-bold text-white transition hover:bg-mist hover:text-ink disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!isAdmin || isSaving}>
            {isSaving ? 'Saving...' : editingSlug ? 'Update project' : 'Add project'}
          </button>
        </div>
      </form>

      <section className="rounded-[8px] border border-white/10 bg-white/[0.035]" aria-labelledby="projects-table-heading">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="projects-table-heading" className="text-xl font-bold text-white">
              Projects
            </h2>
            <p className="mt-1 text-xs text-mist">Manage what visitors see on the public page.</p>
          </div>
          <button className="min-h-10 rounded-[8px] bg-mist px-4 text-sm font-bold text-ink transition hover:bg-white" type="button" onClick={onCancel}>
            New project
          </button>
        </div>

        <div className="grid gap-3 p-5 2xl:grid-cols-2">
          {projects.map((project) => (
            <article className={`rounded-[8px] border p-4 transition ${project.is_hidden ? 'border-white/10 bg-ink/70 opacity-75' : 'border-white/10 bg-ink'}`} key={project.slug}>
              <div className="grid min-h-full gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold leading-tight text-white">{project.title}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(project.status)}`}>{project.status}</span>
                    {project.is_hidden ? <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white/60">Hidden</span> : null}
                    {project.is_favorite ? <span className="rounded-full bg-mist/20 px-2.5 py-1 text-xs font-bold text-mist">Favourite</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-mist">{project.excerpt}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-white/38">
                    {project.category} · {project.year} · order {project.sort_order ?? 0}
                  </p>
                  {project.links?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.links.map((link) => (
                        <a className="rounded-full border border-cyan-brand/25 bg-cyan-brand/10 px-2.5 py-1 text-xs font-bold text-mist transition hover:border-cyan-brand hover:text-white" href={link.url} target="_blank" rel="noreferrer" key={`${link.label}-${link.url}`}>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs font-bold text-white/32">No project links added.</p>
                  )}
                </div>

                <div className="mt-auto grid gap-2 sm:grid-cols-2">
                  <button className="min-h-10 rounded-[8px] bg-cyan-brand px-3 text-sm font-bold text-white transition hover:bg-mist hover:text-ink" type="button" onClick={() => onEdit(project)} disabled={!isAdmin}>
                    Edit project
                  </button>
                  <button
                    className={`min-h-10 rounded-[8px] border px-3 text-sm font-bold transition ${
                      project.is_favorite ? 'border-mist/40 bg-mist/15 text-mist hover:bg-mist/20' : 'border-white/10 text-white/72 hover:border-mist hover:text-mist'
                    }`}
                    type="button"
                    onClick={() => onToggleFlags(project, { is_favorite: !project.is_favorite })}
                    disabled={!isAdmin}
                  >
                    {project.is_favorite ? 'Favourite on' : 'Set favourite'}
                  </button>
                  <button
                    className={`min-h-10 rounded-[8px] border px-3 text-sm font-bold transition ${
                      project.is_hidden ? 'border-white/20 bg-white/10 text-white hover:bg-white/15' : 'border-white/10 text-white/72 hover:border-cyan-brand hover:text-cyan-brand'
                    }`}
                    type="button"
                    onClick={() => onToggleFlags(project, { is_hidden: !project.is_hidden })}
                    disabled={!isAdmin}
                  >
                    {project.is_hidden ? 'Show public' : 'Hide public'}
                  </button>
                  <button className="min-h-10 rounded-[8px] border border-red-400/30 px-3 text-sm font-bold text-red-100 transition hover:bg-red-500/15" type="button" onClick={() => onDelete(project)} disabled={!isAdmin}>
                    Delete project
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfileAdmin({ isAdmin, form, setForm, onSave, isSaving }) {
  return (
    <form className="mt-6 rounded-[8px] border border-white/10 bg-white/[0.035] p-5 sm:p-6" onSubmit={onSave}>
      <h2 className="text-xl font-bold text-white">Edit profile</h2>
      <p className="mt-1 text-xs text-mist">This updates the public profile header, bio, links, stats, and skills.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TextField label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
        <TextField label="Handle" value={form.handle} onChange={(value) => setForm({ ...form, handle: value })} required />
        <TextField label="Role" value={form.role} onChange={(value) => setForm({ ...form, role: value })} required />
        <TextField label="Contact link" value={form.contactHref} onChange={(value) => setForm({ ...form, contactHref: value })} required />
        <TextField label="CV link" value={form.cvHref} onChange={(value) => setForm({ ...form, cvHref: value })} required />
        <TextField label="Social/projects link" value={form.socialHref} onChange={(value) => setForm({ ...form, socialHref: value })} required />
        <TextField label="Profile photo URL" value={form.photoUrl} onChange={(value) => setForm({ ...form, photoUrl: value })} />
        <TextField label="Daily story photo URL" value={form.storyPhotoUrl} onChange={(value) => setForm({ ...form, storyPhotoUrl: value })} />
      </div>

      <div className="mt-4 grid gap-4">
        {form.photoUrl ? (
          <div className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-ink p-3">
            <img className="h-14 w-14 rounded-full object-cover" src={form.photoUrl} alt="" />
            <p className="text-xs leading-relaxed text-mist">This image appears in the public profile circle.</p>
          </div>
        ) : null}
        {form.storyPhotoUrl ? (
          <div className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-ink p-3">
            <img className="h-20 w-14 rounded-[8px] object-cover" src={form.storyPhotoUrl} alt="" />
            <p className="text-xs leading-relaxed text-mist">This image appears only inside the profile story. Change it whenever you want a new daily story.</p>
          </div>
        ) : null}
        <TextArea label="Bio" value={form.bio} onChange={(value) => setForm({ ...form, bio: value })} required rows={4} />
        <TextField label="Skills, comma separated" value={form.skillsText} onChange={(value) => setForm({ ...form, skillsText: value })} required />
      </div>

      <button className="mt-4 min-h-11 rounded-[8px] bg-cyan-brand px-5 text-sm font-bold text-white transition hover:bg-mist hover:text-ink disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!isAdmin || isSaving}>
        {isSaving ? 'Saving...' : 'Update profile'}
      </button>
    </form>
  );
}

function TextField({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white">
      {label}
      <input
        className="rounded-[8px] border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-brand"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, required = false, rows = 3 }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white">
      {label}
      <textarea
        className="resize-y rounded-[8px] border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-brand"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
      />
    </label>
  );
}

function ProjectToggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-[8px] px-2 py-1.5 text-sm font-bold text-white">
      <span>{label}</span>
      <input className="h-4 w-4 accent-cyan-brand" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function StatusMessages({ error, status }) {
  if (!error && !status) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-2">
      {error ? <p className="rounded-[8px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">{error}</p> : null}
      {status ? <p className="rounded-[8px] border border-cyan-brand/30 bg-cyan-brand/10 px-4 py-3 text-sm font-bold text-mist">{status}</p> : null}
    </div>
  );
}

function statusClass(status) {
  if (status === 'Published' || status === 'Featured') {
    return 'bg-cyan-brand/20 text-cyan-brand';
  }

  if (status === 'Review') {
    return 'bg-mist/20 text-mist';
  }

  return 'bg-white/10 text-white/65';
}

function toProfileForm(profile) {
  return {
    name: profile.name ?? '',
    handle: profile.handle ?? '',
    role: profile.role ?? '',
    bio: profile.bio ?? '',
    contactHref: profile.contactHref ?? '',
    cvHref: profile.cvHref ?? '',
    socialHref: profile.socialHref ?? '',
    photoUrl: profile.photoUrl ?? '',
    storyPhotoUrl: profile.storyPhotoUrl ?? '',
    skillsText: (profile.skills ?? []).map((skill) => skill.label).join(', '),
  };
}

function splitCsv(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLinks(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf('|');

      if (separatorIndex === -1) {
        const url = normalizeUrl(line);
        return { label: 'Open link', url };
      }

      const label = line.slice(0, separatorIndex).trim();
      const url = normalizeUrl(line.slice(separatorIndex + 1).trim());

      return { label, url };
    })
    .filter((link) => link.label && link.url);
}

function normalizeUrl(value) {
  if (!value) {
    return '';
  }

  if (/^(https?:|mailto:|tel:|#|\/)/i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function normalizeSkills(value, existingSkills) {
  const existingByLabel = Object.fromEntries(existingSkills.map((skill) => [skill.label.toLowerCase(), skill]));

  return splitCsv(value).map((label) => {
    const existing = existingByLabel[label.toLowerCase()];

    return {
      label,
      icon: existing?.icon ?? 'skill-circle.svg',
      iconClass: existing?.iconClass ?? 'h-[45px] w-8',
    };
  });
}

async function api(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(apiUrl(path), {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = data.errors ? Object.values(data.errors).flat().join(' ') : '';
    throw new Error(validationMessage || data.message || 'Request failed.');
  }

  return data;
}
