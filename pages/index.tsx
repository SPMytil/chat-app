import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import supabase from "@/utils/supabase";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Messages from "@/components/messages";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [chat, setChat] = useState({
    message: "",
  });

  const handleChat = (e: ChangeEvent<HTMLInputElement>) => {
    setChat({ ...chat, [e.target.name]: e.target.value });
  };
  console.log(chat);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { message } = Object.fromEntries(new FormData(form));
    console.log(message);
    form.reset();
    if (typeof message === "string" && message.trim().length !== 0) {
      const { data, error } = await supabase
        .from("messages")
        .insert({ content: message });
      if (error) {
        alert(error.hint + " " + error.message);
        return;
      } else {
        console.log("rekload");
        // router.reload();
      }
    } else {
      alert("Enter a valid message");
    }
  };
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, "asd");
  const getUser = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      router.push("/login");
    } else {
      setUserId(data.user?.id);
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return loading ? (
    <div className="h-screen flex items-center justify-center text-center">
      <h3 className="text-8xl animate-spin">Loading</h3>
    </div>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center bg-blue-400">
      <Head>
        <title>Happy Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full w-full flex-1 flex-col items-stretch  py-10 px-20 text-gray-800">
        <div className="flex flex-row justify-between text-center bg-green-200">
          <h1 className=" px-4 py-2 text-4xl">Happy Chat </h1>
          <Button
            className=""
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                alert(error);
                return;
              }
              getUser();
            }}
          >
            Logout
          </Button>
        </div>
        <Messages />
        <form
          className="max justify-self-end bg-red-200 p-2 flex flex-row"
          onSubmit={handleSubmit}
        >
          <input className="w-full m-2" type="text" name="message" />
          <Button
            variant="contained"
            className="bg-slate-500 m-2"
            type="submit"
          >
            Send
          </Button>
        </form>
      </main>
    </div>
  );
}
