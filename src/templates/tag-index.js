import React from "react";
import {graphql} from "gatsby";
import BlogPage from "../components/BlogPage";

export default function TagIndex({pageContext, data}) {
  return(
    <BlogPage tag={pageContext.tag} data={data}/>
  );
}

export const query = graphql`
  query(
    $tag: String!
  ) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: {content: {eq: "blog"}},
        frontmatter: {tags: {in: [$tag]}}
      }
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
