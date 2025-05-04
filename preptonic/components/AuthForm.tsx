"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// });

const authFormSchema = (type: FormType) =>{
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(4),
  })
}

const AuthForm = ({type}: {type: FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type === "sign-up"){
        const {name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success){
          toast.error(result?.message);
          return;
        }

        console.log("SIGN UP", values);
        toast.success("Account created Successfully. Please Sign In");
        router.push('/sign-in');
      }else{
        const {email, password} = values;

        const userCredentials = await signInWithEmailAndPassword(auth, email, password)

        const idToken = await userCredentials.user.getIdToken();

        if(!idToken){
          toast.error("Sign In Failed!!");

          return;
        }

        await signIn({email, idToken});

        console.log("SIGN IN", values);
        toast.success("Signed In Successfully.");
        router.push('/');
      }
    }catch(error){
      toast.error(`There was an error: ${error}`)
    }
  }

  const isSignedIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566]">
      <div className="flex- flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="./logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Preptonic</h2>
        </div>
        <h3 className="text-center mt-2">Practice Job Interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignedIn && (
              <FormField control={form.control} name="name" label="Name" placeholder="Enter Your Name" />
            )}
            <FormField control={form.control} name="email" label="Email" placeholder="Enter Your Email" type="email" />
            <FormField control={form.control} name="password" label="Password" placeholder="Enter Your Password" type="password" />
            <Button className="btn" type="submit">{isSignedIn ? "Sign In" : "Create an Account"}</Button>
          </form>
        </Form>
        <p className="text-center mt-4">
          {isSignedIn ? 'No Account Yet?' : 'Have an Account Already'}
          <Link href={!isSignedIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
            {!isSignedIn ? 'Sign In' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
