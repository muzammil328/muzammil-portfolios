import { defineType, defineField } from 'sanity';

export const educationType = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'institution',
      type: 'string',
      title: 'Institution',
    }),
    defineField({
      name: 'area',
      type: 'string',
      title: 'Field of Study',
    }),
    defineField({
      name: 'studyType',
      type: 'string',
      title: 'Degree Type',
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      title: 'Start Date',
    }),
    defineField({ name: 'endDate', type: 'date', title: 'End Date' }),
    defineField({
      name: 'score',
      type: 'string',
      title: 'Score / GPA',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});
