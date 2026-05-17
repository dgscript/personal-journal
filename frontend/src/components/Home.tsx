import TypeIt from "typeit-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "../styles/home.css";

export default function Home() {
  const texts = [
    {
      title: "Two Cold Cups",
      text: `Today felt slower than usual. I made coffee twice and forgot to drink
        both cups. Sat by the window for a while, not thinking about much. The
        afternoon light came in at a good angle, and for a moment, everything
        felt exactly as it should be. I didn't want to move.`,
    },
    {
      title: "Just Ordinary",
      text: `Ran into someone I used to know. We smiled, said the usual things —
        how are you, so good to see you. Walking away, I couldn't decide if it
        was good or sad. Then I realized it was probably neither. Maybe it was
        just ordinary, and that's fine too.`,
    },
    {
      title: "Permission to Want",
      text: `I wrote a list of things I want to do before the month ends. Goals,
        small promises to myself. Then I lost the list somewhere between the
        couch and the kitchen. Starting over feels less like failure and more
        like permission to want different things now. So I got a new piece of paper.`,
    },
  ];

  return (
    <>
      <div className="home-container">
        <div className="home-hero">
          <p>PERSONAL WRITING SPACE</p>
          <h2>
            Words worth{" "}
            <span>
              <TypeIt
                options={{
                  strings: [
                    "keeping.",
                    "writing.",
                    "saving.",
                    "preserving.",
                    "documenting.",
                    "expressing.",
                  ],
                  speed: 300,
                  nextStringDelay: 5000,
                  loop: true,
                  breakLines: false,
                }}
              />
            </span>
          </h2>
          <p className="hero-desc">
            A quiet corner of the internet to write, reflect, and share what
            matters to you.
          </p>
          <Link to={{ pathname: "/write" }}>START WRITING - IT'S FREE</Link>
        </div>

        <div className="home-card">
          <p>EXPRESS YOURSELF</p>

          <p>What's on your mind today?</p>

          <p>
            Today felt slower than usual. I made coffee twice and forgot to
            drink both cups. The afternoon light came in at a good angle, and
            for a moment, everything felt exactly as it should be.
          </p>
        </div>

        {texts.map((content, index) => (
          <div className="semi-cards" key={index}>
            <p>{content.title}</p>
            <p>{content.text}</p>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
