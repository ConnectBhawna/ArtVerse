import React, { useState, useRef } from "react";

import TextBarButton from "./TextBarButton";

const TextEditorBar = ({ currentTab, setCurrentTab, onBarBtnClicked }) => {
  const [headDropOpen, setHeadDropOpen] = useState(false);
  const imgInput = useRef();

  const onImgInputChange = (e) => {
    let rawImage = e.target.files[0];
    onBarBtnClicked(e, "image", rawImage);
  };

  return (
    <div className='md:pr-4 mt-4 flex flex-col-reverse items-center md:flex-row md:justify-between bg-gray-200 border border-gray-300 rounded-t-lg'>
      <div className='text-views w-full md:text-lg flex'>
        <div
          className={`p-4 hover:text-blue-500 hover:border-b-blue-500 border-b-4 duration-300 cursor-pointer flex-grow md:flex-grow-0 md:rounded-tl-lg`}
          onClick={() => setCurrentTab(0)}>
          <i className='fas fa-pencil'></i> Write
        </div>
      </div>
      <div className='text-btns hidden md:flex gap-2 p-2 md:p-0 md:gap-4'>
        <button onClick={(e) => imgInput.current.click()}>
          <i className={`fas fa-camera`}></i>
          <input
            type='file'
            id='uploadImgToolbar'
            accept='image/png, image/jpeg'
            className='hidden'
            ref={imgInput}
            onChange={onImgInputChange}
          />
        </button>
      </div>
    </div>
  );
};

export default TextEditorBar;
