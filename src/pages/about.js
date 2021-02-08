import React from "react";
import Layout from "../components/Layout";
import {withPrefix} from "gatsby";

function TitleRow() {
  return(
    <div className="row">
        <div className="col-lg-12">
            <h1 className="page-header">Dan Rogers <small>About Me</small>
            </h1>
            <ol className="breadcrumb">
                <li><a href={withPrefix("/")}>Home</a>
                </li>
                <li className="active">About</li>
            </ol>
        </div>
    </div>
  );
}

function AboutRow() {
  return(
    <div className="row about-me">
        {/*
        <div className="col-lg-12">
            <h2 className="page-header">Dan Rogers</h2>
        </div>
        */}
        <div className="col-md-4">
            <img className="img-responsive" src={withPrefix("images/me.jpeg")} alt="Me" />
        </div>
        <div className="col-md-8">
            <p>Dan Rogers is employed as Director of a data science team at a large retail company. That means he spends a lot of time in meetings, but occassionally he also gets to actually do data science and even program. He also is married to the beautiful Meagan Rogers and has 3 kids.</p>
            <p>He began his career as a software developer, selling his first computer program when he was in 7th grade. Software development is still one of his passions - which is why he builds websites like this in his free time.</p>
            <p>Dan is also a math nerd. He minored in mathematics in college and changed his major to Finance after realizing Finance was just statistics with dollar signs. He enjoys the mathematics of gambling, but unlike gambling - where the house always win - finance comes with positive expective returns and is a much more rewarding game to play.</p>
            <p>On this site you'll find various content related to these themes. Mostly it will be content around software development (since that seems to be the thing that requires the most copious note-taking). There will also be some notes around finance, investment, mathematics, gambling, and even some hobby-related content such as Guitar Tabs.</p>
        </div>
    </div>
  );
}

/*
function TeamMember({name, title, description,
                     facebook, linkedin, twitter}) {
  return(
    <div className="col-md-4 text-center">
        <div className="thumbnail">
            <img className="img-responsive" src="https://placehold.it/750x450" alt="" />
            <div className="caption">
                <h3>{name}<br />
                    <small>{title}</small>
                </h3>
                <p>{description}</p>
                <ul className="list-inline">
                    <li><a href={twitter}><i className="fa fa-2x fa-facebook-square"></i></a>
                    </li>
                    <li><a href={linkedin}><i className="fa fa-2x fa-linkedin-square"></i></a>
                    </li>
                    <li><a href={twitter}><i className="fa fa-2x fa-twitter-square"></i></a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
}

function TeamMembers() {
  return(
    <div className="row">
        <div className="col-lg-12">
            <h2 className="page-header">Our Team</h2>
        </div>
        <TeamMember name="John Smith"
                    title="Job Title"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste saepe et quisquam nesciunt maxime."
                    facebook="#" linkedin="#" twitter="#"
                    />
        <TeamMember name="John Smith"
                    title="Job Title"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste saepe et quisquam nesciunt maxime."
                    facebook="#" linkedin="#" twitter="#"
                    />
        <TeamMember name="John Smith"
                    title="Job Title"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste saepe et quisquam nesciunt maxime."
                    facebook="#" linkedin="#" twitter="#"
                    />
        <TeamMember name="John Smith"
                    title="Job Title"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste saepe et quisquam nesciunt maxime."
                    facebook="#" linkedin="#" twitter="#"
                    />
        <TeamMember name="John Smith"
                    title="Job Title"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste saepe et quisquam nesciunt maxime."
                    facebook="#" linkedin="#" twitter="#"
                    />
        <TeamMember name="John Smith"
                    title="Job Title"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste saepe et quisquam nesciunt maxime."
                    facebook="#" linkedin="#" twitter="#"
                    />

    </div>
  );
}

function Customers() {
  return(
    <div className="row">
        <div className="col-lg-12">
            <h2 className="page-header">Our Customers</h2>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-6">
            <img className="img-responsive customer-img" src="https://placehold.it/500x300" alt="" />
        </div>
        <div className="col-md-2 col-sm-4 col-xs-6">
            <img className="img-responsive customer-img" src="https://placehold.it/500x300" alt="" />
        </div>
        <div className="col-md-2 col-sm-4 col-xs-6">
            <img className="img-responsive customer-img" src="https://placehold.it/500x300" alt="" />
        </div>
        <div className="col-md-2 col-sm-4 col-xs-6">
            <img className="img-responsive customer-img" src="https://placehold.it/500x300" alt="" />
        </div>
        <div className="col-md-2 col-sm-4 col-xs-6">
            <img className="img-responsive customer-img" src="https://placehold.it/500x300" alt="" />
        </div>
        <div className="col-md-2 col-sm-4 col-xs-6">
            <img className="img-responsive customer-img" src="https://placehold.it/500x300" alt="" />
        </div>
    </div>
  );
}
*/

export default function About() {
  return(
    <Layout>
    <div className="container">

        <TitleRow />
        <AboutRow />

        {/*
        <TeamMembers />
        <Customers />
        */}

    </div>
    </Layout>
  );
}
