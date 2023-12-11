import supabase from "@/utils/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  created_at: string;
  content: string;
  profile_id: string;
  profile: {
    username: string;
  };
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | undefined>("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const getData = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profile: profiles(username)");
    if (!data) {
      alert("no Data");
      return;
    }
    console.log(data, "op");
    setMessages(data);
  };

  const getUser = async () => {
    const user = await supabase.auth.getUser();
    console.log(user);
    setUserId(user.data.user?.id);
  };
  useEffect(() => {
    getUser();
    getData();
  }, []);

  useEffect(() => {
    const messageChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          getData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex-1 overflow-auto bg-[#e7bcf1]" ref={messagesRef}>
      <ul className="flex flex-col flex-1 justify-end space-y-1 my-2">
        {messages.map((item) => {
          return (
            <li
              className={
                item.profile_id === userId
                  ? "self-end bg-blue-300 p-2 rounded-md mr-2 text-2xl"
                  : "self-start bg-white p-2 rounded-md ml-2 text-2xl"
              }
              key={item.id}
            >
              <h1
                className={
                  item.profile_id === userId
                    ? "items-center justify-end flex text-xs text-gray-50"
                    : "items-center justify-start flex text-xs text-gray-950"
                }
              >
                {item.profile.username}
              </h1>
              {item.content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
