import React from "react";
import { useEffect, useState } from "react";
import YouTube from "@u-wave/react-youtube";
import { useParams } from "react-router";
import { Tabs, Row, Col, Image, Divider, Rate, Card } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
export default function Movie() {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const { id } = useParams();
  const [Movies, setMovies] = useState(null);

  const [credit, setCredit] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((r) => r.json())
      .then((data) => setCredit(data.cast));
  }, []);
  // console.log(credit);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data));
  }, []);

  const [trailer, setTrailer] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setTrailer(data.results));
  }, []);
  console.log(trailer);
  const [similar, setSimilar] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=1`
    )
      .then((r) => r.json())
      .then((data) => setSimilar(data.results));
  }, []);

  const { Meta } = Card;
  const { TabPane } = Tabs;
  return (
    <Row>
      <Col span={8}>
        {Movies && (
          <h1>
            <Image
              width={200}
              src={`https://image.tmdb.org/t/p/w500/${Movies.poster_path}`}
            />
          </h1>
        )}
      </Col>
      <Col span={12}>
        {Movies && (
          <>
            <Divider orientation="left" plain>
              Original name
            </Divider>
            <p>{Movies.original_title}</p>
            <Divider orientation="left" plain>
              Vote Avarage
            </Divider>
            {Movies.vote_average}/10
            <Rate allowHalf defaultValue={Movies.vote_average / 2} />
            <Divider orientation="left" plain>
              OverView
            </Divider>
            {Movies.overview}
            <Divider orientation="left" plain>
              Ganre
            </Divider>
            {Movies.genres[0].name}
          </>
        )}
      </Col>
      <Col span={24}>
        <div
          style={{ border: " 2px #233a50", marginTop: 50 }}
          className="card-container"
        >
          <Tabs type="card" size="small">
            <TabPane tab="Actors" key="2">
              <Swiper
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
                style={{ height: 350 }}
              >
                <Row>
                  {" "}
                  {credit && (
                    <Col>
                      {credit.map((post) => (
                        <SwiperSlide>
                          <Col>
                            <Link key={post.id} to={`/selebs/${post.id}`}>
                              <Card
                                bodyStyle={{ height: 300 }}
                                hoverable
                                style={{ width: 240, border: "solid black" }}
                                cover={
                                  <img
                                    alt={post.name}
                                    src={`https://image.tmdb.org/t/p/w500/${post.profile_path}`}
                                  />
                                }
                              >
                                <Meta
                                  title={post.titel}
                                  description={post.titel}
                                />
                              </Card>
                            </Link>
                          </Col>
                        </SwiperSlide>
                      ))}
                    </Col>
                  )}
                </Row>
                ...
              </Swiper>
            </TabPane>
            <TabPane tab="all actors pic" key="1">
              <Row>
                {" "}
                {credit && (
                  <Col>
                    {credit.map((post) => (
                      <Image
                        width={100}
                        alt={post.name}
                        src={`https://image.tmdb.org/t/p/w500/${post.profile_path}`}
                      />
                    ))}
                  </Col>
                )}
              </Row>
            </TabPane>
            <TabPane tab="Trailer" key="6">
              <Row>
                {trailer && (
                  <Col>
                    <iframe
                      width="420"
                      height="315"
                      src={`https://www.youtube.com/embed/${trailer[0].key}`}
                    ></iframe>
                  </Col>
                )}
              </Row>
            </TabPane>
            <TabPane tab="recommended" key="3">
              <Swiper
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
                style={{ height: 350 }}
              >
                <Row>
                  {" "}
                  {similar && (
                    <Col>
                      {similar.map((post) => (
                        <SwiperSlide>
                          <Col>
                            <Link key={post.id} to={`/movie/${post.id}`}>
                              <Card
                                bodyStyle={{ height: 300 }}
                                hoverable
                                style={{ width: 240, border: "solid black" }}
                                cover={
                                  <img
                                    alt={post.name}
                                    src={`https://image.tmdb.org/t/p/w500/${post.poster_path}`}
                                  />
                                }
                              >
                                <Meta
                                  title={post.titel}
                                  description={post.titel}
                                />
                              </Card>
                            </Link>
                          </Col>
                        </SwiperSlide>
                      ))}
                    </Col>
                  )}
                </Row>
                ...
              </Swiper>
            </TabPane>
          </Tabs>
        </div>
      </Col>
    </Row>
  );

  // Movies && <h1>{Movies.title}</h1>;

  //   Tv && <h1> {Tv.name}</h1>;
}
