import { Button, Col, Row, Typography } from "antd";
import Access from "../Access.js";

const SimpleTitle = ({ text, access, create }) => {
  return (
    <>
      <Row justify="space-between" gutter={(16, 16)}>
        <Col>
          <Typography.Title level={2}>{text}</Typography.Title>
        </Col>
          <Col xs={24} sm={10} md={8} lg={6} xl={6} xxl={6}>
            <Access availables={access} needed="create">
              <Button onClick={create} key="1" type="primary">
                Создать
              </Button>
            </Access>
          </Col>
      </Row>
    </>
  );
};

export default SimpleTitle;
