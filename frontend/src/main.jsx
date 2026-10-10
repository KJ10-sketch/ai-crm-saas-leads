import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  LayoutDashboard,
  Users,
  Kanban,
  StickyNote,
  CheckSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ArrowUpRight,
  Trash2,
  Edit3,
  Star,
  Mail,
  Phone,
  Sparkles,
  GripVertical,
  X,
  Download,
  Menu,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api, { TOKEN_KEY } from './api';
import './index.css';

const stages = ['new', 'qualified', 'proposal', 'won', 'lost'];

const stageLabel = {
  new: 'New',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

const money = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

/* ------------------------------- App ------------------------------- */

function App() {
  const nav = useNavigate();
  const loc = useLocation();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(loc.pathname.slice(1) || 'dashboard');

  useEffect(() => {
    setPage(loc.pathname.slice(1) || 'dashboard');
  }, [loc.pathname]);

  useEffect(() => {
    const boot = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        setMe((await api.get('/auth/me')).user);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setMe(null);
    nav('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sky-600">
        Loading CRM…
      </div>
    );
  }

  if (!me) {
    return (
      <Auth
        onLogin={(u) => {
          setMe(u);
          nav('/dashboard');
        }}
      />
    );
  }

  return (
    <>
      <Shell
        me={me}
        page={page}
        setPage={(p) => {
          setPage(p);
          nav('/' + p);
        }}
        logout={logout}
      >
        <Page page={page} me={me} />
      </Shell>
      <Toaster position="top-right" />
    </>
  );
}

/* ------------------------------- Auth ------------------------------- */

function Auth({ onLogin }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('demo@ai-crm.local');
  const [password, setPassword] = useState('Test1234');
  const [name, setName] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = register
        ? await api.post('/auth/register', { name, email, password })
        : await api.post('/auth/login', { email, password });
      localStorage.setItem(TOKEN_KEY, r.token);
      onLogin(r.user);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#eef7ff] grid lg:grid-cols-2">
      <div className="hidden lg:flex gradient p-16 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-lg self-center">
          <div className="text-2xl font-black mb-12">✦ AI CRM</div>
          <p className="text-6xl font-black leading-tight">
            Close more deals with an AI co-pilot.
          </p>
          <p className="mt-6 text-white/80 text-lg">
            A premium sales workspace for leads, relationships, pipeline and
            intelligent next steps.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-12">
            {['Visual pipeline', 'AI scoring', 'Secure auth'].map((x) => (
              <div
                className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm font-semibold"
                key={x}
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-12 grid place-items-center">
        <form
          onSubmit={submit}
          className="w-full max-w-md glass rounded-3xl p-8"
        >
          <div className="lg:hidden text-xl font-black text-sky-600 mb-8">
            ✦ AI CRM
          </div>
          <h1 className="text-3xl font-black">
            {register ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 mt-2 mb-8">
            {register
              ? 'Start managing your pipeline.'
              : 'Sign in to your sales workspace.'}
          </p>

          {register && (
            <Field
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Alex Morgan"
            />
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          <button className="w-full gradient text-white py-3.5 rounded-xl font-bold mt-2">
            {register ? 'Create account' : 'Sign in'}
          </button>

          {!register && (
            <button
              type="button"
              onClick={() => {
                setEmail('demo@ai-crm.local');
                setPassword('Test1234');
              }}
              className="w-full mt-3 py-3 rounded-xl border border-sky-200 text-sky-700 font-bold"
            >
              Try demo account
            </button>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            {register ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              onClick={() => setRegister(!register)}
              className="font-bold text-sky-600"
            >
              {register ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, onChange, ...p }) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input
        {...p}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
        required
      />
    </label>
  );
}

/* ------------------------------- Shell ------------------------------- */

function Shell({ me, page, setPage, logout, children }) {
  const items = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['leads', 'Leads', Users],
    ['contacts', 'Contacts', Users],
    ['pipeline', 'Pipeline', Kanban],
    ['notes', 'Notes', StickyNote],
    ['tasks', 'Follow-ups', CheckSquare],
  ];

  return (
    <div className="min-h-screen">
      <aside className="fixed left-4 top-1/2 -translate-y-1/2 hidden md:flex w-16 rounded-3xl glass p-2 flex-col items-center gap-2 z-30">
        {items.map(([id, l, I]) => (
          <button
            title={l}
            onClick={() => setPage(id)}
            key={id}
            className={`w-12 h-12 rounded-2xl grid place-items-center ${
              page === id
                ? 'gradient text-white'
                : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <I size={20} />
          </button>
        ))}
        <div className="flex-1" />
        <button
          title="Settings"
          onClick={() => setPage('settings')}
          className={`w-12 h-12 rounded-2xl grid place-items-center ${
            page === 'settings' ? 'gradient text-white' : 'text-slate-400'
          }`}
        >
          <Settings size={20} />
        </button>
        <button
          title="Logout"
          onClick={logout}
          className="w-12 h-12 rounded-2xl grid place-items-center text-slate-400 hover:text-red-500"
        >
          <LogOut size={20} />
        </button>
      </aside>

      <header className="sticky top-4 z-20 mx-4 md:ml-24 md:mr-8 glass rounded-2xl px-5 py-3 flex items-center gap-4">
        <button className="md:hidden text-slate-500">
          <Menu />
        </button>
        <button
          onClick={() => setPage('dashboard')}
          className="font-black text-sky-600"
        >
          ✦ AI CRM
        </button>
        <nav className="hidden lg:flex gap-5 mx-auto text-sm font-bold text-slate-500">
          {items.slice(0, 4).map(([id, l]) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={page === id ? 'text-sky-600' : ''}
            >
              {l}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-50 rounded-xl px-3 py-2 text-slate-400">
            <Search size={16} />
            <input
              className="bg-transparent outline-none w-28 text-sm ml-2"
              placeholder="Search"
            />
          </div>
          <Bell size={19} className="text-slate-400" />
          <div className="w-9 h-9 rounded-xl gradient text-white grid place-items-center font-bold">
            {me.name?.[0]}
          </div>
        </div>
      </header>

      <main className="md:ml-24 mr-4 md:mr-8 py-7">{children}</main>
    </div>
  );
}

function Page({ page, me }) {
  if (page === 'dashboard') return <Dashboard me={me} />;
  if (page === 'leads') return <Leads />;
  if (page === 'contacts') return <Contacts />;
  if (page === 'pipeline') return <Pipeline />;
  if (page === 'notes') return <Notes />;
  if (page === 'tasks') return <Tasks />;
  return <SettingsPage me={me} />;
}

function Header({ title, sub, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between mb-6">
      <div>
        <p className="text-sm font-bold text-sky-600">AI CRM</p>
        <h1 className="text-3xl font-black">{title}</h1>
        {sub && <p className="text-slate-500 mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Stat({ label, value, icon: Icon, trend }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex justify-between">
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 grid place-items-center">
          <Icon size={18} />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600">{trend}</span>
        )}
      </div>
      <div className="mt-5 text-2xl font-black">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

/* ----------------------------- Dashboard ----------------------------- */

function Dashboard({ me }) {
  const [data, setData] = useState(null);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    api
      .get('/analytics/overview')
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <div className="p-12 text-slate-500">Loading dashboard…</div>;

  const trend = data.trend;
  const pie = Object.entries(data.pipeline).map(([name, v]) => ({
    name,
    value: v.value,
  }));

  const analyze = async () => {
    try {
      setInsight(
        await api.post('/ai/sales-insights', {
          stats: { ...data.stats, stages: data.pipeline },
        })
      );
    } catch (e) {
      toast.error(e.response?.data?.message || 'AI unavailable');
    }
  };

  return (
    <>
      <Header
        title={`Welcome back, ${me.name.split(' ')[0]}`}
        sub={new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
        action={
          <button
            onClick={() => (location.href = '/leads')}
            className="gradient text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Add new lead
          </button>
        }
      />

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="space-y-5">
          <div className="gradient text-white rounded-3xl p-6 min-h-44 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-40 h-40 rounded-full bg-white/10" />
            <p className="text-white/70 text-sm">Pipeline goal</p>
            <div className="text-4xl font-black mt-8">
              {money(data.stats.totalPipelineValue)}
            </div>
            <div className="text-sm text-white/70 mt-2">
              Total active + closed pipeline
            </div>
          </div>
          <Stat
            label="Won revenue"
            value={money(data.stats.wonValue)}
            icon={ArrowUpRight}
            trend="Live"
          />
          <Stat
            label="Win rate"
            value={`${data.stats.winRate.toFixed(1)}%`}
            icon={CheckCircle2}
          />
        </div>

        <div className="xl:col-span-2 space-y-5">
          <div className="glass rounded-3xl p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-black text-lg">Pipeline engagement</h2>
                <p className="text-sm text-slate-500">
                  New leads and won revenue
                </p>
              </div>
              <span className="text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg">
                Last 6 months
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#1477e8"
                    fill="#1477e8"
                    fillOpacity={0.12}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass rounded-3xl p-6">
              <div className="flex justify-between">
                <h2 className="font-black">Pipeline by stage</h2>
                <span className="text-xs text-slate-400">Value</span>
              </div>
              <div className="space-y-4 mt-5">
                {stages.map((s) => (
                  <div key={s}>
                    <div className="flex justify-between text-sm">
                      <b>{stageLabel[s]}</b>
                      <span>{money(data.pipeline[s].value)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full mt-1">
                      <div
                        className="h-full gradient rounded-full"
                        style={{
                          width: `${
                            data.stats.totalPipelineValue
                              ? (data.pipeline[s].value /
                                  data.stats.totalPipelineValue) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="font-black">AI sales insights</h2>
                <button onClick={analyze} className="text-sky-600">
                  <Sparkles size={20} />
                </button>
              </div>
              {insight ? (
                <>
                  <div className="text-3xl font-black mt-5">
                    {insight.healthScore}
                    <span className="text-sm text-slate-400">/100</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {insight.headline}
                  </p>
                  <div className="mt-4 space-y-2">
                    {insight.recommendations?.slice(0, 3).map((x) => (
                      <p className="text-sm" key={x}>
                        • {x}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 mt-5">
                  Analyze your live pipeline with Gemini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------- Leads ------------------------------- */

function Leads() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);

  const load = () =>
    api
      .get('/leads', { params: q ? { search: q } : undefined })
      .then((r) => setItems(r.leads))
      .catch(() => {});

  useEffect(load, [q]);

  const save = async (f) => {
    try {
      edit ? await api.put('/leads/' + edit._id, f) : await api.post('/leads', f);
      setModal(false);
      setEdit(null);
      load();
      toast.success('Lead saved');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not save');
    }
  };

  return (
    <>
      <Header
        title="Leads"
        sub="Manage opportunities from first touch to close."
        action={
          <button
            onClick={() => {
              setEdit(null);
              setModal(true);
            }}
            className="gradient text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Add lead
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Stat label="Total leads" value={items.length} icon={Users} />
        <Stat
          label="Open pipeline"
          value={money(
            items
              .filter((l) => !['won', 'lost'].includes(l.status))
              .reduce((a, l) => a + l.value, 0)
          )}
          icon={Kanban}
        />
        <Stat
          label="Won value"
          value={money(
            items
              .filter((l) => l.status === 'won')
              .reduce((a, l) => a + l.value, 0)
          )}
          icon={CheckCircle2}
        />
        <Stat
          label="Average deal"
          value={money(
            items.length
              ? items.reduce((a, l) => a + l.value, 0) / items.length
              : 0
          )}
          icon={ArrowUpRight}
        />
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-3">
          <Search className="text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="outline-none flex-1"
            placeholder="Search leads…"
          />
          <Filter className="text-slate-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                {['Lead', 'Stage', 'Priority', 'Source', 'Value', 'Updated'].map(
                  (x) => (
                    <th className="px-5 py-4" key={x}>
                      {x}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr
                  key={l._id}
                  onClick={() => setSel(l)}
                  className="border-t border-slate-100 hover:bg-sky-50 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <b>{l.name}</b>
                    <div className="text-xs text-slate-400">{l.company}</div>
                  </td>
                  <td className="px-5">
                    <span className="bg-sky-50 text-sky-700 rounded-full px-2 py-1 text-xs font-bold">
                      {stageLabel[l.status]}
                    </span>
                  </td>
                  <td className="px-5 text-sm">{l.priority}</td>
                  <td className="px-5 text-sm text-slate-500">{l.source}</td>
                  <td className="px-5 font-bold">{money(l.value)}</td>
                  <td className="px-5 text-sm text-slate-500">
                    {fmtDate(l.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <LeadDrawer
          lead={sel}
          close={() => setSel(null)}
          edit={() => {
            setEdit(sel);
            setSel(null);
            setModal(true);
          }}
          del={async () => {
            try {
              await api.delete('/leads/' + sel._id);
              setSel(null);
              load();
              toast.success('Lead deleted');
            } catch (e) {
              toast.error(e.response?.data?.message || 'Could not delete');
            }
          }}
        />
      )}
      {modal && (
        <LeadModal lead={edit} close={() => setModal(false)} save={save} />
      )}
    </>
  );
}

function LeadDrawer({ lead, close, edit, del }) {
  const [ai, setAi] = useState(null);
  const [email, setEmail] = useState(null);

  const analyze = async () => {
    try {
      setAi(await api.post('/ai/lead-summary', { leadId: lead._id }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'AI unavailable');
    }
  };

  const gen = async () => {
    try {
      setEmail(
        await api.post('/ai/generate-email', {
          leadId: lead._id,
          purpose: 'follow-up',
          tone: 'friendly and professional',
        })
      );
    } catch (e) {
      toast.error(e.response?.data?.message || 'AI unavailable');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 z-40">
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl p-6 overflow-y-auto">
        <button onClick={close} className="float-right">
          <X />
        </button>
        <p className="text-sky-600 font-bold text-sm">Lead detail</p>
        <h2 className="text-3xl font-black mt-2">{lead.name}</h2>
        <p className="text-slate-500">{lead.company}</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Info label="Stage" value={stageLabel[lead.status]} />
          <Info label="Deal value" value={money(lead.value)} />
          <Info label="Priority" value={lead.priority} />
          <Info label="Source" value={lead.source} />
        </div>

        <div className="mt-6 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black flex gap-2 items-center">
              <Sparkles size={18} className="text-sky-500" /> AI lead summary
            </h3>
            <button onClick={analyze} className="text-sm font-bold text-sky-600">
              Analyze
            </button>
          </div>
          {ai ? (
            <div className="mt-4 text-sm">
              <p>{ai.summary}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Info label="Risk score" value={`${ai.riskScore}/100`} />
                <Info label="Suggested priority" value={ai.suggestedPriority} />
              </div>
              <p className="mt-4 font-semibold">
                Next best action:{' '}
                <span className="font-normal">{ai.nextBestAction}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-3">
              Let Gemini summarize the lead, assess risk and recommend the next
              move.
            </p>
          )}
        </div>

        <div className="mt-4 glass rounded-2xl p-5">
          <button
            onClick={gen}
            className="font-bold flex gap-2 items-center text-sky-600"
          >
            <Mail size={18} /> Generate AI email
          </button>
          {email && (
            <div className="mt-4">
              <div className="font-bold">{email.subject}</div>
              <p className="whitespace-pre-wrap text-sm text-slate-600 mt-2">
                {email.body}
              </p>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${email.subject}\n\n${email.body}`
                  )
                }
                className="mt-3 text-xs font-bold"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={edit}
            className="px-4 py-3 rounded-xl bg-slate-100 font-bold flex gap-2"
          >
            <Edit3 size={17} /> Edit
          </button>
          <button
            onClick={del}
            className="px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold flex gap-2"
          >
            <Trash2 size={17} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-bold mt-1">{value}</div>
    </div>
  );
}

function LeadModal({ lead, close, save }) {
  const [f, setF] = useState(
    lead || {
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'new',
      priority: 'medium',
      source: 'Referral',
      value: 0,
      notes: '',
    }
  );
  const set = (k, v) => setF({ ...f, [k]: v });

  return (
    <div className="fixed inset-0 bg-slate-900/30 z-50 grid place-items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl p-7 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between">
          <h2 className="text-2xl font-black">
            {lead ? 'Edit lead' : 'Add new lead'}
          </h2>
          <button onClick={close}>
            <X />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <Field label="Name" value={f.name} onChange={(v) => set('name', v)} />
          <Field
            label="Company"
            value={f.company}
            onChange={(v) => set('company', v)}
          />
          <Field
            label="Email"
            type="email"
            value={f.email}
            onChange={(v) => set('email', v)}
          />
          <Field
            label="Phone"
            value={f.phone}
            onChange={(v) => set('phone', v)}
          />
          <Select
            label="Stage"
            value={f.status}
            onChange={(v) => set('status', v)}
            options={stages}
          />
          <Select
            label="Priority"
            value={f.priority}
            onChange={(v) => set('priority', v)}
            options={['low', 'medium', 'high']}
          />
          <Field
            label="Source"
            value={f.source}
            onChange={(v) => set('source', v)}
          />
          <Field
            label="Deal value"
            type="number"
            value={f.value}
            onChange={(v) => set('value', Number(v))}
          />
        </div>

        <label className="block mt-4">
          <span className="text-sm font-bold text-slate-600">Notes</span>
          <textarea
            value={f.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="w-full mt-2 rounded-xl border border-slate-200 p-3 h-24"
          />
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => save(f)}
            className="px-5 py-3 rounded-xl gradient text-white font-bold"
          >
            Save lead
          </button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {stageLabel[o] || o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* --------------------- Contacts / Notes / Tasks --------------------- */

function Contacts() {
  return (
    <Generic
      title="Contacts"
      endpoint="/contacts"
      keyName="contacts"
      icon={Users}
      tags
    />
  );
}

function Notes() {
  return (
    <Generic
      title="Notes"
      endpoint="/notes"
      keyName="notes"
      icon={StickyNote}
    />
  );
}

function Tasks() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);

  const load = () =>
    api
      .get('/tasks')
      .then((r) => setData(r.tasks))
      .catch(() => {});

  useEffect(load, []);

  const toggle = async (t) => {
    try {
      await api.put('/tasks/' + t._id, {
        status: t.status === 'completed' ? 'pending' : 'completed',
      });
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update task');
    }
  };

  const save = async (f) => {
    try {
      if (edit) await api.put('/tasks/' + edit._id, f);
      else await api.post('/tasks', f);
      setModal(false);
      setEdit(null);
      load();
      toast.success('Task saved');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not save task');
    }
  };

  return (
    <>
      <Header
        title="Follow-ups"
        sub="Stay ahead of overdue, today and upcoming work."
        action={
          <button
            onClick={() => {
              setEdit(null);
              setModal(true);
            }}
            className="gradient text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Add follow-up
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Stat label="Total" value={data.length} icon={CheckSquare} />
        <Stat
          label="Pending"
          value={data.filter((t) => t.status === 'pending').length}
          icon={Clock}
        />
        <Stat
          label="Overdue"
          value={
            data.filter(
              (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
            ).length
          }
          icon={AlertCircle}
        />
        <Stat
          label="Completed"
          value={data.filter((t) => t.status === 'completed').length}
          icon={CheckCircle2}
        />
      </div>

      <div className="glass rounded-3xl p-5 space-y-2">
        {data.map((t) => (
          <div
            key={t._id}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50"
          >
            <button onClick={() => toggle(t)} className="text-sky-600">
              {t.status === 'completed' ? <CheckCircle2 /> : <CheckSquare />}
            </button>
            <button
              onClick={() => {
                setEdit(t);
                setModal(true);
              }}
              className="flex-1 text-left"
            >
              <div
                className={`font-bold ${
                  t.status === 'completed' ? 'line-through text-slate-400' : ''
                }`}
              >
                {t.title}
              </div>
              <div className="text-xs text-slate-400">
                {t.relatedLead?.name || 'Unlinked'} · {fmtDate(t.dueDate)}
              </div>
            </button>
            <span className="text-xs font-bold capitalize">{t.priority}</span>
          </div>
        ))}
        {!data.length && (
          <div className="p-10 text-center text-slate-400">
            No follow-ups yet.
          </div>
        )}
      </div>

      {modal && (
        <TaskModal task={edit} close={() => setModal(false)} save={save} />
      )}
    </>
  );
}

function TaskModal({ task, close, save }) {
  const [f, setF] = useState(
    task || {
      title: '',
      description: '',
      dueDate: new Date().toISOString().slice(0, 10),
      priority: 'medium',
      status: 'pending',
    }
  );
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div className="fixed inset-0 bg-slate-900/30 z-50 grid place-items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl p-7">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black">
            {task ? 'Edit follow-up' : 'Add follow-up'}
          </h2>
          <button onClick={close}>
            <X />
          </button>
        </div>

        <div className="mt-6">
          <Field
            label="Title"
            value={f.title}
            onChange={(v) => set('title', v)}
            placeholder="Call Acme about proposal"
          />
          <label className="block mb-4">
            <span className="text-sm font-bold text-slate-600">Description</span>
            <textarea
              value={f.description || ''}
              onChange={(e) => set('description', e.target.value)}
              className="w-full mt-2 rounded-xl border border-slate-200 p-3 h-24"
            />
          </label>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field
              label="Due date"
              type="date"
              value={f.dueDate?.slice(0, 10) || ''}
              onChange={(v) => set('dueDate', v)}
            />
            <Select
              label="Priority"
              value={f.priority || 'medium'}
              onChange={(v) => set('priority', v)}
              options={['low', 'medium', 'high']}
            />
            <Select
              label="Status"
              value={f.status || 'pending'}
              onChange={(v) => set('status', v)}
              options={['pending', 'completed']}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => save(f)}
            className="px-5 py-3 rounded-xl gradient text-white font-bold"
          >
            Save follow-up
          </button>
        </div>
      </div>
    </div>
  );
}

function Generic({ title, endpoint, keyName, fields, icon: Icon, tags }) {
  const [data, setData] = useState([]);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const isContact = endpoint === '/contacts';

  const load = () =>
    api
      .get(endpoint, { params: q ? { search: q } : undefined })
      .then((r) => setData(r[keyName] || []))
      .catch(() => {});

  useEffect(load, [q]);

  const del = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(endpoint + '/' + id);
      load();
      toast.success('Deleted');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not delete');
    }
  };

  const save = async (f) => {
    try {
      if (edit) await api.put(endpoint + '/' + edit._id, f);
      else await api.post(endpoint, f);
      setModal(false);
      setEdit(null);
      load();
      toast.success(`${title.slice(0, -1)} saved`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not save');
    }
  };

  return (
    <>
      <Header
        title={title}
        sub={`Organize your ${title.toLowerCase()} in one place.`}
        action={
          <button
            onClick={() => {
              setEdit(null);
              setModal(true);
            }}
            className="gradient text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Add {title.slice(0, -1)}
          </button>
        }
      />

      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="outline-none flex-1"
            placeholder={`Search ${title.toLowerCase()}…`}
          />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
          {data.map((x) => (
            <div
              key={x._id}
              className="rounded-2xl border border-slate-100 p-5 bg-white"
            >
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 grid place-items-center">
                  <Icon size={18} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEdit(x);
                      setModal(true);
                    }}
                    className="text-slate-300 hover:text-sky-600"
                  >
                    <Edit3 size={17} />
                  </button>
                  <button
                    onClick={() => del(x._id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <div className="mt-4 font-black text-lg">
                {x.name || x.content?.slice(0, 70) || x.title}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {x.company || x.email || x.description || ''}
              </div>

              {x.email && (
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                  <Mail size={13} />
                  {x.email}
                </div>
              )}
              {x.phone && (
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Phone size={13} />
                  {x.phone}
                </div>
              )}
              {x.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {x.tags.map((t) => (
                    <span
                      className="text-xs bg-slate-100 rounded-full px-2 py-1"
                      key={t}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {!data.length && (
          <div className="p-12 text-center text-slate-400">No records yet.</div>
        )}
      </div>

      {modal && (
        <RecordModal
          title={title.slice(0, -1)}
          isContact={isContact}
          record={edit}
          close={() => setModal(false)}
          save={save}
        />
      )}
    </>
  );
}

function RecordModal({ title, isContact, record, close, save }) {
  const defaults = isContact
    ? { name: '', email: '', phone: '', company: '', title: '', tags: [] }
    : { content: '', pinned: false };
  const [f, setF] = useState(record || defaults);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div className="fixed inset-0 bg-slate-900/30 z-50 grid place-items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl p-7 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black">
            {record ? 'Edit' : 'Add'} {title}
          </h2>
          <button onClick={close}>
            <X />
          </button>
        </div>

        {isContact ? (
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Field
              label="Name"
              value={f.name}
              onChange={(v) => set('name', v)}
            />
            <Field
              label="Email"
              type="email"
              value={f.email || ''}
              onChange={(v) => set('email', v)}
            />
            <Field
              label="Phone"
              value={f.phone || ''}
              onChange={(v) => set('phone', v)}
            />
            <Field
              label="Company"
              value={f.company || ''}
              onChange={(v) => set('company', v)}
            />
            <Field
              label="Job title"
              value={f.title || ''}
              onChange={(v) => set('title', v)}
            />
          </div>
        ) : (
          <div className="mt-6">
            <label className="block">
              <span className="text-sm font-bold text-slate-600">Note</span>
              <textarea
                value={f.content || ''}
                onChange={(e) => set('content', e.target.value)}
                className="w-full mt-2 rounded-xl border border-slate-200 p-3 h-40"
                required
              />
            </label>
            <label className="flex items-center gap-3 mt-4 text-sm font-bold">
              <input
                type="checkbox"
                checked={!!f.pinned}
                onChange={(e) => set('pinned', e.target.checked)}
              />{' '}
              Pin note
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => save(f)}
            className="px-5 py-3 rounded-xl gradient text-white font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Pipeline ----------------------------- */

function Pipeline() {
  const [leads, setLeads] = useState([]);

  const load = () =>
    api
      .get('/leads')
      .then((r) => setLeads(r.leads))
      .catch(() => {});

  useEffect(load, []);

  const move = async (id, target) => {
    const l = leads.find((x) => x._id === id);
    if (!l || !stages.includes(target) || l.status === target) return;

    const next = leads.map((x) => (x._id === id ? { ...x, status: target } : x));
    setLeads(next);

    try {
      await api.patch('/leads/reorder', {
        updates: next.map((x, i) => ({ id: x._id, status: x.status, order: i })),
      });
      toast.success('Pipeline updated');
    } catch (e) {
      toast.error('Could not save pipeline change');
      load();
    }
  };

  return (
    <>
      <Header
        title="Pipeline"
        sub="Drag opportunities through your sales stages."
      />
      <div className="grid xl:grid-cols-5 gap-4 overflow-x-auto">
        {stages.map((s) => (
          <Column
            key={s}
            stage={s}
            leads={leads.filter((l) => l.status === s)}
            onDrop={move}
          />
        ))}
      </div>
    </>
  );
}

function Column({ stage, leads, onDrop }) {
  const drop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDrop(id, stage);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={drop}
      className="glass rounded-3xl p-3 min-w-250px"
    >
      <div className="flex justify-between p-2 mb-2">
        <div>
          <div className="font-black">{stageLabel[stage]}</div>
          <div className="text-xs text-slate-400">
            {leads.length} deals · {money(leads.reduce((a, l) => a + l.value, 0))}
          </div>
        </div>
        <GripVertical className="text-slate-300" size={18} />
      </div>

      <div className="space-y-3 min-h-32">
        {leads.map((l) => (
          <div
            key={l._id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', l._id)}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm cursor-grab"
          >
            <div className="font-bold">{l.name}</div>
            <div className="text-xs text-slate-400 mt-1">{l.company}</div>
            <div className="flex justify-between mt-4 text-sm">
              <span className="font-black">{money(l.value)}</span>
              <span className="text-slate-400">{l.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Settings ----------------------------- */

function SettingsPage({ me }) {
  const [name, setName] = useState(me.name);
  const [company, setCompany] = useState(me.company || '');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api
      .get('/ai/status')
      .then(setStatus)
      .catch(() => {});
  }, []);

  const save = async () => {
    try {
      await api.put('/auth/profile', { name, company });
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update');
    }
  };

  return (
    <>
      <Header title="Settings" sub="Profile, security and AI integration." />

      <div className="max-w-3xl space-y-5">
        <div className="glass rounded-3xl p-6">
          <h2 className="font-black text-lg">Profile</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <Field label="Display name" value={name} onChange={setName} />
            <Field label="Company" value={company} onChange={setCompany} />
          </div>
          <div className="mt-3 text-sm text-slate-400">Email · {me.email}</div>
          <button
            onClick={save}
            className="mt-5 gradient text-white px-5 py-3 rounded-xl font-bold"
          >
            Save changes
          </button>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="font-black text-lg">AI integration</h2>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="font-bold">Google Gemini</div>
              <div className="text-sm text-slate-500">
                {status?.model || 'gemini-2.5-flash'}
              </div>
            </div>
            <span
              className={`px-3 py-2 rounded-full text-xs font-bold ${
                status?.configured
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {status?.configured ? 'Connected' : 'Not configured'}
            </span>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="font-black text-lg">Account</h2>
          <div className="mt-4 text-sm text-slate-500">
            Role · <b>{me.role}</b>
          </div>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);