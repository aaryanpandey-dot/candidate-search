import { ExternalLink, MapPin } from 'lucide-react';
import SparkIcon from './SparkIcon';
import { getAvatarColor, getInitials, getScoreColor, isHighMatch } from '../constants';

export default function CandidateCard({ candidate }) {
  const { name, title, company, location, matchScore, matchedSkills, linkedinUrl } = candidate;
  const titleLine = [title, company].filter(Boolean).join(' · ');
  const highMatch = isHighMatch(matchScore);

  return (
    <div className="rounded-xl border border-card-border bg-card-inset p-4 shadow-glow-sm transition-shadow hover:border-ice/20 hover:shadow-glow">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-space-dark ${getAvatarColor(name)}`}
        >
          {getInitials(name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-heading">{name}</h3>
              {titleLine && (
                <p className="truncate text-sm text-subtle">{titleLine}</p>
              )}
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getScoreColor(matchScore)}`}
            >
              {highMatch && <SparkIcon className="h-3 w-3 text-success" />}
              {matchScore}% match
            </span>
          </div>

          {location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-subtle">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}

          {matchedSkills.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-ice/15 bg-ice-muted px-2 py-0.5 text-xs font-medium text-ice"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-subtle transition-colors hover:border-ice/40 hover:text-ice"
            >
              View LinkedIn
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
