import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import BlogSidebar from "../components/BlogSidebar";
import TagLink from "../components/TagLink";

function TitleRow({title, author}) {
  return(
    <div className="row">
        <div className="col-lg-12">
            <h1 className="page-header">{title} <small>by {author}</small></h1>
            <ol className="breadcrumb">
                <li><Link to="/">Home</Link>
                </li>
                <li className="active">Blog Post</li>
            </ol>
        </div>
    </div>
  );
}

function TagList({tags}) {
  const tagsList = (tags === undefined) ? [] : tags;
  return(
    <div>
      {
        tagsList.map((tag) => (
          <TagLink tag={tag}>
            <span className="label label-default">{tag}</span>{ }
          </TagLink>
        ))
      }
    </div>
  );
}

export default function BlogPost({ data }) {
  const post = data.markdownRemark;
  return (
    <Layout>
      <div className="container">
        <TitleRow title={post.frontmatter.title}
                  author={post.frontmatter.author}
                  />

        <div className="row">
          <div className="col-lg-8">
            <div className="blog-post-info">

              <div className="blog-post-info-date">
                <i className="fa fa-clock-o"></i> {post.frontmatter.date}
              </div>
              <div className="blog-post-info-tags">
                <TagList tags={post.frontmatter.tags} />
              </div>
            </div>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          <BlogSidebar />

        </div>
      </div>
    </Layout>
  )
}
export const query = graphql`
  query(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        author
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
