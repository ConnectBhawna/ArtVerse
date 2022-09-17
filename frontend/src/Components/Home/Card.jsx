import React from "react";
import { useEffect } from "react";
import Deso from "deso-protocol";
const deso = new Deso();
export default function Card({ postHashHex }) {
    console.log(postHashHex)
  const [postData, setPostData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const initPostCard = async () => {
    setLoading(true);
    const request = {
      PostHashHex: postHashHex,
    };
    const response = await deso.posts.getSinglePost(request);
    if (response.PostFound) {
      setPostData(response.PostFound);
    }
    setLoading(false);
  };
  useEffect(() => {
    initPostCard();
  }, []);
  return (
    <>
      {loading && (
        <div
          className={`animate-pulse my-4 w-full mx-6 md:w-1/2 lg:w-1/3 h-60 bg-gray-200  rounded-md overflow-hidden shadow-lg text-black cursor-pointer hover:scale-105 duration-75`}></div>
      )}
      {postData && (

    
      <div
        className={` my-4 w-full mx-6 md:w-1/2 lg:w-1/3   rounded-md overflow-hidden shadow-lg text-black cursor-pointer hover:scale-105 duration-75`}
        onClick={() => {
          window.location.href = `/post/${postHashHex}`;
        }}>
        <div
          style={{
            backgroundImage: `url(${postData.ImageURLs[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "300px",
            width: "100%",
          }}></div>

        <div className='px-6 py-4'>
          <div className='flex items-center'>
            <div className='w-6 h-8 sm:w-10 sm:h-12'>
              <img
                src={`https://node.deso.org/api/v0/get-single-profile-picture/${postData.PosterPublicKeyBase58Check}?fallback=https://node.deso.org/assets/img/default_profile_pic.png`}
                alt={`${postData.ProfileEntryResponse.Username}'s Avatar`}
                className='rounded-full h-10 w-10'
              />
            </div>
            <div
              className={`w-44 sm:w-72  mx-2 py-1 overflow-hidden   rounded-lg flex items-center`}>
              <p className='text-sm sm:text-md truncate px-2 hover:underline'>
                {postData.ProfileEntryResponse.Username}
              </p>
            </div>
          </div>
          <div className='font-bold text-lg sm:text-xl drop-shadow-md   '>
            <p className='text-lg sm:text-xl text-clip '>{postData.Body}</p>
          </div>
          {/* <p
            className={` text-xs`}>
           
            {timeDifference(Date.parse(timestamp))}
          </p> */}
          <div className={` mt-4 justify-end`}>
            {`Fundraising Goal: ${postData.PostExtraData.FundraisingGoal} $DESO`}
          </div>
        </div>
      </div>  )}
    </>
  );
}
