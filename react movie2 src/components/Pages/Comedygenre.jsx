import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Row, Col, Button, Card, Pagination, Rate, Spin } from "antd";
import { Link } from "react-router-dom";

export default function Comedygenre() {
  const [post, setPost] = useState({});
  const { results = [] } = post;
  const { Meta } = Card;
  const [loading, setLoading] = useState(false);
  function Changepagination(page) {
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=35&without_genres=16&with_watch_monetization_types=flatrate`
    )
      .then((response) => response.json())
      .then((data) => setPost(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=35&without_genres=16&with_watch_monetization_types=flatrate"
    )
      .then((response) => response.json())
      .then((data) => setPost(data))
      .finally(() => setLoading(false));
  }, []);
  // .filter((i) => i.genre_ids[0] === 17 || 18)

  return (
    <>
      <Spin spinning={loading}>
        <Row>
          {results.map((post) => (
            <Col key={post.id} xs={24} sm={12} md={8} xl={6}>
              <Link key={post.id} to={`/movie/${post.id}`}>
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
