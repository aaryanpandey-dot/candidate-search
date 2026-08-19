import { useState } from 'react';
import {
  BarChart3,
  Briefcase,
  ChevronDown,
  Clock,
  History,
  MapPin,
  Minus,
  Plus,
  Search,
  Tag,
} from 'lucide-react';
import ResultsPanel from './components/ResultsPanel';
import SparkIcon from './components/SparkIcon';
import {
  EXAMPLE_JD,
  INITIAL_FORM_STATE,
  MOCK_SEARCH_HISTORY,
} from './constants';

function FieldLabel({ icon: Icon, iconClass, children }) {
  return (
    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-heading">
      <Icon className={`h-4 w-4 ${iconClass || 'text-ice'}`} />
      {children}
    </label>
  );
}

function HelperText({ children }) {
  return <p className="mt-1 text-xs italic text-subtle">{children}</p>;
}

const inputClass = 'input-dark';

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resultsStatus, setResultsStatus] = useState('idle');
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleExample = () => {
    updateField('jobDescription', EXAMPLE_JD);
  };

  const handleRestore = (entry) => {
    setForm({
      jobDescription: entry.jobDescription,
      keywords: entry.keywords,
      experienceMin: entry.experienceMin,
      experienceMax: entry.experienceMax,
      location: entry.location,
      companyName: entry.companyName,
      industry: entry.industry,
      mustInclude: entry.mustInclude,
      mustNotInclude: entry.mustNotInclude,
      numResults: entry.numResults,
    });
    setHistoryOpen(false);
  };

  const handleSearch = async () => {
    if (!form.jobDescription.trim()) return;

    setResultsStatus('loading');
    setError('');
    setCandidates([]);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const [response] = await Promise.all([
        fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            numResults: parseInt(form.numResults, 10) || 10,
          }),
        }),
        minDelay,
      ]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      if (!data.candidates?.length) {
        setResultsStatus('empty');
      } else {
        setCandidates(data.candidates);
        setResultsStatus('success');
      }
    } catch (err) {
      setError(err.message);
      setResultsStatus('error');
    }
  };

  const isSearchDisabled = !form.jobDescription.trim();

  return (
    <div className="cosmic-bg min-h-screen">
      <div className="meteorite meteorite-1" aria-hidden="true" />
      <div className="meteorite meteorite-2" aria-hidden="true" />

      <div className="cosmic-content">
        {/* Header */}
        <header className="border-b border-card-border bg-space-dark/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card-inset ring-1 ring-card-border">
                <SparkIcon className="h-5 w-5 text-ice" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-extrabold leading-tight tracking-tight text-heading">
                    Candidate Search
                  </h1>
                  <span className="rounded-full border border-gold/30 bg-gold-muted px-2.5 py-0.5 font-script text-sm font-semibold text-gold">
                    Built for Comet
                  </span>
                </div>
                <p className="text-xs text-subtle">JD → ranked LinkedIn profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-card-border bg-card px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-medium text-heading">Live</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-container px-6 py-10">
          {/* Hero */}
          <section className="relative mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-1.5 text-xs font-medium text-subtle shadow-glow-sm">
              <SparkIcon className="h-3.5 w-3.5 text-ice" />
              AI-powered, fearlessly fast candidate matching
            </div>
            <h2 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-heading md:text-5xl">
              Find the right candidates
              <br />
              from any job description
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-subtle">
              Paste a role, skills, and location. We extract requirements and return ranked
              LinkedIn profiles.
            </p>
          </section>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[45%_55%]">
            {/* Left column */}
            <div className="space-y-4">
              {/* Job description card */}
              <div className="card-surface">
                <div className="border-b border-card-border px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ice-muted">
                      <SparkIcon className="h-4 w-4 text-ice" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-heading">Job description</h3>
                      <p className="text-sm text-subtle">Paste your JD to find matching profiles</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-subtle">
                      DESCRIPTION
                    </span>
                    <button
                      type="button"
                      onClick={handleExample}
                      className="text-xs font-medium text-ice transition-colors hover:text-ice-dark"
                    >
                      Example
                    </button>
                  </div>

                  <textarea
                    value={form.jobDescription}
                    onChange={(e) => updateField('jobDescription', e.target.value)}
                    placeholder="Paste your job description here..."
                    rows={11}
                    className={`${inputClass} resize-none py-3`}
                  />

                  {/* Advanced filters accordion */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setFiltersOpen((o) => !o)}
                      className="flex w-full items-center justify-between rounded-xl border border-card-border bg-card-inset px-4 py-3 text-sm font-medium text-heading transition-colors hover:bg-card-hover"
                    >
                      Advanced filters
                      <ChevronDown
                        className={`h-4 w-4 text-subtle transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <div className={`accordion-content ${filtersOpen ? 'open' : ''}`}>
                      <div className="accordion-inner">
                        <div className="space-y-4 pt-4">
                          <div>
                            <FieldLabel icon={Tag}>Keywords / skills</FieldLabel>
                            <input
                              type="text"
                              value={form.keywords}
                              onChange={(e) => updateField('keywords', e.target.value)}
                              placeholder="Premiere Pro, Python, Figma..."
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <FieldLabel icon={Clock}>Experience (years)</FieldLabel>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="number"
                                min="0"
                                value={form.experienceMin}
                                onChange={(e) => updateField('experienceMin', e.target.value)}
                                placeholder="Min"
                                className={inputClass}
                              />
                              <input
                                type="number"
                                min="0"
                                value={form.experienceMax}
                                onChange={(e) => updateField('experienceMax', e.target.value)}
                                placeholder="Max"
                                className={inputClass}
                              />
                            </div>
                          </div>

                          <div>
                            <FieldLabel icon={MapPin}>Country / location</FieldLabel>
                            <input
                              type="text"
                              value={form.location}
                              onChange={(e) => updateField('location', e.target.value)}
                              placeholder="India, United States, UK..."
                              className={inputClass}
                            />
                            <HelperText>
                              Included in the search query (e.g. India, United States, UK).
                            </HelperText>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <FieldLabel icon={Briefcase}>Company name</FieldLabel>
                              <input
                                type="text"
                                value={form.companyName}
                                onChange={(e) => updateField('companyName', e.target.value)}
                                placeholder="Google, Netflix,"
                                className={inputClass}
                              />
                              <HelperText>
                                Hard filter — profiles must mention this company. Leave blank to skip.
                              </HelperText>
                            </div>
                            <div>
                              <FieldLabel icon={BarChart3}>Industry</FieldLabel>
                              <input
                                type="text"
                                value={form.industry}
                                onChange={(e) => updateField('industry', e.target.value)}
                                placeholder="Media and Entertainment..."
                                className={inputClass}
                              />
                              <HelperText>
                                Hard filter — profiles must mention this industry. Leave blank to skip.
                              </HelperText>
                            </div>
                          </div>

                          <div>
                            <FieldLabel icon={Plus} iconClass="text-success">
                              Must include in search
                            </FieldLabel>
                            <input
                              type="text"
                              value={form.mustInclude}
                              onChange={(e) => updateField('mustInclude', e.target.value)}
                              placeholder="youtube, documentary, editor..."
                              className={inputClass}
                            />
                            <HelperText>
                              Comma-separated. Woven into the search prompt as &quot;with ...&quot;. Leave
                              blank to skip.
                            </HelperText>
                          </div>

                          <div>
                            <FieldLabel icon={Minus} iconClass="text-red-400">
                              Must not include in search
                            </FieldLabel>
                            <input
                              type="text"
                              value={form.mustNotInclude}
                              onChange={(e) => updateField('mustNotInclude', e.target.value)}
                              placeholder="recruiter, agency, student..."
                              className={inputClass}
                            />
                            <HelperText>
                              Comma-separated. In the query as &quot;not ...&quot; and strictly filtered
                              from results (regex). Leave blank to skip.
                            </HelperText>
                          </div>

                          <div>
                            <FieldLabel icon={Search}>Results</FieldLabel>
                            <div className="relative">
                              <select
                                value={form.numResults}
                                onChange={(e) => updateField('numResults', e.target.value)}
                                className={`${inputClass} appearance-none`}
                              >
                                <option value="10">10 candidates</option>
                                <option value="25">25 candidates</option>
                                <option value="50">50 candidates</option>
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearchDisabled}
                    className={`btn-comet mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors ${
                      isSearchDisabled
                        ? 'cursor-not-allowed bg-ice/25 text-heading/50'
                        : 'bg-ice text-space-dark hover:bg-ice-dark'
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    Search Candidates
                  </button>
                </div>
              </div>

              {/* Search history card */}
              <div className="card-surface">
                <button
                  type="button"
                  onClick={() => setHistoryOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-subtle" />
                    <span className="font-semibold text-heading">Search history</span>
                    <span className="rounded-full border border-card-border bg-card-inset px-2.5 py-0.5 text-xs font-medium text-subtle">
                      {MOCK_SEARCH_HISTORY.length}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-subtle transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className={`accordion-content ${historyOpen ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="max-h-64 space-y-1 overflow-y-auto border-t border-card-border px-4 py-3">
                      {MOCK_SEARCH_HISTORY.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-card-hover"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-heading/90">{entry.snippet}</p>
                            <p className="text-xs text-subtle">{entry.timestamp}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRestore(entry)}
                            className="shrink-0 text-xs font-medium text-ice transition-colors hover:text-ice-dark"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-subtle">
                Built with Comet in mind — LinkedIn profile search for recruitment research
              </p>
            </div>

            {/* Right column */}
            <ResultsPanel status={resultsStatus} candidates={candidates} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}
