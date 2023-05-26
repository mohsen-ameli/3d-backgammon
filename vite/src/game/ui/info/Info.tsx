const Info = () => {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="">
        <h1 className="mb-2 text-center text-xl font-bold">How to interact:</h1>
        <div className="flex h-full w-full items-center justify-evenly text-sm text-white lg:text-lg">
          <div className="flex flex-col items-center gap-y-2">
            <img
              src="/svg/finger-zoom.svg"
              alt=""
              className="m-auto h-[50px] w-[50px] object-center"
            />
            <h1>Zoom</h1>
            <img
              src="/svg/mouse-zoom.svg"
              alt=""
              className="m-auto h-[50px] w-[50px] object-center"
            />
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <img
              src="/svg/finger-drag.svg"
              alt=""
              className="h-[50px] w-[50px]"
            />
            <h1>Rotate</h1>
            <img
              src="/svg/mouse-left.svg"
              alt=""
              className="m-auto h-[50px] w-[50px] object-center"
            />
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <img
              src="/svg/finger-pan.svg"
              alt=""
              className="h-[50px] w-[50px]"
            />
            <h1>Pan</h1>
            <img
              src="/svg/mouse-right.svg"
              alt=""
              className="m-auto h-[50px] w-[50px] object-center"
            />
          </div>
        </div>
      </div>

      <div className="">
        <h1 className="mb-2 text-center text-xl font-bold">
          How to play the game:
        </h1>
        <ul className="ml-8 list-disc leading-7">
          <li>
            Check to see what checker color you are playing as. You can see this
            on the top left corner of your profile picture.
          </li>
          <li>
            If it's your turn, throw the dice, and if not, wait your turn.
          </li>
          <li>
            You want to move all of your checkers to you home. If you are
            playing as white, you home will be the 6 bottom right columns, and
            if you're playing as black the top right 6, is your home.
          </li>
          <li>
            You want to move generally like a{" "}
            <i className="fa-solid fa-u rotate-90"></i> shape.
          </li>
          <li>
            The objective of the game is to move all of your checkers to your
            home, and then bear them off. The first player who bears all of
            their checkers off, will be the winner!
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Info
