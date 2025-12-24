import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen">
      <div className="grid h-full w-full md:grid-cols-[30%_70%] bg-white">

        <div className="bg-[#76C05D] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/image/white_half_logo.png"
              alt="Logo"
              width={200}
              height={200}
            />
            <h1 className= "mt-4 text-2xl md:text-4xl font-bold text-black/300">
              ChautariKuraKani
            </h1>
            <h2 className="text-sm text-white/90 font-bold pt-5">
              Chautarimah Sabai Kura
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-[800] h-[420] rounded-xl border border-black/10 bg-background/80 p-6 shadow-sm">

            {children}
          </div>
        </div>

      </div>
    </section>
  );
}
