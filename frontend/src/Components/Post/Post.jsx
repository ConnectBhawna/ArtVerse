import React from "react";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Deso from "deso-protocol";
import { DateTime } from "luxon";
import Loader from "../Loader";
import NavBar from "../Navbar";
import desoLogo from "../../assets/desoLogo.png";
import ReactTooltip from "react-tooltip";
export default function Post() {
  const deso = new Deso();
  const { hash } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [postTitle, setPostTitle] = useState(null);
  const [posterKey, setPosterKey] = useState(null);
  const [postUsername, setPostUserName] = useState(null);
  const [postDate, setPostDate] = useState(null);
  const [postCover, setPostCover] = useState(null);
  const [postBody, setPostBody] = useState(null);
  const [wasResponseSuccessful, setWasResponseSuccessful] = useState(false);
  const [postStats, setPostStats] = useState([]); // [diamonds, likes, comments]
  const [fundraisingGoal, setFundraisingGoal] = useState(null);
  const [fundrasied, setFundraised] = useState(2);
  const [progressBar, setProgressBar] = useState("");
  const [loggedInKey, setLoggedInPublicKey] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [diamondSenders, setDiamondSenders] = useState([]);
  useEffect(async () => {
    const publicKey = localStorage.getItem("loggedInKey");
    if (publicKey) {
      setLoggedInPublicKey(publicKey);
    }

    const response = await deso.posts.getSinglePost({ PostHashHex: hash });
    if (!response.PostFound) {
      console.log("An Error Occured!");
      return;
    }

    const postData = response.PostFound;
    setFundraisingGoal(postData.PostExtraData.FundraisingGoal);
    setPosterKey(postData.PosterPublicKeyBase58Check);
    setPostBody(postData.PostExtraData.body);
    let imgURL = "";
    try {
      imgURL = postData.ImageURLs[0];
    } catch (e) {
      imgURL = "";
    }
    setPostCover(imgURL);
    setPostUserName(postData.ProfileEntryResponse.Username);
    setPostTitle(postData.Body || "Post Title");
    setPostStats([
      postData.DiamondCount,
      postData.LikeCount,
      postData.CommentCount,
    ]);

    const timestamp = postData.TimestampNanos;
    setPostDate(
      DateTime.fromMillis(timestamp / 1e6).toLocaleString(DateTime.DATE_FULL)
    );
    const request = {
      Limit: 25,
      Offset: 0,
      PostHashHex: hash,
      ReaderPublicKeyBase58Check: loggedInKey || "BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg"
    };
    const response2 = await deso.posts.getDiamondsForPost(request);
    setDiamondSenders(response2.DiamondSenders);
    const diamondValueMap = {
      1: 0.00005,
      2: 0.0005,
      3: 0.005,
      4: 0.05,
      5: 0.5,
      6: 5,
      7: 50,
    };
    let total = 0;
    for (let i = 0; i < response2.DiamondSenders.length; i++) {
      let diamondLevel = response2.DiamondSenders[i].DiamondLevel;
      total += diamondValueMap[diamondLevel];
    }
    setFundraised(total);
    setProgressBar(
      <div
        className='bg-green-700 text-md font-medium text-blue-100 text-center px-0.5 rounded  '
        style={{
          width:
            ((total * 100) / postData.PostExtraData.FundraisingGoal)
              .toFixed(2)
              .toString() + "%",
          minWidth: "fit-content",
          maxWidth: "100%",
        }}>
        {postData.PostExtraData.FundraisingGoal != 0
          ? ((total * 100) / postData.PostExtraData.FundraisingGoal).toFixed(2)
          : "100"}
        %
      </div>
    );

    setWasResponseSuccessful(true);
    setIsLoading(false);
  }, [hash]);

  const fundPostBtn = async (diamondLevel) => {
    if (isFunding) return;
    if (!loggedInKey) {
      setModalHeader("Error");
      setModalBody("You need to be logged in to fund a post!");
      setShowModal(true);
      return;
    }
    if (loggedInKey == posterKey) {
      setModalHeader("Error");
      setModalBody("You can't fund your own post!");
      setShowModal(true);
      return;
    }
    setIsFunding(true);
    const request = {
      ReceiverPublicKeyBase58Check: posterKey,
      SenderPublicKeyBase58Check: loggedInKey,
      DiamondPostHashHex: hash,
      DiamondLevel: diamondLevel,
      MinFeeRateNanosPerKB: 1000,
      InTutorial: false,
    };
    const response = await deso.social.sendDiamonds(request);
    setIsFunding(false);
    if (response) {
      setModalHeader("Enjoy the Success");
      setModalBody(`You have successfully funded this particular post!`);
      setShowModal(true);
    }
  };

  return (
    <div>
      <NavBar pitchDesk={false} create={false} />
      <div className={`pb-10`}>
        {isLoading ? (
          <div className='h-screen mx-auto pt-20'>
            <Loader />
          </div>
        ) : !wasResponseSuccessful ? (
          <div className='h-screen mx-auto pt-20'>
            <p className={` text-xl text-center pt-10`}>
              Error while loading post,reloading is required. Please reload page.
            </p>
          </div>
        ) : (
          <div className={` pt-24 lg:w-4/6   px-4 md:px-16 sm:mx-auto lg:mx-0`}>
            <div className={` min-h-screen`}>
              <div>
                <div className='post-head'>
                  <div className=' flex items-center space-x-2 px-10'>
                    <div className=' sm:w-16 sm:h-16 md:w-16 md:h-16'>
                      <img
                        src={`https://node.deso.org/api/v0/get-single-profile-picture/${posterKey}?fallback=https://node.deso.org/assets/img/default_profile_pic.png`}
                        alt={`${postUsername}'s Avatar`}
                        className='rounded-full h-12 w-12'
                      />
                    </div>

                    <div className='flex flex-col space-y-1'>
                      <p
                        className={` username font-bold hover:underline text-gray-800 text-xs sm:text-md hover:cursor-pointer`}>
                        {postUsername}
                      </p>{" "}
                      <div className={`  post-date text-sm`}>{postDate}</div>
                    </div>
                  </div>
                  <h1
                    className={` text-4xl font-bold break-words my-10 px-10 `}>
                    {postTitle}
                  </h1>
                </div>

                <div className={` blogContent lg:flex lg:justify-between `}>
                  <div className='leftContainer lg:px-10 xm:px-2 '>
                    <div className='cover-img py-4'>
                      <img
                        src={postCover}
                        alt=''
                        className='rounded-lg md:max-w-4xl w-full mx-auto'
                      />
                    </div>
                    {/* use highliught js to highlight ot */}

                    <ReactMarkdown
                      className={`  post-content text-lg font  break-words  unreset`}
                      rehypePlugins={[rehypeHighlight]}
                      remarkPlugins={[remarkGfm]}>
                      {postBody}
                    </ReactMarkdown>
                  </div>
                  <div
                    className={` rightContainer lg:fixed md:top-32 md:right-8 xl:right-12  sm:right-2 my-4 `}>
                    {fundraisingGoal !== 0 && (
                      <div>
                        <div>
                          {fundrasied.toFixed(2)}{" "}
                          <img
                            src={desoLogo}
                            className='inline-block w-6 h-6 rounded-full'
                          />{" "}
                          of {fundraisingGoal}{" "}
                          <img
                            src={desoLogo}
                            className='inline-block  w-6 h-6 rounded-full'
                          />{" "}
                          raised
                        </div>
                        <div className={` w-full  rounded bg-gray-100`}>{progressBar}</div>
                      </div>
                    )}
                    <br />
                    Fund this Idea 🎉
                    <br />
                    <div className='flex flex-col border rounded-lg shadow-sm'>
                      {isFunding && (
                        <p className='flex gap-3 text-center justify-center rounded-t-lg p-2 w-96 mx-auto'>
                          {" "}
                          Start Funding the pitch...
                        </p>
                      )}
                      {!isFunding && (
                        <div
                          className={`flex gap-3 text-center justify-center rounded-t-lg p-2 w-96 mx-auto`}>
                          <button
                            data-tip
                            data-for='gem'
                            className='p-1 px-5  miniLightBtn   text-xl'
                            onClick={() => {
                              fundPostBtn(4);
                            }}>
                            💎
                          </button>

                          <ReactTooltip id='gem' place='top' effect='solid'>
                            Contribute 0.05 $DESO
                          </ReactTooltip>
                          <button
                            data-tip
                            data-for='gift'
                            className='miniLightBtn p-1 px-5 fas  text-xl'
                            onClick={() => {
                              fundPostBtn(5);
                            }}>
                            🎁
                          </button>
                          <ReactTooltip id='gift' place='top' effect='solid'>
                            Contribute 0.5 $DESO
                          </ReactTooltip>
                          <button
                            data-tip
                            data-for='moneyBag'
                            className='miniLightBtn p-1 px-5 fas   text-xl'
                            onClick={() => {
                              fundPostBtn(6);
                            }}>
                            💰
                          </button>
                          <ReactTooltip
                            id='moneyBag'
                            place='top'
                            effect='solid'>
                            Contribute 5 $DESO
                          </ReactTooltip>
                          <button
                            data-tip
                            data-for='trophy'
                            className='miniLightBtn p-1 px-5 fas   text-xl'
                            onClick={() => {
                              fundPostBtn(7);
                            }}>
                            🏆
                          </button>
                          <ReactTooltip id='trophy' place='top' effect='solid'>
                            Contribute 50 $DESO
                          </ReactTooltip>
                        </div>
                      )}
                    </div>
                    {/* Add social media share things here...*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                  <h3 className='text-3xl font-semibold'>{modalHeader}</h3>
                  <button
                    className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                    onClick={() => setShowModal(false)}>
                    <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className='relative p-6 flex-auto'>{modalBody}</div>

                {/*footer*/}
                <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                  <button
                    className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      )}
    </div>
  );
}
