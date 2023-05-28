export default function FakeLoader() {
  return (
    <div className="absolute inset-0 z-[30] flex h-screen w-screen flex-col items-center justify-center bg-gray-800 text-white">
      <div className="my-4 w-[400px] lg:w-[500px]">
        <div
          className="rounded-md bg-orange-800 px-2 py-[2px] text-center text-xs font-medium text-black"
          style={{ width: "0%" }}
        />
      </div>
      <h1 className="text-lg md:text-xl">0% loaded</h1>
    </div>
  )
}
