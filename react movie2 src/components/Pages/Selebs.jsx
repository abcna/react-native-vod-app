import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Row, Col, Image, Divider, Rate, Card } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
export default function Selebs() {
  const { Meta } = Card;
  const { id } = useParams();
  const [selebs, setSelebs] = useState(null);
  useEffect(() => {
    fetch(
      `
      https://api.themoviedb.org/3/person/${id}?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setSelebs(data));
  }, []);
  const [credits, setCredits] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=26b842803ccbaba051d1fd7169b8d506&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setCredits(data.cast));
  }, []);
  console.log(credits);
  return (
    <Row>
      <Col span={8}>
        {selebs && (
          <h1>
            <Image
              width={200}
              src={`https://image.tmdb.org/t/p/w500/${selebs.profile_path}`}
            />
          </h1>
        )}
      </Col>
      <Col span={6}>
        {selebs && (
          <div>
            <h1> Name: {selebs.name}</h1>
            <Divider />
            <h1> place of Birth :</h1> {selebs.place_of_birth} <Divider />
            <h1>
              {" "}
              popularity :{" "}
              <Rate allowHalf defaultValue={selebs.popularity / 2} />{" "}
            </h1>
            {selebs.popularity}/10
          </div>
        )}
      </Col>
      <Col span={6}>
        {selebs && (
          <div>
            <h1> birthday: {selebs.birthday}</h1> <Divider />
            <h1> Department: {selebs.known_for_department}</h1>
          </div>
        )}
      </Col>

      <Col>
        {selebs && (
          <h1>
            <Divider orientation="middle">Biography</Divider>
            {selebs.biography}
          </h1>
        )}
      </Col>
      <Col span={24}>
        {selebs && (
          <h1>
            <Divider orientation="middle" dashed>
              Movies credits
            </Divider>
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
                {credits && (
                  <Col>
                    {credits.map((post) => (
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
          </h1>
        )}
      </Col>
    </Row>
  );
}
