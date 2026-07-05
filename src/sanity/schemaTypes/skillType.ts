import { defineField, defineType } from 'sanity';

export const skillType = defineType({
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Brand Color (hex)',
      type: 'string',
      description: 'Hex color for badge styling in the What I Do section (e.g. #3178C6)',
    }),
    defineField({
      name: 'icon',
      title: 'Icon / Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'Expert', value: 'expert' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'yearsUsed',
      title: 'Years Used',
      type: 'number',
      description: 'How many years you have used this skill',
      validation: (Rule) => Rule.min(0).max(30),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Skill',
      type: 'boolean',
      description: 'Pin this skill to the top of skill lists',
      initialValue: false,
    }),
    defineField({
      name: 'news',
      title: 'Newly Added',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'One Line Description',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'icon',
    },
  },
});
