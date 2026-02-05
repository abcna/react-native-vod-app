import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Tabs, Row, Col, Image, Divider, Rate, Card } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
export default function Tv() {
  const [Tv, setTv] = useState(null);
  const { id } = useParams();
  const { Meta } = Card;
  const { TabPane } = Tabs;
  useEffect(() => {
    fetch(
      `
          https://api.themoviedb.org/3/tv/${id}?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setTv(data));
  }, []);

  const [credit, setCredit] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/tv/${id}/credits?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((r) => r.json())
      .then((data) => setCredit(data.cast));
  }, []);

  return (
    <Row>
      <Col span={8}>
        {Tv && (
          <h1>
            <Image
              width={200}
              src={`https://image.tmdb.org/t/p/w500/${Tv.poster_path}`}
            />
          </h1>
        )}
        {Tv && <h1>{Tv.original_name} </h1>}
      </Col>
      <Col span={12}>
        {Tv && (
          <>
            <Divider orientation="left" plain>
              Total episode and seasson
            </Divider>
            <>
              Episode : {Tv.number_of_episodes} {""} {""} {"" }, Seasson :{" "}
              {Tv.number_of_seasons}{" "}
            </>
            <Divider orientation="left" plain>
              Vote Avarage
            </Divider>
            {Tv.vote_average}/10
            <Rate allowHalf defaultValue={Tv.vote_average / 2} />
            <Divider orientation="left" plain>
              OverView
            </Divider>
            {Tv.overview}
            <Divider orientation="left" plain>
              Ganre
            </Divider>
            {Tv.genres[0].name}
          </>
        )}
      </Col>
      <Col span={24}>
        <div
          style={{ border: " 2px #233a50", marginTop: 50 }}
          className="card-container"
        >
          <Tabs type="card" size="small">
            <TabPane tab="Last Season Detail" key="4">
              <Row>
                {" "}
                {Tv && (
                  <Col span={8}>
                    <h1>
                      Episode Number : {Tv.last_episode_to_air.episode_number}
                    </h1>{" "}
                  </Col>
                )}
                {Tv && (
                  <Col span={8}>
                    <h1>Episode Name : {Tv.last_episode_to_air.name} </h1>
                  </Col>
                )}
                {Tv && (
                  <Col span={8}>
                    <h1>Overview:</h1> {Tv.last_episode_to_air.overview}{" "}
                  </Col>
                )}
                {Tv && (
                  <Col span={8}>
                    <h1>Air Data: {Tv.last_episode_to_air.air_date} </h1>
                  </Col>
                )}
                {Tv && (
                  <Col span={8}>
                    <h1>
                      vote Average : {Tv.last_episode_to_air.vote_average}/10{" "}
                    </h1>
                  </Col>
                )}
                {Tv && <Col span={8}></Col>}{" "}
              </Row>
            </TabPane>
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
                                  title={post.name}
                                  description={post.name}
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
            {/* <TabPane tab="recommended" key="3">
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
                            <Link key={post.id} to={`/selebs/${post.id}`}>
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
            </TabPane> */}
          </Tabs>
        </div>
      </Col>
    </Row>
  );
}
