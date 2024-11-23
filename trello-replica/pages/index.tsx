import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import client from "@/lib/mongodb";
import type {GetServerSideProps } from "next";

type ConnectionStatus = {
  isConnected: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await client.connect(); // `await client.connect()` will use the default database passed in the MONGODB_URI
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="text-center">
        <Image
          src="/next.svg"
          alt="App Logo"
          width={150}
          height={150}
          priority
        />
        <h1 className="text-4xl font-bold mt-4 text-gray-800">
          Welcome to Trello Replica
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Organize your tasks, collaborate, and stay productive!
        </p>
        <div className="mt-6">
          <Link href="/app-demo">
            <div className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition">
              Go to Dashboard
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

