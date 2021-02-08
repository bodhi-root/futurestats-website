import React from "react";
import Layout from "../components/Layout";

import {Carousel} from "react-bootstrap";

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
                Links to Other Sites
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

function PortfolioEntry({link, image}) {
  return(
    <div className="col-md-4 col-sm-6">
        <a href={link}>
            <img class="img-responsive img-portfolio img-hover" src={image} alt="" />
        </a>
    </div>
  );
}

function PortfolioSection() {
  return(
      <div class="row">
          <div class="col-lg-12">
              <h2 class="page-header">Portfolio Heading</h2>
          </div>
          <PortfolioEntry link="portfolio-item.html" image="https://placehold.it/700x450" />
          <PortfolioEntry link="portfolio-item.html" image="https://placehold.it/700x450" />
          <PortfolioEntry link="portfolio-item.html" image="https://placehold.it/700x450" />
          <PortfolioEntry link="portfolio-item.html" image="https://placehold.it/700x450" />
          <PortfolioEntry link="portfolio-item.html" image="https://placehold.it/700x450" />
          <PortfolioEntry link="portfolio-item.html" image="https://placehold.it/700x450" />
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
            </div>
            <div className="col-md-6">
                <img className="img-responsive" src="images/sisyphus-shadow2.jpg" alt="Sisyphus" />
            </div>
        </div>

        <QuickLinkRow />
        {/*<PortfolioSection />*/}

    </div>
    </Layout>
  );
}
