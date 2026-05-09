import { defineField, defineType } from 'sanity';

export const skillType = defineType({
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'type',
      title: 'Skill Type',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'Database', value: 'database' },
          { title: 'DevOps', value: 'devops' },
          { title: 'Cloud', value: 'cloud' },
          { title: 'Tools', value: 'tools' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({ name: 'news', type: 'boolean' }),
    defineField({
      name: 'description',
      title: 'One Line Description',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'SVG or Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
