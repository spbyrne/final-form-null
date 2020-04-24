import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { useLocalRemarkForm } from "gatsby-tinacms-remark"
import {
  useInlineForm,
  InlineForm,
  InlineTextField,
} from "react-tinacms-inline"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const [post, form] = useLocalRemarkForm(data.markdownRemark)
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <InlineForm form={form}>
      <Layout location={location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article>
          <header>
            <EditToggle />
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              <InlineTextField name="rawFrontmatter.title" />
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date}
            </p>
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <footer>
            <Bio />
          </footer>
        </article>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    </InlineForm>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      ...TinaRemark
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`

const EditToggle = () => {
  const { status, deactivate, activate } = useInlineForm()

  return (
    <button
      onClick={() => {
        status === "active" ? deactivate() : activate()
      }}
    >
      {status === "active" ? "Preview" : "Edit"}
    </button>
  )
}
