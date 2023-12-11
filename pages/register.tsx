import { Button, Input } from "@mui/material";
import supabase, { supabase_admin } from "../utils/supabase";
import { useRouter } from "next/router";
import { FormEvent } from "react";

export default function Register() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, username, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    );

    if (
      typeof email === "string" &&
      typeof password === "string" &&
      typeof username === "string"
    ) {
      const { data, error } = await supabase_admin.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          username,
        },
        email_confirm: true,
      });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-screen items-center justify-center px-4 bg-slate-500">
      <form className="w-full gap-5	 flex flex-col" onSubmit={handleSubmit}>
        <h1 className="text-left text-3xl font-medium">Email</h1>
        <Input type="email" name="email" className="" />
        <h1 className="text-left text-3xl font-medium">User Name</h1>
        <Input type="text" name="username" className="" />
        <h1 className="text-left text-3xl font-medium">Password</h1>
        <Input type="password" name="password" className="" />
        <Button
          type="submit"
          variant="contained"
          className="bg-slate-600 hover:bg-blue-400 py-3 my-10 gap-2"
          style={{
            marginTop: "40px",
          }}
        >
          Sign Up
        </Button>
        <Button
          onClick={() => {
            router.push("/login");
          }}
          variant="contained"
          className="bg-slate-600 hover:bg-blue-400 py-3 my-10 gap-2"
          style={{
            marginTop: "40px",
          }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
