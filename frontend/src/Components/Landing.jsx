import React from "react";
import NavBar from "./Navbar";
import { Link } from "react-router-dom";
function Landing(props) {
  
 
  return (
    <div gradient>
      <NavBar 
      pitchDesk= {true}
        create= {false}
      />
      <div className='pt-28 gradient'>
        <div className='flex centre flex-col items-center my-6'>
            <div className=' text-lg px-10 py-8 gradient rounded-md border border-green-200'>
              {" "}
              <span className='undeline text-white-800 '>
                <a href='https://deso.org' target={"_blank"}>
                  Become a part of Digital Decentralized Art on DeSo Blockchain
                </a>
              </span>
            </div>
          </div>
        <div className='py-8 mt-7 px-8'>
          <div className=' flex center flex-col items-center my-6 px-6 py-4'>
            <h1 className='text-center text-4xl md:text-6xl font-bold primaryTextColor tracking-wide sm:leading-[16rem]'>
             A Decentralized Platform <br></br>where{" "}
              <span className='colorText'>Artists can put up arts as</span>{" "}
             NFT and raise Funds for their ideas
            </h1>
            <p className=' text-center mt-4 text-lg text-gray-800 sm:mt-10 sm:text-2xl primaryTextColor'>
            Add Art, raise funds and bring your creative ideas to life by
            drawing in public.
            </p>

            <Link className='text-lg primaryColor animate-bounce text-white mt-16 px-16 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 duration-100 hover:bg-[#bd3957]' 
            to = "/home">
            Get Started
            </Link>
          </div>
        </div>

        <div className='flex justify-center bg-white flex-col items-center my-6 py-12'>
          <h1 classname='text-white' ></h1>
          <h1 className='text-center text-4xl text-green-600  font-bold   sm:leading-[3rem]'>
            Show, Own and Fund your Art like Never Before
          </h1>
          <p className=' text-center mt-2 text-lg text-black sm:mt-6 sm:text-2xl '>
            Show your Art in decentralized Manner!
          </p>
          <div className='mx-auto flex flex-wrap my-4  w-full  px-4 sm:px-44 lg:px-72 justify-center'>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-green-50 w-[16rem] h-[8rem] border-green-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Earn Revenue through your Art as an Artist by social tipping and NFT sales
              </div>
            </div>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-green-50 w-[16rem] h-[8rem] border-green-600 px-8 py-6 rounded-xl  text-center text-lg'>
                No Ads and annoying PopUps as such web2 thing
              </div>
            </div>
            <div className=' items-center flex justify-center  flex-col  p-4 '>
              <div className='border bg-green-50 w-[16rem] h-[8rem] border-green-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Get help from other community members
              </div>
            </div>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-green-50 w-[16rem] h-[8rem] border-green-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Be the Owner not the product
              </div>
            </div>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-green-50 w-[16rem] h-[8rem] border-green-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Support artists using funding the ideas
              </div>
            </div>

          
        </div > 
        </div>
      </div>
    </div>
          
  );
}

export default Landing;
