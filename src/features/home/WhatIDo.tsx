import skillsData from '@/data/skills.json';
import Image from 'next/image';

interface Skill {
  name: string;
  icon: string | null;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  deployment: 'Deployment',
  devops: 'DevOps',
  tools: 'Tools',
};

const CATEGORY_ORDER = ['frontend', 'backend', 'database', 'deployment', 'devops', 'tools'];

export default function WhatIDo() {
  const allSkills = skillsData as Skill[];
  const uniqueSkills = allSkills.filter(
    (skill, index) => allSkills.findIndex((s) => s.name === skill.name) === index,
  );

  const categories = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    skills: uniqueSkills.filter((skill) => skill.category === category),
  })).filter((group) => group.skills.length > 0);

  return (
    <section
      className="w-full flex flex-col items-center justify-start bg-background relative md:py-20 sm:py-12 py-8"
      style={{
        backgroundImage: `
      radial-gradient(circle at 12% 14%, rgba(108,92,231,.13), transparent 26rem),
      radial-gradient(circle at 92% 78%, rgba(22,119,255,.10), transparent 28rem)
    `,
      }}
    >
      {/* Heading */}
      <div className="w-full container mx-auto md:px-6 px-3 mb-6 md:mb-12 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:pb-8 pb-4">
          <h2 className="text-5xl md:text-8xl font-medium tracking-tighter">Tech Stack

            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #6c5ce7" }}
            >
              /
            </span>
          </h2>
          <p className="hidden md:block text-base sm:text-lg md:text-xl text-muted-foreground md:max-w-xl leading-relaxed">
            The technologies I reach for across the frontend, backend, database, and deployment.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div id="skills" className="w-full container mx-auto px-3 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((group) => (
            <div
              key={group.category}
              className="bg-card border rounded-2xl p-6 transition-all duration-300"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-5">{group.label}</h3>
              <ul className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-background border"
                  >
                    {skill.icon ? (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={28}
                        height={28}
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      />
                    ) : (
                      <span
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg grid place-items-center text-[10px] text-white font-black bg-primary"
                        aria-label={skill.name}
                      >
                        {skill.name.trim().slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-20 dark:bg-white dark:text-neutral-900">
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}