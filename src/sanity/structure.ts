import type { StructureResolver } from 'sanity/structure';

const skillTypeSections = [
  { title: 'Frontend', value: 'frontend' },
  { title: 'Backend', value: 'backend' },
  { title: 'Database', value: 'database' },
  { title: 'DevOps', value: 'devops' },
  { title: 'Cloud', value: 'cloud' },
  { title: 'Tools', value: 'tools' },
  { title: 'Other', value: 'other' },
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio Website')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      S.listItem()
        .title('Portfolios')
        .child(
          S.documentTypeList('portfolio')
            .title('Portfolios')
            .child((documentId) => S.document().schemaType('portfolio').documentId(documentId)),
        ),
      S.documentTypeListItem('education').title('Education'),
      S.documentTypeListItem('experience').title('Experience'),
      S.divider(),
      S.listItem()
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .child((documentId) => S.document().schemaType('project').documentId(documentId)),
        ),
      S.listItem()
        .title('Services')
        .child(
          S.documentTypeList('service')
            .title('Services')
            .child((documentId) => S.document().schemaType('service').documentId(documentId)),
        ),
      S.listItem()
        .title('Skills')
        .child(
          S.list()
            .title('Skills')
            .items([
              S.listItem()
                .title('All Skills')
                .child(
                  S.documentTypeList('skills')
                    .title('All Skills')
                    .child((documentId) =>
                      S.document().schemaType('skills').documentId(documentId),
                    ),
                ),
              S.listItem()
                .title('Uncategorized')
                .child(
                  S.documentList()
                    .title('Uncategorized Skills')
                    .schemaType('skills')
                    .filter('_type == "skills" && !defined(type)')
                    .child((documentId) =>
                      S.document().schemaType('skills').documentId(documentId),
                    ),
                ),
              S.divider(),
              ...skillTypeSections.map((section) =>
                S.listItem()
                  .title(section.title)
                  .child(
                    S.documentList()
                      .title(section.title)
                      .schemaType('skills')
                      .filter('_type == "skills" && type == $type')
                      .params({ type: section.value })
                      .child((documentId) =>
                        S.document().schemaType('skills').documentId(documentId),
                      ),
                  ),
              ),
            ]),
        ),
    ]);
