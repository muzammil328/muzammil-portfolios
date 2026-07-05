import { defineType, defineField } from 'sanity';

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({ name: 'company', type: 'string', title: 'Company' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'company' },
    }),
    defineField({
      name: 'companyUrl',
      type: 'url',
      title: 'Company Website URL',
    }),
    defineField({
      name: 'position',
      type: 'string',
      title: 'Position',
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      title: 'Start Date',
    }),
    defineField({
      name: 'isCurrent',
      title: 'Currently Working Here',
      type: 'boolean',
      initialValue: false,
      description: 'Enable if you are currently working at this company',
    }),

    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({ name: 'city', type: 'string', title: 'City' }),
        defineField({ name: 'country', type: 'string', title: 'Country' }),
      ],
    }),
    defineField({
      name: 'endDate',
      type: 'string',
      title: 'End Date',
      hidden: ({ parent }) => parent?.isCurrent,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { isCurrent?: boolean } | undefined;

          if (parent?.isCurrent) {
            return true;
          }

          if (!value) {
            return true;
          }

          return /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? true
            : 'Must be a valid ISO-8601 formatted date string';
        }),
    }),
    defineField({ name: 'summary', type: 'text', title: 'Summary' }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'milestones',
      title: 'Milestones & Achievements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'url',
              title: 'Link',
              description: 'Optional external URL for this milestone',
            }),
            defineField({
              name: 'type',
              type: 'string',
              title: 'Type',
              options: {
                list: [
                  { title: 'Work Anniversary', value: 'anniversary' },
                  { title: 'Competition/Win', value: 'competition' },
                  { title: 'Celebration', value: 'celebration' },
                  { title: 'Annual Dinner', value: 'annualDinner' },
                  { title: 'Other', value: 'other' },
                ],
              },
              initialValue: 'other',
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Description',
            }),
            defineField({
              name: 'date',
              type: 'date',
              title: 'Date',
            }),
            defineField({
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'images.0',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'company',
      media: 'image',
    },
  },
});
