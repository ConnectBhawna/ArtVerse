import React from "react";
import NavBar from "../Navbar";
import Loader from "../Loader";
import { useEffect } from "react";
import axios from "axios";
import Card from "./Card";

export default function Home() {
  const [postsFound, setPostsFound] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadSuccess, setLoadSuccess] = React.useState(false);
  const initPage = async () => {
    //make get request to https://tipdeso.com/get-feed
    const response = await axios.get("https://tipdeso.com/get-feed");
    console.log(response.data);
    if (response.data.postsFound) {
      setPostsFound(response.data.postsFound);
      setLoadSuccess(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    initPage();
  }, []);

  return (
    <div>
      <NavBar pitchDesk={false} create={true} />
      <div className='pt-24 '>
        {loading && <Loader />}
        <div className='container mx-auto'>
          {loadSuccess && (
            <h1 className='text-center text-3xl my-4'>Top Pitches</h1>
          )}
          {loadSuccess &&
            postsFound.map((post, index) => {
              return (
                <div key={index} className= "mx-auto container flex justify-center"
              >
                  <Card postHashHex={post.postHashHex}  />
                </div>
              );
            })}
        </div>

        {!loadSuccess && !loading && <div>Something went wrong. Please reload page!</div>}
      </div>
    </div>
  );
}
