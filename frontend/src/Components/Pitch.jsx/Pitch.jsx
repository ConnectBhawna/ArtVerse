import React, { useState, useEffect, useRef } from "react";
import DesoApi from "../../tools/desoAPI";
import Deso from "deso-protocol";
import NavBar from "../Navbar";
import TopBtnBar from "./TopBtnBar";
import TextEditor from "./TextEditor";
import { useNavigate } from "react-router-dom";
import desoLogo from "../../assets/desoLogo.png";
const da = new DesoApi();
const deso = new Deso();

export default function Create() {
  const navigate = useNavigate();
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [postCover, setPostCover] = useState("");
  const [loggedInPublicKey, setLoggedInPublicKey] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [coverImageURL, setCoverImageURL] = useState("");
  const [fundraisingAmt, setFundraisingAmt] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("First post title");
  const [modalBody, setModalBody] = useState("");
  const [postHashHex, setPostHashHex] = useState(null);
  useEffect(async () => {
    const publicKey = localStorage.getItem("loggedInKey");
    if (publicKey === undefined || publicKey === null) {
      window.location.href = "/home";
    } else {
      //here we are getting public key of logged in user
      setLoggedInPublicKey(publicKey);
    }
  }, []);

  // Event Listeners
  const onCoverInputChange = async (e) => {
    let rawImage = e.target.files[0];
    if (!rawImage) {
      setPostCover(null);
    }
    let url = URL.createObjectURL(rawImage);
    const response = await uploadImage(rawImage);
    if (response) {
      setCoverImageURL(response.ImageURL);
    }
    setPostCover(url);
    e.target.value = "";
  };

  const onPublishBtnClicked = async () => {
    // Publishing the post
    if (isPosting) {
      return;
    }
    //checking here that the title text is not empty
    if (titleText === "") {
      setModalHeader("Error");
      setModalBody("Please Enter your Art or Art title");
      setShowModal(true);
      return;
    }
    //check if body text is not empty
    if (bodyText === "") {
      setModalHeader("Error");
      setModalBody("Please Enter your art description");
      setShowModal(true);
      return;
    }
    //checking the cover page is empty or not  if it is empty then it show Error
    if (coverImageURL === "") {
      setModalHeader("Error");
      setModalBody("Please upload your art image");
      setShowModal(true);
      return;
    }

    console.log(titleText);
    console.log(coverImageURL);
    let bannerList = [];
    if (coverImageURL != "") {
      bannerList.push(coverImageURL);
    }

    console.log(bodyText);
    setIsPosting(true);
    console.log("Publishing...");

    const reqeustPayload = {
      UpdaterPublicKeyBase58Check: loggedInPublicKey,
      BodyObj: {
        Body: titleText,
        VideoURLs: [],
        ImageURLs: bannerList,
      },
      PostExtraData: {
        body: bodyText,
        App: "ArtVerse",
        FundraisingGoal: fundraisingAmt.toString(),
      },
    };

    const response = await deso.posts.submitPost(reqeustPayload);

    console.log("post doneee");
    console.log(response);
    if (response) {
      const createdPostHashHex =
        response.submittedTransactionResponse.PostEntryResponse.PostHashHex;
      setPostHashHex(createdPostHashHex);
      const userJwt = await deso.identity.getJwt(undefined);
      //loop 3 times
      for (let i = 0; i < 3; i++) {
        try {
          const backendSubmitResponse = await da.submitBlog(
            loggedInPublicKey,
            createdPostHashHex,
            response.submittedTransactionResponse.PostEntryResponse
              .TimestampNanos,
            userJwt
          );
          console.log(backendSubmitResponse);
          if (backendSubmitResponse.success) {
            break;
          }
        } catch (e) {
          console.log(e);
        }
      }

      //navigate(`/post/${createdPostHashHex}`);
      setModalBody("Fund Raising Art NFT Successfully created!");
      setModalHeader("Success!");
      setShowModal(true);
      //will redirect to the published post
    }
    setIsPosting(false);
  };

  // Utilities
  const uploadImage = async (rawImage) => {
    const request = undefined;
    const JwtToken = await deso.identity.getJwt(request);
    const response = await da.uploadImage(
      rawImage,
      loggedInPublicKey,
      JwtToken
    );
    return response;
  };

  return (
    <>
      <NavBar pitchDesk={false} create={false} />
      <div className='pt-24 gradient'>
        <div className='mt-2 w-screen md:w-4/5 m-auto px-2 md:px-8 mb-6'>
          <TopBtnBar
            isPosting={isPosting}
            coverImgHandler={onCoverInputChange}
          />

          {/* Cover Image Preview */}

          <div
            className={`cover-preview bg-center rounded-lg bg-no-repeat w-2/3 mx-auto h-96 bg-cover relative ${
              !postCover && "hidden"
            }`}
            style={{ backgroundImage: `url(${postCover})`, zIndex: "-10" }}>
            <div className='cover-toolkit absolute top-0 right-0 m-5 flex items-center'>
              <button
                className='px-4 py-2 bg-red-600 text-white opacity-75 hover:opacity-100 duration-300 rounded-lg'
                onClick={() => setPostCover(null)}>
                <i className='fal fa-close'></i>
              </button>
            </div>
          </div>

          <TextEditor
            titleText={titleText}
            bodyText={bodyText}
            setTitleText={setTitleText}
            setBodyText={setBodyText}
            uploadImage={uploadImage}
          />
          <form>
            <div className=' mt-4'>
              <label className={` text-white inline-block mb-2 text-sm font-medium `}>
                Fundraising Goal (in $DESO. 1 $DESO ~ 6$){" "}
                <img
                  src={desoLogo}
                  className='inline-block w-10 h-10 rounded-full'
                />
              </label>
              <input
                type='number'
                min={0}
                className={`  text-sm rounded-lg  block w-full p-2.5 mb-6  bg-white text-gray-800 focus:outline-none border`}
                placeholder='e.g 100Tez'
                value={fundraisingAmt .toString()}
                onChange={(e) => {
                  setFundraisingAmt(Math.abs(e.target.value));
                  localStorage.setItem(
                    "fundraisingAmt",
                    Math.abs(e.target.value * 1e6)
                  );
                }}
                onKeyUp={(e) => {
                  e.target.value = Math.abs(e.target.value);
                }}
              />
            </div>
          </form>

          <div className='flex justify-center'>
            <button
              className={`p-2 text-white hover:text-white border border-[#0b824b] hover:bg-[#04552a] focus:ring-4 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 `}
              onClick={() => {
                onPublishBtnClicked();
              }}>
              {isPosting ? "Creating..." : "Create Fund Raiser"}
            </button>
          </div>
        </div>
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
                {postHashHex && (
                  <a
                    href={`/post/${postHashHex}`}
                    className='flex items-center justify-center underline text-blue-400'>
                    View Pitch
                  </a>
                )}
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
          <div className='opacity-35 fixed inset-0 z-40 bg-black'></div>
        </>
      )}
    </>
  );
}
