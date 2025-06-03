import Image from "next/image";
import logo from "@/assets/logo.svg";

export default function Home() {
  return (
    <div className="grid grid-cols-2 grow">
      <div className="flex flex-col">
        <div className="text-3xl font-bold p-4">Postr</div>
      </div>
      <div className="flex flex-col">
        <div className="ml-auto p-4">
          <Image src={logo} alt="logo" width={125} height={300} />
        </div>
      </div>
    </div>
  );
}
