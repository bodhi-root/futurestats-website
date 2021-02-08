const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const _ = require('lodash');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  // for all markdown nodes we set three properties:
  // - slug - A "slug" path to use for this page
  // - content - The name of the directory inside '/content'
  // - relativePath - The relativePath file property
  //
  // 'content' is particularly useful for grouping related
  //  objects together.
  if (node.internal.type === "MarkdownRemark") {

    const slug = createFilePath({ node, getNode });
    var relativePath = "";
    var content = "";

    const parentNode = getNode(node.parent)
    if (parentNode && parentNode.internal.type === `File`) {

      relativePath = parentNode.relativePath;
      if (parentNode.sourceInstanceName === "content") {
        content = relativePath.split("/")[0];
      }
    }

    createNodeField({node, name: "slug", value: slug});
    createNodeField({node, name: "relativePath", value: relativePath});
    createNodeField({node, name: "content", value: content});
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: {fields: {content: {eq: "blog"}}}
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            tags
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes;

  let tags = [];

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`);
  posts.forEach((post, index) => {
    const previousPostId = index === 0 ? null : posts[index - 1].id
    const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

    createPage({
      path: post.fields.slug,
      component: blogPostTemplate,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
      },
    });

    tags = tags.concat(post.frontmatter.tags);
  });

  // create Tags pages
  const tagIndexTemplate = path.resolve(`./src/templates/tag-index.js`);

  tags = _.uniq(tags);  // Eliminate duplicate tags

  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagIndexTemplate,
      context: {
        tag,
      },
    });
  });

}
