import React, { useState, useCallback, useRef, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageUploader from "quill-image-uploader";
import { useNavigate } from "react-router-dom";
import "../css/UploadStory.css";
import { saveStory, uploadImage } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Quill.register("modules/imageUploader", ImageUploader);

const ArticleUploadForm = () => {
  const navigate = useNavigate();
  const formats = [
    "header",
    "font",
    "list",
    "bold",
    "italic",
    "underline",
    "image",
    "code-block",
  ];
  const imageHandler = async (file) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      const res = await uploadImage(file);

      const link = res.data.url;
      const quillEditor = quillRef.current.getEditor();
      const range = quillEditor.getSelection(true);
      quillEditor.insertEmbed(range.index, "image", link);
    };
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", photo);
    formData.append("content", content);

    try {
      await saveStory(formData);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again");
      }
    }

    // navigate("/");
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <Container>
      <ToastContainer />
      <Row className="mt-5 text-center">
        <Col>
          <h2 className="upload-story-title">Upload Your Story</h2>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
        <Col md={8}>
          <div className="p-4 shadow-lg rounded bg-light upload-story-form">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle" className="mb-4">
                <Form.Label className="form-label-custom">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your story title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input-custom"
                />
              </Form.Group>

              <Form.Group controlId="formPhoto" className="mb-4">
                <Form.Label className="form-label-custom">Photo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required
                  className="form-input-custom"
                />
              </Form.Group>

              <Form.Group controlId="formContent" className="mb-4">
                <Form.Label>Content</Form.Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  defaultValue={content}
                  value={content}
                  onChange={setContent}
                  ref={quillRef}
                  className="quill-editor"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="btn-upload">
                Upload Story
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ArticleUploadForm;
