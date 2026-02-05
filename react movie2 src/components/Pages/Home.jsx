import React from "react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Card, Row, Col, Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Carousel, Divider } from "antd";
import { Link } from "react-router-dom";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import { useEffect, useState } from "react";
export default function Home() {
  const [upcomingpost, setUpComingPost] = useState([]);
  const [loadings, setloading] = useState(false);
  useEffect(() => {
    setloading(true);
    fetch(
      "https://api.themoviedb.org/3/movie/385128/recommendations?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=1"
    )
      .then((response) => response.json())
      .then((data) => setUpComingPost(data.results))
      .finally(() => setloading(false));
  }, []);
  const [popiolarPost, setPapularPost] = useState([]);
  useEffect(() => {
    setloading(true);
    fetch(
      " https://api.themoviedb.org/3/tv/popular?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=1"
    )
      .then((response) => response.json())
      .then((data) => setPapularPost(data.results))
      .finally(() => setloading(false));
  }, []);
  const [peapelcard, setPeapelCard] = useState([]);
  useEffect(() => {
    setloading(true);
    fetch(
      "https://api.themoviedb.org/3/person/popular?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US&page=1"
    )
      .then((response) => response.json())
      .then((data) => setPeapelCard(data.results))
      .finally(() => setloading(false));
  }, []);

  const contentStyle = {
    height: "500px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
  const { Meta } = Card;
  return (
    <header>
      <Row>
        <Col xs={24} sm={24} md={24} xl={24}>
          <Carousel autoplay>
            <div>
              <h3 style={contentStyle}>
                <img src="https://iwatchfilmsandstuff.files.wordpress.com/2018/12/poster-3.jpg?w=1200" />{" "}
              </h3>
            </div>
            <div>
              <h3 style={contentStyle}>
                <img src="https://creativecloud.adobe.com/content/dam/2015/8/article-marquee/article-marquee7.jpg" />{" "}
              </h3>
            </div>
            <div>
              <h3 style={contentStyle}>
                <img src="https://miro.medium.com/max/1200/1*eu5Xj4Qwj_5EKaQUB9wMLA.jpeg" />{" "}
              </h3>
            </div>
            <div>
              <h3 style={contentStyle}>
                <img src="https://geekculture.co/wp-content/uploads/2019/11/Friends-Reunion-1200x500.jpg" />{" "}
              </h3>
            </div>
          </Carousel>
        </Col>
      </Row>
      <content>
        <fieldset style={{ marginTop: 30 }}>
          <legend style={{ color: "red", border: "solid 1px" }}>
            Rated Tv shows{" "}
          </legend>
          <div style={{ border: "solid 5px #233a50 " }}>
            <Spin spinning={loadings}>
              <Swiper
                spaceBetween={50}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
                style={{ height: 350 }}
              >
                <Row>
                  {upcomingpost.map((post) => (
                    <SwiperSlide>
                      <Col>
                        <Link key={post.id} to={`/movie/${post.id}`}>
                          <Card
                            loading={true}
                            bodyStyle={{ height: 300 }}
                            hoverable
                            style={{ width: 240, border: "solid black" }}
                            cover={
                              <img
                                alt="example"
                                src={`https://image.tmdb.org/t/p/w500/${post.poster_path}`}
                              />
                            }
                          >
                            <Meta title={post.titel} description={post.titel} />
                          </Card>
                        </Link>
                      </Col>
                    </SwiperSlide>
                  ))}
                </Row>
                ...
              </Swiper>
            </Spin>
          </div>
        </fieldset>
        <fieldset style={{ marginTop: 30 }}>
          <legend style={{ color: "red", border: "solid 1px" }}>
            Rated Tv shows{" "}
          </legend>
          <div style={{ border: "solid 5px #233a50 " }}>
            <Spin spinning={loadings}>
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
                  {popiolarPost.map((post) => (
                    <SwiperSlide>
                      <Col>
                        <Link key={post.id} to={`/tv/${post.id}`}>
                          <Card
                            bodyStyle={{ height: 300 }}
                            hoverable
                            style={{ width: 240 }}
                            cover={
                              <img
                                alt="example"
                                src={`https://image.tmdb.org/t/p/w500/${post.poster_path}`}
                              />
                            }
                          >
                            <Meta title={post.titel} description={post.titel} />
                          </Card>
                        </Link>
                      </Col>
                    </SwiperSlide>
                  ))}
                </Row>
                ...
              </Swiper>
            </Spin>
          </div>
        </fieldset>
        <fieldset style={{ marginTop: 30 }}>
          <legend style={{ color: "red", border: "solid 1px" }}>
            Popular actors
          </legend>
          <Spin spinning={loadings}>
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              autoplay={{
                delay: 2000,
              }}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log("slide change")}
              style={{ height: 350 }}
            >
              <Row>
                {peapelcard.map((post) => (
                  <SwiperSlide>
                    <Col>
                      <Link key={post.id} to={`/selebs/${post.id}`}>
                        <Card
                          bodyStyle={{ height: 300 }}
                          hoverable
                          style={{ width: 240, border: "solid #233a50" }}
                          cover={
                            <img
                              alt="example"
                              src={`https://image.tmdb.org/t/p/w500/${post.profile_path}`}
                            />
                          }
                        >
                          <Meta title={post.titel} description={post.titel} />
                        </Card>
                      </Link>
                    </Col>
                  </SwiperSlide>
                ))}
              </Row>
              ...
            </Swiper>
          </Spin>
        </fieldset>
      </content>
    </header>
  );
}
