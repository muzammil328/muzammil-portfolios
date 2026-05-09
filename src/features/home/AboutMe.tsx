export default function AboutMe() {
  const deliveryItems = [
    {
      title: 'Frontend Experience Engineering',
      description:
        'Fast, accessible, and design-accurate interfaces built with reusable components and clean UX patterns.',
    },
    {
      title: 'Backend and API Architecture',
      description:
        'Scalable backend services, API contracts, and business logic that stay reliable as traffic grows.',
    },
    {
      title: 'Data and Infrastructure',
      description:
        'Practical database design, performance-first querying, and deployment-ready architecture from day one.',
    },
    {
      title: 'Maintainability',
      description:
        'Readable code, clear ownership boundaries, and scalable foundations that support long-term product growth.',
    },
  ];

  return (
    <section
      id="about"
      className="container mx-auto md:px-6 px-3 grid grid-cols-1 lg:grid-cols-2 md:gap-14 gap-6 items-center lg:py-16 md:py-12 sm:py-8 py-4"
    >
      <div className="flex flex-col gap-8">
        <h2 className="text-4xl md:text-6xl font-semibold leading-tight text-foreground">
          Building the bridge between ideas and{' '}
          <span className="italic text-primary/70">experiences</span>
        </h2>

        <p className="text-base md:text-[1.05rem] text-foreground/85 leading-8 max-w-2xl">
          I partner with founders and teams to turn ambitious product ideas into production-ready
          digital experiences. As a full stack developer, I handle everything from polished frontend
          interactions to reliable backend systems, with a strong focus on speed, quality, and
          maintainability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryItems.map(item => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-card/40 p-4 md:p-5 transition-colors hover:border-primary/40"
          >
            <h3 className="text-base md:text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-6">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
