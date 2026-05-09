import { defineType, defineField } from 'sanity';

export const portfolioType = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    // 🔹 Profile Section
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'label', type: 'string', title: 'Title / Role' }),
    defineField({ name: 'email', type: 'string', title: 'Email' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone' }),
    defineField({ name: 'url', type: 'url', title: 'Website URL' }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Professional Summary',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({ name: 'city', type: 'string', title: 'City' }),
        defineField({ name: 'region', type: 'string', title: 'Region' }),
        defineField({ name: 'country', type: 'string', title: 'Country' }),
      ],
    }),

    defineField({
      name: 'profiles',
      title: 'Social Profiles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'network', type: 'string', title: 'Network' }),
            defineField({
              name: 'username',
              type: 'string',
              title: 'Username',
            }),
            defineField({ name: 'url', type: 'url', title: 'Profile URL' }),
          ],
        },
      ],
    }),

    // 🔹 Stats Section
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', type: 'string', title: 'Value' }),
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'color', type: 'string', title: 'Color' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});
