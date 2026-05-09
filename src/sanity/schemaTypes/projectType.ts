import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'priority',
      title: 'Priority (1 = highest)',
      type: 'number',
      validation: Rule =>
        Rule.required()
          .integer()
          .positive()
          .custom(async (value, context) => {
            if (value === undefined || value === null) return true;

            const client = context?.getClient?.({ apiVersion: '2024-01-01' });
            if (!client) return true;

            const rawId = context?.document?._id;
            if (!rawId) return true;

            const publishedId = rawId.replace(/^drafts\./, '');
            const draftId = `drafts.${publishedId}`;

            const existing = await client.fetch(
              `*[
                _type == "project" &&
                priority == $priority &&
                !(_id in [$draftId, $publishedId])
              ][0]`,
              {
                priority: value,
                draftId,
                publishedId,
              }
            );

            return existing ? `Priority ${value} is already used by another project` : true;
          }),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend Developer', value: 'frontend' },
          { title: 'Backend Developer', value: 'backend' },
          { title: 'Full Stack Developer', value: 'fullstack' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'company',
      title: 'Related Experience',
      type: 'reference',
      to: [{ type: 'experience' }],
    }),

    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      options: {
        list: [
          { title: 'Less than 1 month', value: 'less-1-month' },
          { title: '1-3 months', value: '1-3-months' },
          { title: '3-6 months', value: '3-6-months' },
          { title: '6-12 months', value: '6-12-months' },
          { title: 'More than 1 year', value: 'more-1-year' },
          { title: 'Ongoing', value: 'ongoing' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'sliderImages',
      title: 'Slider Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),

    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
    }),

    defineField({
      name: 'liveLink',
      title: 'Live Link',
      type: 'url',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'githubLink',
      title: 'GitHub Link',
      type: 'url',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'figmaDesign',
      title: 'Figma Design Link',
      type: 'url',
      validation: Rule =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'string',
      options: {
        list: [
          { title: '1 (Solo)', value: '1' },
          { title: '2', value: '2' },
          { title: '3-5', value: '3-5' },
          { title: '5-10', value: '5-10' },
          { title: '10-20', value: '10-20' },
          { title: '20+', value: '20+' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skills' }] }],
    }),

    defineField({
      name: 'problem',
      title: 'Problem',
      type: 'blockContent',
    }),

    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'blockContent',
    }),

    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'blockContent',
    }),


    defineField({
      name: 'outcome',
      title: 'Outcome / Results',
      type: 'blockContent',
    }),

    defineField({
      name: 'takeaways',
      title: 'Key Takeaways / Learnings',
      type: 'blockContent',
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'blockContent',
    }),

    defineField({
      name: 'myRole',
      title: 'My Role',
      type: 'blockContent',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'role',
      media: 'mainImage',
    },
    prepare({ title, subtitle, media }) {
      const roleMap: Record<string, string> = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        fullstack: 'Full Stack Developer',
      };

      return {
        title,
        subtitle: roleMap[subtitle] || subtitle,
        media,
      };
    },
  },
});
