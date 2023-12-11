import { Button, Input } from "@mui/material";
import supabase, { supabase_admin } from "../utils/supabase";
import { useRouter } from "next/router";
import { FormEvent } from "react";

export default function Login() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    );
    console.log(typeof email, typeof password);
    if (typeof email === "string" && typeof password === "string") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        alert(error.name + " " + error.message);
        return;
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-screen items-center justify-center px-4 bg-slate-500">
      <form className="w-full gap-5	 flex flex-col" onSubmit={handleSubmit}>
        <h1 className="text-left text-3xl font-medium">Email</h1>
        <Input type="email" name="email" className="" />
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
          Sign in
        </Button>

        <Button
          onClick={() => {
            router.push("/register");
          }}
          variant="contained"
          className="bg-slate-600 hover:bg-blue-400 py-3 my-10 gap-2"
          style={{
            marginTop: "40px",
          }}
        >
          Register
        </Button>
      </form>
    </div>
  );
}
