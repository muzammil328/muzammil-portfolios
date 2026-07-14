import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType, table, tableRow, tableCell } from './blockContentType';

import { skillType } from './skillType';
import { serviceType } from './serviceType';
import { projectType } from './projectType';

import { portfolioType } from './portfolioType';

import { experienceType } from './experienceType';
import { educationType } from './educationType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    table,
    tableRow,
    tableCell,
    projectType,
    skillType,
    serviceType,
    portfolioType,
    experienceType,
    educationType,
  ],
};
