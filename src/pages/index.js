import React from "react";
import {withPrefix} from "gatsby";
import {Carousel} from "react-bootstrap";

import Layout from "../components/Layout";

function CarouselHeader () {
  return(
    <header className="header-carousel">
      <Carousel>
        <Carousel.Item>
          <div className="fill" style={{"background-image":"url('images/banner-large.jpg')"}}></div>
          <Carousel.Caption>
            <h2>Forecasting</h2>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="fill" style={{"background-image":"url('images/stockmarket-banner.jpg')"}}></div>
          <Carousel.Caption>
            <h2>Investments &amp; Finance</h2>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className="fill" style={{"background-image":"url('images/casino-banner.jpg')"}}></div>
          <Carousel.Caption>
            <h2>Statistics &amp; Probabilities</h2>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </header>
  );
}

function QuickLinkRow() {
  return(
    <div className="row">
        <div className="col-lg-12">
            <h1 className="page-header">
                My Other Sites
            </h1>
        </div>
        <div className="col-md-4">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4><i className="fa fa-fw fa-book"></i> Dan's Notes</h4>
                </div>
                <div className="panel-body">
                    <p>A wiki-like collection of notes on various topics (mainly Computer Technology and Programming)</p>
                    <a href="https://bodhi-root.github.io/public-wiki/" className="btn btn-default">View Notes</a>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4><i className="fa fa-fw fas fa-usd"></i> Gambling Statistics</h4>
                </div>
                <div className="panel-body">
                    <p>A short book I started writing on statistics and gambling. I've always enjoyed calculating probabilities for these games - like the Wizard of Odds, but not as all-encompassing.</p>
                    <a href="https://bodhi-root.github.io/gambling-stats-bookdown/" className="btn btn-default">Read Book</a>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4><i className="fa fa-fw fas fa-music"></i> Guitar Tabs</h4>
                </div>
                <div className="panel-body">
                    <p>A curated collection of Guitar Tabs I like to play. This is a static site built with Metalsmith that anyone should be able to copy and build thieir own songbook.</p>
                    <a href="https://bodhi-root.github.io/guitar-tabs/" className="btn btn-default">View Tabs</a>
                </div>
            </div>
        </div>
    </div>
  );
}

/* image recommended to be 700x400 */
function PortfolioEntry({title, image, link, description}) {
  return(
    <div className="col-lg-4 col-sm-6 portfolio-item">
      <div className="panel panel-default">
        <div className="panel-heading">
          <a href={link}>
            <img src={image} alt="" />
          </a>
        </div>
        <div className="panel-body">
          <h4 className="panel-title">
            <a href={link}>{title}</a>
          </h4>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

function PortfolioSection() {
  return(
      <div>
        <div class="row">
          <div className="col-lg-12">
            <h1 className="page-header">
              Featured Blog Entries
            </h1>

          </div>
        </div>
        <div class="row">
            <PortfolioEntry title="Retirement Planning"
                            link={withPrefix("/blog/20121029-retirement-planning/")}
                            image={withPrefix("/blog/20121029-retirement-planning/savings-targets.png")}
                            description="Guidelines for planning retirement, including savings targets by age and changes to portfolio selection over time."/>

            <PortfolioEntry title="P/E Ratios and S&P 500 Returns"
                            link={withPrefix("/blog/20170813-pe-ratios-and-sp500-returns/")}
                            image={withPrefix("/blog/20170813-pe-ratios-and-sp500-returns/cnbc-chart.png")}
                            description="One of the best predictive models for stock-market return over the next couple of years is based on Shiller's P/E Ratio."/>

            <PortfolioEntry title="Simple GCP Web App"
                            link={withPrefix("/blog/20210303-simple-webapp-in-gcp/")}
                            image={withPrefix("/blog/20210303-simple-webapp-in-gcp/preview.png")}
                            description="Re-usable code for creating a GCP webapp that stores data in Firestore and images in GCS. Dropwizard is used for the web service."/>
        </div>
      </div>
  );
}



export default function Home() {
  return(
    <Layout>
    <CarouselHeader />

    <div className="container">

        <div className="row">
            <div className="col-lg-12">
                <h2 className="page-header">Dan's Home Page</h2>
            </div>
            <div className="col-md-6">
                <p>This page is intended to be both a blog and a home page from which you can jump to any of my various projects. At the moment I have 3 public projects that each have their own purpose and look-and-feel. These can be found immediately below this section. I'd also like to keep a blog - mainly of technical articles - including articles on how these various sites were developed. I've tried to keep a blog in the past though, and that didn't last very long. Maybe this time will be different.</p>
                <p>
                <a href={withPrefix("/blog/")} className="btn btn-primary">View Blog</a>
                </p>
            </div>
            <div className="col-md-6">
                <img className="img-responsive" src="images/sisyphus-shadow2.jpg" alt="Sisyphus" />
            </div>
        </div>

       <PortfolioSection />
       <QuickLinkRow />


    </div>
    </Layout>
  );
}
