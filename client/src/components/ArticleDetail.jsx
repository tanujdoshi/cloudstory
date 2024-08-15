import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Image, Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { storyDetail, convertToSpeech } from "../api/api";
import { useLanguage } from "../context/LanguageContext";
import { languageMapping } from "../mini/Languages";
import "../css/StoryDetail.css";

const ArticleDetail = () => {
  function getPollyLanguageCode(translateCode) {
    return languageMapping[translateCode] || null;
  }

  const { id } = useParams();
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const body = {
        id,
        languageCode: selectedLanguage.LanguageCode,
      };
      const data = await storyDetail(body);

      const pollyLanguage = getPollyLanguageCode(selectedLanguage.LanguageCode);
      console.log("pollyLanguage", pollyLanguage);
      if (pollyLanguage) {
        const bodyForPolly = {
          text: data.content,
          language: pollyLanguage,
        };
        const blob = await convertToSpeech(id, bodyForPolly);
        const audioUrl = URL.createObjectURL(blob);
        audioRef.current.src = audioUrl;
      }
      setStory(data);
    };
    fetchArticle();
  }, [selectedLanguage]);

  return (
    <Container className="mt-5 story-detail-container">
      <div className="audio-container text-center mb-4">
        <audio controls ref={audioRef} className="audio-player" />
      </div>
      {story ? (
        <Card className="shadow-lg rounded-lg story-card">
          <Card.Header className="bg-info text-white text-center story-header">
            <h1 className="story-title">{story.title}</h1>
          </Card.Header>
          <Card.Body className="story-body">
            <Row className="mb-4 justify-content-center">
              <Col md={8}>
                <Image
                  src={story.imageUrl}
                  fluid
                  className="rounded story-image"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div
                  dangerouslySetInnerHTML={{ __html: story.content }}
                  className="text-justify story-content"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <Row className="justify-content-center mt-5">
          <Col xs="auto" className="text-center">
            <Spinner animation="border" variant="primary" />
            <h3 className="mt-3">Loading...</h3>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ArticleDetail;
