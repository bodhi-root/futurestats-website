import React from "react";
import {graphql, withPrefix, Link} from "gatsby";

import Layout from "../components/Layout";
import BlogSidebar from "../components/BlogSidebar";
import TagLink from "../components/TagLink";

function TitleRow({tag}) {
  const tagText = (tag === undefined) ? "All" : tag;
  return(
    <div className="row">
        <div className="col-lg-12">
            <h1 className="page-header">Blog Entries <small>{tagText}</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href={withPrefix("/")}>Home</a>
                </li>
                <li className="active">Blog</li>
            </ol>
        </div>
    </div>
  );
}

/*
function BlogEntryOld({title, description, author, posted, image, link}) {
  return(
    <div>
      <h2>
          <a href={link}>{title}</a>
      </h2>
      <p className="lead">
          by <a href="#">{author}</a>
      </p>
      <p><i className="fa fa-clock-o"></i> Posted on {posted}</p>
      <hr />
      <a href={link}>
          <img className="img-responsive img-hover" src={image} alt="" />
      </a>
      <hr />
      <p>{description}}</p>
      <a className="btn btn-primary" href={link}>Read More <i className="fa fa-angle-right"></i></a>

      <hr />
    </div>
  );
}
*/

function TagList({tags}) {
  const tagsList = (tags === undefined) ? [] : tags;
  return(
    <div className="blog-list-tags">
      {
        tagsList.map((tag) => (
          <TagLink tag={tag}>
            <span className="label label-primary">{tag}</span>{ }
          </TagLink>
        ))
      }
    </div>
  );
}

function BlogEntry({title, description, author, tags, image, link}) {
  return(
    <div>
    <div className="row">
      <div className="col-md-12">
        <h3>
          <Link to={link}>{title}</Link> <small>by {author}</small>
        </h3>
        <TagList tags={tags} />
      </div>
      <div className="col-md-6 img-blog-preview">
          <Link to={link}>
              <img className="img-responsive img-hover" src={image} alt="" />
          </Link>
      </div>
      <div className="col-md-6">
          <p>{description}</p>
          <div>
            <a className="btn btn-primary" href={link}>Read More <i className="fa fa-angle-right"></i></a>
          </div>

      </div>
    </div>
    <hr/>
    </div>
  );
}

function BlogEntries({nodes}) {
  return(
    <div>
      {nodes.map(({ node }) => (
        <BlogEntry key={node.id}
                   title={node.frontmatter.title}
                   author={node.frontmatter.author}
                   description={node.frontmatter.description}
                   tags={node.frontmatter.tags}
                   image={withPrefix("/"+node.frontmatter.image.relativePath)}
                   link={node.fields.slug}
                   />
      ))}

    </div>
  );
}

/*
function BlogEntryNew({title, description, image, link}) {
  return(
    <div className="col-md-6 img-portfolio">
        <a href="portfolio-item.html">
            <img className="img-responsive img-hover" src={image} alt="" />
        </a>
        <h3>
            <a href={link}>{title}</a>
        </h3>
        <p>{description}</p>
    </div>
  );
}

function BlogEntriesNew() {
  return(
    <div>
      <div className="row">
         <BlogEntry title="Project Name"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae."
                    image="https://placehold.it/700x400"
                    link="portfolio-item.html" />
         <BlogEntry title="Project Name"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae."
                    image="https://placehold.it/700x400"
                    link="portfolio-item.html" />
      </div>
      <div className="row">
         <BlogEntry title="Project Name"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae."
                    image="https://placehold.it/700x400"
                    link="portfolio-item.html" />
         <BlogEntry title="Project Name"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae."
                    image="https://placehold.it/700x400"
                    link="portfolio-item.html" />
      </div>
      <div className="row">
         <BlogEntry title="Project Name"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae."
                    image="https://placehold.it/700x400"
                    link="portfolio-item.html" />
         <BlogEntry title="Project Name"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae."
                    image="https://placehold.it/700x400"
                    link="portfolio-item.html" />
      </div>
    </div>
  );
}
*/

export default function BlogPage({tag, data}) {
  return(
    <Layout>
      <div className="container">
        <TitleRow tag={tag} />

        <div className="row">
          <div className="col-md-8">
            <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
          </div>
          <div className="col-md-8">

              <hr />

              <BlogEntries nodes={data.allMarkdownRemark.edges} />

              {/*
              <ul className="pager">
                  <li className="previous">
                      <a href="#older">&larr; Older</a>
                  </li>
                  <li className="next">
                      <a href="#newer">Newer &rarr;</a>
                  </li>
              </ul>
              */}

          </div>
          <BlogSidebar />
        </div>

      </div>
    </Layout>
  );
}
