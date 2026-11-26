import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
export default function AdminLayout() {
  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col lg={3} xl={2}><AdminSidebar /></Col>
        <Col lg={9} xl={10}><Outlet /></Col>
      </Row>
    </Container>
  );
}
