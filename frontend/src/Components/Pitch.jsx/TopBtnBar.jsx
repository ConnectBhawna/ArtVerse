import React, { useRef } from "react";

const TopBtnBar = ({ coverImgHandler }) => {
  const coverImgInput = useRef();

  return (
    <div className='flex justify-between'>
      <div className='flex gap-4'>
        <button
          className='p-2 text-white primaryColor primaryButton  focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none'
          onClick={() => coverImgInput.current.click()}>
          <i className='far fa-image'></i> Set Cover
          <input
            type='file'
            id='coverImgInput'
            accept='image/png, image/jpeg'
            onChange={coverImgHandler}
            className='hidden'
            ref={coverImgInput}
          />
        </button>
      </div>
    </div>
  );
};

export default TopBtnBar;
