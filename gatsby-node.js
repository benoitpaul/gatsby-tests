exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  createTypes([
    schema.buildObjectType({
      name: `Post`,
      fields: {
        id: { type: `ID!` },
        title: { type: "String!" },
        authors: {
          type: "[Person!]!",
          resolve: (source, args, context, info) => {
            return context.nodeModel
              .getAllNodes({ type: "Person" })
              .filter(person => source.authors.includes(person.email));
          },
        },
        body: {
          type: "String!",
          resolve(source, args, context, info) {
            const type = info.schema.getType(`Mdx`);
            const mdxNode = context.nodeModel.getNodeById({
              id: source.parent,
            });
            const resolver = type.getFields()["body"].resolve;
            return resolver(mdxNode, {}, context, {
              fieldName: "body",
            });
          },
        },
      },
      interfaces: [`Node`],
    }),

    schema.buildObjectType({
      name: `Person`,
      fields: {
        id: { type: `ID!` },
        name: { type: "String!" },
        email: { type: "String!" },
        bio: {
          type: "String!",
          resolve(source, args, context, info) {
            const type = info.schema.getType(`Mdx`);
            const mdxNode = context.nodeModel.getNodeById({
              id: source.parent,
            });
            const resolver = type.getFields()["body"].resolve;
            return resolver(mdxNode, {}, context, {
              fieldName: "body",
            });
          },
        },
      },
      interfaces: [`Node`],
    }),
  ]);
};

exports.onCreateNode = ({ node, getNode, actions, createNodeId }) => {
  const { createNode, createParentChildLink } = actions;
  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);
    const collection = parent.sourceInstanceName;

    if (collection === "posts") {
      const mdxPost = {
        title: node.frontmatter.title,
        authors: node.frontmatter.authors,
        body: node.rawBody,
      };
      createNode({
        id: createNodeId(`${node.id} >>> Post`),
        ...mdxPost,
        parent: node.id,
        internal: {
          type: "Post",
          contentDigest: node.internal.contentDigest,
        },
      });
    } else if (collection === "persons") {
      const mdxPerson = {
        name: node.frontmatter.name,
        email: node.frontmatter.email,
        bio: node.rawBody,
      };

      createNode({
        id: createNodeId(`${node.id} >>> Person`),
        ...mdxPerson,
        parent: node.id,
        internal: {
          type: "Person",
          contentDigest: node.internal.contentDigest,
        },
      });
    }
  }
};
