import React from "react";
import {graphql} from "gatsby";

import BlogPage from "../components/BlogPage";

export default function BlogIndex({data}) {
  return(
    <BlogPage tag="All" data={data} />
  );
}

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: {fields: {content: {eq: "blog"}}}
    )
    {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            author
            description
            tags
            image {relativePath}
            date
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`;
