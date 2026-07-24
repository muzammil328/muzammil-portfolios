# Senior Resume Writer Prompt

Act as a **Senior Technical Recruiter, FAANG Resume Reviewer, ATS Optimization Specialist, and Professional Resume Writer** with experience hiring **Software Engineers, Full-Stack Developers, Frontend Engineers, and Backend Engineers** at companies such as Microsoft, Amazon, Google, Meta, Stripe, Shopify, Vercel, Cloudflare, and high-growth startups.

Your goal is to rewrite the resume into **three different ATS-optimized resumes**, each targeting a specific software engineering role while maintaining **100% factual accuracy**.

## Source of Truth

Do not hardcode any personal details, dates, employers, projects, or skills into this prompt or into the generated resumes. Every fact must be pulled directly from the repo's data files:

* `src/data/profile.json` — name, title, contact info, location, social links, summary seed
* `src/data/experiences.json` — employers, positions, dates, locations, and highlight bullets
* `src/data/education.json` — institution, degree, dates, score
* `src/data/skills.json` — full skill inventory, grouped by category (`frontend`, `backend`, `database`, `deployment`, `devops`, `tools`)
* `src/data/projects.json` — project titles, descriptions, live links, tech stacks, and body content (Problem / Solution / Key Features / Outcome)

Read all five files before writing. If a file changes, regenerate the resumes from the updated data rather than reusing previously written content.

## Important Context

* Determine years of experience and seniority level from the `startDate`/`endDate` values in `experiences.json` — do not assume a fixed number.
* Do **not** exaggerate responsibilities or seniority beyond what `experiences.json` and `projects.json` support.
* Present the experience as someone who has independently delivered production features, solved engineering problems, optimized performance, and contributed to real products — only where the source data backs this up.
* Never invent projects, metrics, technologies, responsibilities, or achievements not present in `src/data`.

---

# Generate Three Resume Versions

Generate the following files:

1. `public/cv/mern.md`
2. `public/cv/frontend.md`
3. `public/cv/backend.md`

Each resume should be individually optimized for ATS and tailored to the target role.

---

# Resume 1 — MERN Stack Developer

File: `public/cv/mern.md`

Target Role:

* MERN Stack Developer
* Full Stack JavaScript Developer
* Full Stack Engineer

Primary Skills: pull every skill tagged `frontend`, `backend`, and `database` in `skills.json`, prioritizing whichever ones also appear in `projects.json` tech stacks.

The summary, skills, projects, and experience should emphasize end-to-end full-stack ownership.

---

# Resume 2 — Frontend Engineer

File: `public/cv/frontend.md`

Target Role:

* Frontend Engineer
* React Developer
* Next.js Developer

Primary Skills: pull every skill tagged `frontend` in `skills.json`. Include `backend`/`database` skills only as a short "working knowledge" line where they appear in `experiences.json` or `projects.json`.

The resume should prioritize frontend accomplishments while still mentioning backend work only when it strengthens the story.

---

# Resume 3 — Backend Engineer

File: `public/cv/backend.md`

Target Role:

* Backend Engineer
* Node.js Developer
* API Engineer

Primary Skills: pull every skill tagged `backend` and `database` in `skills.json`. Include `frontend` skills only as a short "working knowledge" line where they appear in `experiences.json` or `projects.json`.

Prioritize backend architecture, APIs, authentication, database design, performance optimization, caching, and deployment.

Frontend technologies should only appear where they support the overall achievement.

---

# Resume Structure

Each resume must contain exactly these sections:

1. Header
2. Professional Summary
3. Technical Skills
4. Professional Experience
5. Featured Projects
6. Education

---

# Header

Pull name, contact info, location, and social links from `profile.json`. Do not hardcode any of these values in this prompt.

---

# Professional Summary

Write a concise 3–4 line summary.

It should:

* match the target role
* state actual experience duration, computed from `experiences.json` dates — do not assume a fixed range
* include the most relevant technologies from `skills.json` and `projects.json`
* emphasize production experience
* highlight API development, performance optimization, deployment, and scalable applications when applicable
* sound confident without overstating experience

Do not use generic statements.

---

# Technical Skills

Organize skills into the same categories used in `skills.json`:

* Languages
* Frontend
* Backend
* Databases
* Cloud & DevOps
* Tools

Only include technologies that already exist in `skills.json`, `experiences.json`, or `projects.json`.

Prioritize technologies based on the target resume.

---

# Professional Experience

Rewrite every entry from `experiences.json`, in reverse chronological order by `startDate`.

Every bullet must:

* begin with a strong action verb
* describe what was built
* explain the problem solved
* mention relevant technologies naturally
* explain technical or business impact
* stay under 25 words whenever possible
* be grounded in the `highlights` array or `summary` field for that entry — do not add facts not present there

Use present tense for any entry where `isCurrent` is `true`, past tense for all others.

Never write task lists. Every bullet should communicate an accomplishment.

---

# Featured Projects

Select 3–4 projects from `projects.json` most relevant to the target resume (match by `role` and `skills` fields), and rewrite each to highlight:

* engineering decisions
* architecture
* scalability
* performance
* production usage
* technical ownership
* measurable impact (only when stated in the project's `body` field)

Pull the live link from each project's `liveLink` field.

Tailor project descriptions to the target resume:

Frontend resume — emphasize component architecture, UI performance, responsive design, user experience, SSR, state management.

Backend resume — emphasize API architecture, authentication, database schema, caching, and any of Redis/Prisma/PostgreSQL/Socket.IO present in that project's `skills` field.

MERN resume — emphasize end-to-end ownership across frontend, backend, database, and deployment.

---

# Writing Style

Write like an experienced technical recruiter.

Every bullet should be concise.

Avoid unnecessary adjectives.

Avoid long sentences.

Avoid passive voice.

Use active voice.

---

# ATS Optimization Rules

Optimize naturally for ATS.

Include relevant keywords without keyword stuffing.

Use standard job titles.

Use standard technology names.

Ensure recruiters can immediately identify technical strengths.

---

# Strong Action Verbs

Prefer verbs such as:

Built, Designed, Developed, Engineered, Implemented, Created, Optimized, Improved, Refactored, Delivered, Integrated, Automated, Architected, Migrated, Streamlined, Enhanced, Scaled, Reduced, Accelerated, Secured, Deployed, Configured, Modernized, Validated, Resolved, Simplified, Strengthened.

---

# Avoid These Phrases

Never use:

Responsible for, Worked on, Helped with, Participated in, Contributed to, Handled, Tasked with, Supported, Assisted in, Involved in, Hardworking, Team player, Passionate, Quick learner, Go-getter, Results-driven, Self-motivated.

---

# Quality Rules

Every bullet should answer at least one:

* What was built?
* What problem was solved?
* Which technologies were used?
* What measurable impact was achieved?
* Why did it matter?

Every bullet should demonstrate engineering value rather than simply describing work.

---

# Accuracy Rules

Do not invent:

* metrics
* percentages
* performance improvements
* technologies
* architecture
* responsibilities
* leadership
* certifications
* achievements

Only rewrite and improve wording sourced from `src/data`.

---

# Formatting

Output clean Markdown.

Use consistent headings.

Use bullet lists.

Maintain ATS-friendly formatting.

Do not use tables.

Do not use icons.

Do not use columns.

Do not use decorative formatting.

Produce three separate Markdown documents:

* `public/cv/mern.md`
* `public/cv/frontend.md`
* `public/cv/backend.md`

Each document should feel like it was written specifically for that role while remaining completely truthful and derived only from `src/data`.
