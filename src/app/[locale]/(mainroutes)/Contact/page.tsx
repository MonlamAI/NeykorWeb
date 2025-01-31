"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/app/actions/resendaction";
import { useToast } from "@/hooks/use-toast";
import CtaMap from "./CtaMap";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage = ({ params }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await sendEmail(data);
      console.log("Email send result:", result);
      if (result.success) {
        toast({
          title: "Success",
          description: "Email sent successfully!",
        });
        reset();
      } else {
        console.error("Failed to send email:", result.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  const getErrorMessage = (fieldName: keyof FormData) => {
    const error = errors[fieldName];
    return error ? (error.message as string) : undefined;
  };

  return (
    <div className="container py-8">
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex h-64 w-full rounded-lg overflow-hidden">
                <CtaMap
                  geoLocation={"32.22609238023078, 76.32543320353723"}
                  monasteryName={"Department of Religion & Culture, CTA"}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
              <div className="space-y-2">
                <p>Central Tibetan Administration</p>
                <p>Gangchen Kyishong, Dharamshala</p>
                <p>Kangra District, HP 176215, India</p>
                <p>Tel: +91-1892-222685, 226737</p>
                <p>Fax: +91-1892-228037</p>
                <p>Email: religion@tibet.net</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Your Name"
                  className="w-full"
                />
                {getErrorMessage("name") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage("name")}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="Your Email"
                  className="w-full"
                />
                {getErrorMessage("email") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage("email")}
                  </p>
                )}
              </div>
              <div>
                <Textarea
                  {...register("message", { required: "Message is required" })}
                  placeholder="Your Message"
                  className="w-full min-h-[150px]"
                />
                {getErrorMessage("message") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage("message")}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ContactPage;
