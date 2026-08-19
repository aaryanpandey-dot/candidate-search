import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Exa from 'exa-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const exa = process.env.EXA_API_KEY ? new Exa(process.env.EXA_API_KEY) : null;

function parseCommaList(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function condenseJobDescription(jd, maxLength = 400) {
  const cleaned = jd.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + '…';
}

function buildSearchQuery({
  jobDescription,
  keywords,
  location,
  companyName,
  industry,
  mustInclude,
  mustNotInclude,
}) {
  const parts = [condenseJobDescription(jobDescription)];

  const keywordList = parseCommaList(keywords);
  if (keywordList.length) {
    parts.push(`Skills: ${keywordList.join(', ')}`);
  }

  if (location?.trim()) {
    parts.push(`based in ${location.trim()}`);
  }

  if (companyName?.trim()) {
    parts.push(`at ${companyName.trim()}`);
  }

  if (industry?.trim()) {
    parts.push(`in ${industry.trim()}`);
  }

  const includeTerms = parseCommaList(mustInclude);
  if (includeTerms.length) {
    parts.push(`with ${includeTerms.join(', ')}`);
  }

  const excludeTerms = parseCommaList(mustNotInclude);
  if (excludeTerms.length) {
    parts.push(`not ${excludeTerms.join(', ')}`);
  }

  return parts.join(' ');
}

function buildExcludeRegex(terms) {
  if (!terms.length) return null;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(escaped.join('|'), 'i');
}

function parseYear(dateStr) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

function estimateExperienceYears(workHistory) {
  if (!Array.isArray(workHistory) || !workHistory.length) return null;

  const currentYear = new Date().getFullYear();
  let totalMonths = 0;

  for (const job of workHistory) {
    const startYear = parseYear(job.startDate || job.from);
    const endYear = parseYear(job.endDate || job.to) || currentYear;
    if (startYear) {
      totalMonths += Math.max(0, (endYear - startYear) * 12);
    }
  }

  if (totalMonths === 0) return null;
  return Math.round(totalMonths / 12);
}

function getPersonEntity(result) {
  if (!Array.isArray(result.entities)) return null;
  return result.entities.find((e) => e.type === 'person') || result.entities[0] || null;
}

function getMatchedSkills(result, skillTerms) {
  if (!skillTerms.length) return [];
  const haystack = [
    result.title,
    result.text,
    result.summary,
    JSON.stringify(result.entities || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return skillTerms.filter((term) => haystack.includes(term.toLowerCase()));
}

function mapResultToCandidate(result, index, numResults, skillTerms) {
  const person = getPersonEntity(result);
  const props = person?.properties || {};

  let name = props.name;
  if (!name && result.title) {
    name = result.title.split('|')[0].split(' - ')[0].trim();
  }
  if (!name) name = 'Unknown';

  const workHistory = props.workHistory || [];
  const latestJob = workHistory[0] || {};
  const title = latestJob.title || latestJob.position || '';
  const company = latestJob.company || latestJob.companyName || '';
  const location = props.location || '';

  const matchScore = Math.max(
    60,
    Math.min(98, Math.round(100 - index * (40 / Math.max(numResults, 1))))
  );

  return {
    id: result.id || result.url || `candidate-${index}`,
    name,
    title,
    company,
    location,
    matchScore,
    matchedSkills: getMatchedSkills(result, skillTerms),
    linkedinUrl: result.url,
  };
}

app.post('/api/search', async (req, res) => {
  try {
    const {
      jobDescription,
      keywords = '',
      experienceMin,
      experienceMax,
      location = '',
      companyName = '',
      industry = '',
      mustInclude = '',
      mustNotInclude = '',
      numResults = 10,
    } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    if (!exa) {
      return res.status(500).json({
        error: 'EXA_API_KEY is not configured. Add it to your .env file.',
      });
    }

    const query = buildSearchQuery({
      jobDescription,
      keywords,
      location,
      companyName,
      industry,
      mustInclude,
      mustNotInclude,
    });

    const excludeRegex = buildExcludeRegex(parseCommaList(mustNotInclude));
    const skillTerms = [
      ...parseCommaList(keywords),
      ...parseCommaList(mustInclude),
    ];
    const uniqueSkillTerms = [...new Set(skillTerms.map((s) => s.toLowerCase()))].map(
      (lower) => skillTerms.find((s) => s.toLowerCase() === lower)
    );

    const minExp = experienceMin !== '' && experienceMin != null ? Number(experienceMin) : null;
    const maxExp = experienceMax !== '' && experienceMax != null ? Number(experienceMax) : null;

    const searchResponse = await exa.search(query, {
      category: 'people',
      includeDomains: ['linkedin.com'],
      numResults: numResults || 10,
      contents: {
        text: { maxCharacters: 1000 },
        summary: { query: 'Professional background and relevant skills' },
      },
    });

    const rawResults = searchResponse.results || [];

    let filtered = rawResults.filter((result) => {
      if (excludeRegex) {
        const text = [result.title, result.text, result.summary].filter(Boolean).join(' ');
        if (excludeRegex.test(text)) return false;
      }

      const person = getPersonEntity(result);
      const workHistory = person?.properties?.workHistory || [];
      const years = estimateExperienceYears(workHistory);

      if (minExp != null && !Number.isNaN(minExp) && years != null && years < minExp) {
        return false;
      }
      if (maxExp != null && !Number.isNaN(maxExp) && years != null && years > maxExp) {
        return false;
      }

      if (companyName?.trim()) {
        const haystack = [
          result.title,
          result.text,
          result.summary,
          JSON.stringify(workHistory),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(companyName.trim().toLowerCase())) return false;
      }

      if (industry?.trim()) {
        const haystack = [result.title, result.text, result.summary].join(' ').toLowerCase();
        if (!haystack.includes(industry.trim().toLowerCase())) return false;
      }

      return true;
    });

    const candidates = filtered.map((result, index) =>
      mapResultToCandidate(result, index, numResults || 10, uniqueSkillTerms)
    );

    res.json({ candidates, query });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      error: err.message || 'Search failed. Please try again.',
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, exaConfigured: !!exa });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
