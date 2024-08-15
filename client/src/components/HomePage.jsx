import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getStories } from "../api/api";
import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [hoveredStory, setHoveredStory] = useState(null);

  useEffect(() => {
    console.log("get storiess");
    const fetchStories = async () => {
      const res = await getStories();
      setStories(res);
      console.log("ress", res);
    };
    fetchStories();
  }, []);

  const handleDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleMouseEnter = (id) => {
    setHoveredStory(id);
  };

  const handleMouseLeave = () => {
    setHoveredStory(null);
  };

  return (
    <Container>
      <Row className="mt-5 text-center">
        <Col>
          <h1 className="cloud-story-title">Welcome to CloudStory</h1>
        </Col>
      </Row>
      <Row>
        {stories.map((story) => (
          <Col key={story.id} sm={6} md={4} lg={3}>
            <Card
              className={`mb-4 story-card ${
                hoveredStory === story.id ? "story-card-hovered" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(story.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Img
                variant="top"
                src={story.imageUrl}
                className="story-image"
              />
              <Card.Body>
                <Card.Title className="story-title">{story.title}</Card.Title>

                <Button
                  className="story-button"
                  onClick={() => handleDetail(story.id)}
                >
                  Read More
                </Button>
                {/* <Link to={`/detail/${story.id}`}> */}
                {/* className="story-button btn">  */}
                {/* Read More
                </Link> */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
