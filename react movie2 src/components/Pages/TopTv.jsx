import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Row, Col, Button, Card, Pagination, Rate, Spin } from "antd";
import { Link } from "react-router-dom";

export default function TopTv() {
  const [post, setPost] = useState({});
  const { results = [] } = post;
  const { Meta } = Card;
  const [loading, setLoading] = useState(false);
  function Changepagination(page) {
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => setPost(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://api.themoviedb.org/3/tv/top_rated?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=1"
    )
      .then((response) => response.json())
      .then((data) => setPost(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Spin spinning={loading}>
        <Row>
          {results.map((post) => (
            <Col key={post.id} xs={24} sm={12} md={8} xl={6}>
              <Link key={post.id} to={`/tv/${post.id}`}>
                {" "}
                <Card
                  style={{ marginTop: 50 }}
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src={`https://image.tmdb.org/t/p/w500/${post.poster_path}`}
                    />
                  }
                >
                  <Meta title={post.original_title} />
                  <Rate
                    style={{ fontSize: 10 }}
                    allowHalf
                    value={post.vote_average / 2}
                  />
                </Card>
              </Link>
            </Col>
          ))}
          <Row style={{ marginTop: 20 }} justify="center">
            <Col>
              <Pagination
                onChange={Changepagination}
                current={post.page}
                defaultCurrent={1}
                showSizeChanger={false}
                defaultCurrent={20}
                total={post.total_results}
              />
            </Col>
          </Row>
        </Row>
      </Spin>
    </>
  );
}
