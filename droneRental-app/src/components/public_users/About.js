import React from "react";

const teamMembers = [
  {
    name: "Darshan Dhongade",
    role: "Software Developer",
    image: "/assets/img/darshan.png",
  },
  {
    name: "Sanika Karade",
    role: "Software Developer",
    image: "/assets/img/sanika.png",
  },
  {
    name: "Pruthviraj Mane",
    role: "Software Developer",
    image: "/assets/img/Pruthviraj1.jpg",
  },
  {
    name: "Harshada Tapase",
    role: "Software Developer",
    image: "/assets/img/harshada.jpg",
  },
  {
    name: "Gaurav Rathod",
    role: "Software Developer",
    image: "/assets/img/Gaurav.jpg",
  },
];

const About = () => {
  return (
    <div style={{ scrollBehavior: "smooth" }}>
      {/* HERO SECTION */}
      <div
        className="about-hero py-5"
        style={{ backgroundColor: "#e76f51", color: "#fff" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
                About <span style={{ color: "#fff" }}>SkyFleet</span>
              </h1>
              <p className="lead mt-3">
                Empowering aerial innovation — one drone, one mission, one
                flight at a time.
              </p>
              <div className="mt-4 d-flex flex-wrap gap-3">
                <a href="#mission" className="btn btn-light fw-bold px-4 py-2">
                  <i className="fas fa-bullseye me-2"></i>Our Mission
                </a>
                <a
                  href="#team"
                  className="btn btn-outline-light fw-bold px-4 py-2"
                >
                  <i className="fas fa-users me-2"></i>Meet Our Team
                </a>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="/assets/img/team.jpg"
                alt="Team Collaboration"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "350px", borderRadius: "12px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* OUR MISSION SECTION */}
      <div id="mission" className="py-5" style={{ backgroundColor: "#fdf2ee" }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ color: "#e76f51" }}>
            Our Mission
          </h2>
          <p className="fs-5 text-muted">
            At SkyFleet Rentals, our mission is to democratize access to drone
            technology and empower individuals and businesses through safe,
            affordable, and innovative drone rental services. We aim to lead the
            future of aerial mobility with trust, efficiency, and cutting-edge
            solutions.
          </p>
        </div>
      </div>

      {/* MEET OUR TEAM SECTION */}
      <div id="team" className="pb-5" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold" style={{ color: "#e76f51" }}>
              Meet Our Team
            </h3>
            <p className="text-muted">
              A passionate team dedicated to delivering next-level aerial
              experiences
            </p>
          </div>

          {/* All Cards */}
          <div className="row justify-content-center">
            {teamMembers.map((member, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div className="card team-card h-100 shadow text-center border-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="card-img-top"
                    style={{ height: "320px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{member.name}</h5>
                    <p className="card-text text-muted">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INLINE STYLES FOR HOVER */}
      <style>{`
        .team-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .team-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default About;
