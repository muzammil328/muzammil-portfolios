# Step 4: Rewrite Resume for ATS

You are an expert technical resume writer and ATS optimization specialist.
Use the analysis from Step 1 (Match table, Fit Score, Keyword Priority,
Where You're Weak) — do not re-derive keyword matching, it's already done.
Pull verified data only from the CV and Personal Data above. Do not invent
experience. Do not add skills the user does not have.

Write the rewritten resume below.

---

## Resume Examples: Before vs After

### Example 1 — MERN Stack Role

❌ BEFORE:

> Full Stack Developer Side Project | 2024–Present
>
> - Worked on a web application using React and Node.js
> - Responsible for API integrations and database management
> - Used Git for version control and collaborated with team members

Problems: "Worked on", "Responsible for" — passive and vague. No metrics. No
named technologies. Reads like a job description, not achievements.

✅ AFTER:

> Full Stack Developer Urban DTF (urbandtf.app) | 2024–Present
>
> - Built a production Next.js + TypeScript frontend handling 100+ daily orders
>   with real-time order tracking via Socket.IO
> - Integrated Stripe subscription billing and PostgreSQL Prisma ORM for secure
>   payment data
> - Deployed on Vercel with CI/CD, reducing release time from 2 hours to 15
>   minutes

Why it works: Named project with live URL, strong verbs (Built, Integrated,
Deployed), quantified results (100+ daily orders, 2hr → 15min), every skill maps
to a real outcome.

### Example 2 — React Frontend Role

❌ BEFORE:

> Frontend Developer Devmate Solution | 2025–2026
>
> - Developed responsive user interfaces using React and Tailwind CSS
> - Improved user experience through better state management
> - Worked with REST APIs and handled authentication

✅ AFTER:

> Frontend Developer (Remote) Devmate Solution | Aug 2025 – Jan 2026
>
> - Delivered 5 responsive React + Tailwind UIs for a CRM system serving 200+
>   wholesale clients
> - Reduced API load times 40% by replacing Redux with TanStack Query and
>   implementing caching
> - Built role-based auth with Clerk, securing financial reporting dashboards
>   for 15 admin users

---

## Resume Structure

### Header

- Name (from CV or Personal Data, not hardcoded)
- Title — use the most relevant title from the target job's required
  skills/keyword priority (e.g. if the job leads with "Frontend Engineer",
  use that instead of a generic title if the role is frontend-focused)
  - **Explicitly state the role** in the title: frontend-focused → a
    frontend title (e.g. "Frontend Engineer", "React Developer");
    backend-focused → a backend title (e.g. "Backend Engineer", "Node.js
    Developer").
- Email, Phone, Portfolio URL (from Personal Data)
- LinkedIn / GitHub (only if relevant to the role)
- Location (city, country — no full address)

**Format:**

```
[Name]
[Target Role Title]
[Email] · [Phone] · [Portfolio] · [Location]
```

### Professional Summary (2-3 lines, optional but recommended)

- Lead with years of experience + primary tech stack
- Mention 1 named value with a live URL
- End with the role type you're targeting
- **NO soft skills.** No "passionate", "dedicated", "motivated"

**Example:**

> Frontend engineer with 2+ years building production React + Next.js apps.
> Launched Treepost AI (treepost.ca), a marketplace connecting homeowners to
> contractors. Targeting React/Next.js roles with TypeScript and Tailwind.

### Technical Skills

- List ONLY skills you have evidence for in the CV or Personal Data
- Group by category if space allows: **Frontend** | **Backend** | **Database** |
  **Cloud**
- **NO skill gaps.** If a required skill is missing, do NOT list it here.
- 1-2 lines maximum. This section gets skimmed — bullets are what matter.

### Work Experience / Projects

**Content Split Rule:**

- If the role is **frontend-focused**, make **60% of the content frontend** (UI,
  components, state management, styling, performance) and **40% backend** (APIs,
  auth, database).
- If the role is **backend-focused**, make **60% of the content backend** (APIs,
  database, architecture, scaling, auth) and **40% frontend** (UI, components,
  state management).

For each role or project, follow this exact format:

**Company Position:**

```
[Role Title]
[Company Name] | [Date Range]
- [Strong verb] [what you built] using [technology] → [measurable result]
- [Strong verb] [what you built] using [technology] → [measurable result]
- [Strong verb] [what you built] using [technology] → [measurable result]
- [Strong verb] [what you built] using [technology] → [measurable result]
```

**Side Project:**

```
[Project Title]
[Project Name] ([Live URL if available]) | [Date Range]
- [Strong verb] [what you built] using [technology] → [measurable result]
- [Strong verb] [what you built] using [technology] → [measurable result]
- [Strong verb] [what you built] using [technology] → [measurable result]
```

#### Bullet Rules

- **Strong verbs only.** Use: Built, Deployed, Designed, Architected,
  Integrated, Optimized, Launched, Reduced, Streamlined, Automated.
- **Banned verbs:** Worked on, Responsible for, Assisted with, Helped to,
  Participated in, Involved in, Contributed to.
- **Every bullet must include:**
  1. A strong verb
  2. A named technology (only if it's in the job's required skills or the
     user's actual stack)
  3. A quantifiable or concrete result
- **Bullet count per role:**
  - **Company positions:** 4 bullets per company
  - **Side projects:** 3 bullets per project
- **Weave in required skills naturally.** If the keyword is "Next.js" and you
  used it, say "Built the frontend with Next.js and TypeScript" — not "I know
  Next.js".

#### Keyword Integration Strategy

Reuse the Match table from Step 1:

| Match Status (from Step 1) | Action                                          |
| --------------------------- | ------------------------------------------------ |
| HAVE                         | Strengthen the bullet with a metric or live URL |
| PARTIAL                      | Reword the bullet to use the exact required term |
| MISSING (user has it elsewhere) | Add a new bullet or weave into an existing one |
| MISSING (user lacks it)      | Do NOT mention it |

### Education (brief)

- Degree, Institution, Year
- 1 line maximum
- No GPA unless exceptional

### Certifications (only if relevant)

- Title, Provider, Year
- Only include if the certification maps to a required skill

---

## Final Validation Checklist

Run this before outputting the resume:

- [ ] Passive voice is ZERO — no "was responsible for", "worked on", "helped
      with"
- [ ] Every bullet has a strong verb + metric or named outcome
- [ ] Company positions have exactly 4 bullets; projects have exactly 3 bullets
- [ ] Required skills are present naturally, not stuffed
- [ ] No soft skills anywhere ("team player", "passionate", "excellent
      communication")
- [ ] No invented experience — every claim traceable to the CV or Personal Data
- [ ] Live URLs included for relevant projects
- [ ] ATS-friendly: no tables, no columns, standard headers
- [ ] **Readability test:** Read the resume aloud. Every bullet should sound
      like an achievement, not a job description.
