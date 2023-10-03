import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ClipboardIcon,
  FlagIcon,
  GlobeEuropeAfricaIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { trpc } from "../../../trpc";
import "./index.scss";

export default function LandingHome() {
  return (
    <div id="home">
      <Hero />
      <About />
      <Features />
      <Partners />
    </div>
  );
}

function Hero() {
  const query = trpc.info.getCurrentSession.useQuery();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const startDay = query.data?.date_start?.getDate();
  const endDay = query.data?.date_end?.getDate();
  const month = months[query.data?.date_end?.getMonth() ?? 0];
  const year = query.data?.date_end?.getFullYear();

  const sessionDateString =
    query.isLoading || !query.data
      ? ""
      : `${startDay} - ${endDay} ${month} ${year}`;

  return (
    <div id="hero">
      <div id="blur">
        <div>
          <div id="text">
            <div>
              <h1>Rome International MUN</h1>

              <p>
                A pathway towards a better understanding of the world among
                brilliant young leaders and future citizens of tomorrow.
              </p>
            </div>

            <div id="cta">
              <Link to="/dashboard/news" className="btn btn-lg btn-primary">
                Sign up
              </Link>
              <div id="dates">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{sessionDateString}</span>
              </div>
            </div>

            <div id="scroll">
              <ChevronDownIcon className="w-4 h-4" />
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="section">
      <div className="text-container">
        <h1 className="title" id="about">
          What is RIMUN?
        </h1>
        <p>
          RIMUN is a MUN conference that started in 2007 and aims to carry out a
          simulation of the operations of the United Nations.
        </p>
        <p>
          Every year more than <b>600 students</b> coming from different high
          schools around the world gather together to debate about social,
          economic and international issues.
        </p>
        <p>
          Participants are divided into <b>committees</b> and <b>commissions</b>{" "}
          and are asked to find innovative and creative solutions to the tasks
          they are given while working with their peers.
        </p>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="section">
      <div className="container">
        <h2 className="title">Why RIMUN?</h2>
        <div id="features">
          <div>
            <div className="features__card">
              <ArrowPathIcon />
              <div className="features__card__text">
                <h2>For students, by students</h2>
                <p>
                  We are proud to say that RIMUN is a <b>non-profit</b> project
                  which is entirely organized by passionate young students who
                  took part in previous sessions
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="features__card">
              <SparklesIcon />
              <div className="features__card__text">
                <h2>Our awards</h2>
                <p>
                  RIMUN has been awarded the <b>Silver Plate</b> from the
                  Presidency of the Republic and the <b>Patronage</b> from the
                  Prime Minister’s Office
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="features__card">
              <ClipboardIcon />
              <div className="features__card__text">
                <h2>Our conference</h2>
                <p>
                  Having reached high conference standards has allowed us to be
                  granted the <b>THIMUN</b> affiliation, which permits us to use
                  the THIMUN Rules of Procedure
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="features__card">
              <GlobeEuropeAfricaIcon />
              <div className="features__card__text">
                <h2>Worlwide family</h2>
                <p>
                  Year by year we're building a wide network of excellent
                  schools around the globe
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="features__card">
              <FlagIcon />
              <div className="features__card__text">
                <h2>Committees & Commissions</h2>
                <p>
                  A wider range of topics going from economic and social issues
                  to special political matters
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="features__card">
              <UserGroupIcon />
              <div className="features__card__text">
                <h2>Learning, discovery, growth</h2>
                <p>
                  Acting as delegates, brilliant young students face current hot
                  international issues
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const images = {
  unhcr: require("../../../assets/img/partners/unhcr.webp"),
  ffi: require("../../../assets/img/partners/future-food-institute.webp"),
  intersos: require("../../../assets/img/partners/intersos.png"),
  ec: require("../../../assets/img/partners/european-commission.png"),
  stc: require("../../../assets/img/partners/save-the-children.jpg"),
  cd: require("../../../assets/img/partners/camera-deputati.png"),
  "blood-water": require("../../../assets/img/partners/blood-water.png"),
  enea: require("../../../assets/img/partners/enea.png"),
  pat: require("../../../assets/img/partners/pat.png"),
  rural: require("../../../assets/img/partners/rural.png"),
  treeapp: require("../../../assets/img/partners/treeapp.png"),
  wet: require("../../../assets/img/partners/wet.png"),
  crea: require("../../../assets/img/partners/crea.png"),
};

function Partners() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Meet our partners</h1>

        <div id="partners">
          <img loading="lazy" src={images.unhcr} alt="UNHCR" />
          <img loading="lazy" src={images.ffi} alt="Future Food Institute" />
          <img loading="lazy" src={images.intersos} alt="INTERSOS" />
          <img loading="lazy" src={images.ec} alt="European Commission" />
          <img loading="lazy" src={images.stc} alt="Save the Children" />
          <img loading="lazy" src={images.cd} alt="Camera dei Deputati" />
          <img loading="lazy" src={images["blood-water"]} alt="Blood Water" />
          <img loading="lazy" src={images.enea} alt="ENEA" />
          <img loading="lazy" src={images.pat} alt="Plant a Tree" />
          <img loading="lazy" src={images.rural} alt="IFAD" />
          <img loading="lazy" src={images.treeapp} alt="TreeApp" />
          <img loading="lazy" src={images.wet} alt="WET" />
          <img loading="lazy" src={images.crea} alt="CREA" />
        </div>

        <div id="extra">
          <p>
            with the patronage of the
            <b>Food and Agriculture Organization of the United Nations (FAO)</b>
            and <b>Ministero degli Esteri</b>
          </p>
        </div>
      </div>
    </div>
  );
}
