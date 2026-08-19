import { AlertCircle } from 'lucide-react';
import CandidateCard from './CandidateCard';
import CometLoader from './CometLoader';
import SparkIcon from './SparkIcon';

export default function ResultsPanel({ status, candidates, error }) {
  return (
    <div className="card-surface flex h-full min-h-[640px] flex-col">
      <div className="border-b border-card-border px-6 py-4">
        <h2 className="font-semibold text-heading">Results</h2>
        <p className="text-sm text-subtle">Ranked LinkedIn profiles</p>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden p-6">
        {status === 'idle' && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="spark-glow-circle mb-5 h-20 w-20">
              <SparkIcon className="h-10 w-10 text-ice" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-heading">Ready to search</h3>
            <p className="mt-2 max-w-xs text-sm text-subtle">
              Paste a job description, or restore a previous search from history below.
            </p>
          </div>
        )}

        {status === 'loading' && <CometLoader />}

        {status === 'error' && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-heading">Search failed</h3>
            <p className="mt-2 max-w-sm text-sm text-subtle">{error}</p>
          </div>
        )}

        {status === 'empty' && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold-muted">
              <SparkIcon className="h-7 w-7 text-gold" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-heading">No candidates matched</h3>
            <p className="mt-2 max-w-sm text-sm text-subtle">
              Try loosening your filters or broadening the job description.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
