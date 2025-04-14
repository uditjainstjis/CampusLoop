import Image from "next/image";

export default function Home() {
  const Mentors = [{name: "Mahak Jain", image: "mahak_jain.jpeg", title: "Google Summer Intern"},
    {name: "Mahak Jain", image: "mahak_jain.jpeg", title: "Google Summer Intern"},
    {name: "Mahak Jain", image: "mahak_jain.jpeg", title: "Google Summer Intern"},
    {name: "Mahak Jain", image: "mahak_jain.jpeg", title: "Google Summer Intern"}
  ]
  return (
   <div>
    {/* Top sections */}
      <section className="h-[70vh] flex justify-center items-center">
        <div className="text-center">

        <div className="text-3xl font-bold">
          Your Gateway to Real NST
        </div>
        <br></br>
        <div className="text-3xl font-bold">
          Get Mentorship from Seniors
        </div>

        </div>
      </section>
      {/* Mid section */}
      {/* <section className="flex justify-center items-center flex-col gap-12 ">
        <div className="flex flex-row gap-14 ">

          <div className="w-[18vw] shadow-2xl">
            <img src="pranav_nvidia.jpeg" className="rounded-lg"></img>
          </div>
          <div className="w-[18vw]">
            <img src="pranav_nvidia.jpeg" className="rounded-lg"></img>
          </div>
          <div className="w-[18vw]">
            <img src="pranav_nvidia.jpeg" className="rounded-lg"></img>
          </div>

        </div>
        <div className="flex flex-row gap-14 ">

          <div className="w-[18vw]">
            <img src="pranav_nvidia.jpeg" className="rounded-lg"></img>
          </div>
          <div className="w-[18vw]">
            <img src="pranav_nvidia.jpeg" className="rounded-lg"></img>
          </div>
          <div className="w-[18vw]">
            <img src="pranav_nvidia.jpeg" className="rounded-lg"></img>
          </div>

        </div>

      </section> */}
      {/* mentors slide featureing section */}
      <section>
      <div className="flex flex-row mx-4 border-2">
        {Mentors.map((item) => (
          <div className="flex flex-col w-64 border-2 mx-4" key={item.id}>
            <img className="p-3" src={item.image} alt={item.name} />
            <h2 className="pl-3">{item.name}</h2>
            <h2 className="pl-3">{item.title}</h2>
          </div>
        ))}
      </div>
      <div className="flex flex-row mx-4 border-2">
        {Mentors.map((item) => (
          <div className="flex flex-col w-64 border-2 mx-4" key={item.id}>
            <img className="p-3" src={item.image} alt={item.name} />
            <h2 className="pl-3">{item.name}</h2>
            <h2 className="pl-3">{item.title}</h2>
          </div>
        ))}
      </div>
      </section>
   </div>
  );
}
