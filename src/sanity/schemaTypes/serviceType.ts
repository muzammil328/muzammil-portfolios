import { defineField, defineType } from 'sanity';

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'skills',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skills' }] }],
    }),
    defineField({
      name: 'focus',
      title: 'Focus Areas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Short Description', type: 'string' }),
            defineField({
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Lucide icon name (e.g. layout, zap, code, shield, globe, layers)',
              options: {
                list: [
                  { title: 'Layout', value: 'layout' },
                  { title: 'Zap / Performance', value: 'zap' },
                  { title: 'Code', value: 'code' },
                  { title: 'Code 2', value: 'code-2' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Layers', value: 'layers' },
                  { title: 'Smartphone', value: 'smartphone' },
                  { title: 'Server', value: 'server' },
                  { title: 'Database', value: 'database' },
                  { title: 'Settings', value: 'settings' },
                  { title: 'Star', value: 'star' },
                  { title: 'Palette', value: 'palette' },
                  { title: 'Search', value: 'search' },
                  { title: 'Monitor', value: 'monitor' },
                  { title: 'Git Branch', value: 'git-branch' },
                  { title: 'Lock', value: 'lock' },
                  { title: 'Cpu', value: 'cpu' },
                  { title: 'Box', value: 'box' },
                  { title: 'Rocket', value: 'rocket' },
                ],
                layout: 'dropdown',
              },
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Short Description', type: 'string' }),
            defineField({
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              options: {
                list: [
                  { title: 'Check Circle', value: 'check-circle' },
                  { title: 'Layout', value: 'layout' },
                  { title: 'Zap', value: 'zap' },
                  { title: 'Code', value: 'code' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Layers', value: 'layers' },
                  { title: 'Server', value: 'server' },
                  { title: 'Database', value: 'database' },
                  { title: 'File Text', value: 'file-text' },
                  { title: 'Git Branch', value: 'git-branch' },
                  { title: 'Lock', value: 'lock' },
                  { title: 'Cpu', value: 'cpu' },
                  { title: 'Box', value: 'box' },
                  { title: 'Rocket', value: 'rocket' },
                ],
                layout: 'dropdown',
              },
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 2,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'idealClient',
      title: 'Ideal Client',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'timeline',
      title: 'Typical Timeline',
      type: 'string',
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({
          name: 'model',
          title: 'Pricing Model',
          type: 'string',
          options: {
            list: [
              { title: 'Fixed', value: 'fixed' },
              { title: 'Hourly', value: 'hourly' },
              { title: 'Retainer', value: 'retainer' },
            ],
            layout: 'dropdown',
          },
        }),
        defineField({
          name: 'startingAt',
          title: 'Starting At',
          type: 'number',
        }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'USD',
        }),
      ],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Service',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'proofPoints',
      title: 'Proof Points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'value', type: 'string', title: 'Value' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'quote', type: 'text', rows: 3, title: 'Quote' }),
            defineField({ name: 'author', type: 'string', title: 'Author' }),
            defineField({ name: 'role', type: 'string', title: 'Role / Company' }),
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
