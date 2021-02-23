# Futurestats Website

## Design Notes

The blog portion of this was designed using the [Gatsby starter blog](https://github.com/gatsbyjs/gatsby-starter-blog).  Some modifications inspired by [this post](https://www.jerriepelser.com/blog/sorting-out-gatsby-folder-structure/) were made.

Adding tags with [this site](https://dennytek.com/blog/personal-site-with-gatsby-part-7).

## Local Testing

You can test with:

```
gatsby develop
```

## Production Build

When building for production, use the following to build and then preview the
website locally:

```
gatsby clean
gatsby build --prefix-paths
gatsby serve --prefix-paths
```

If everything looks good you can push to production with:

```
gsutil rsync -Rd public gs://futurestats-website/
```

NOTE: The ```-d``` option deletes any files in the remote storage that do not
appear locally.  Make sure you are doing this in the right destination.
