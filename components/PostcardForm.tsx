"use client";

import { z } from "zod";
import {
  MOODS,
  THEMES,
  FORMATS,
  TYPES,
  SENDER_VOICES,
  Postcard,
} from "@/types/postcard";
import { nanoid } from "nanoid";

export const postcardSchema = z.object({
  type: z.enum(TYPES),
  mood: z.enum(MOODS),
  themeColor: z.enum(THEMES),
  formatStyle: z.enum(FORMATS),
  senderVoice: z.enum(SENDER_VOICES),
  notes: z.string().max(500).optional(),
});

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TYPE_INFO } from "@/const/postcard";
import { useState } from "react";
import { toastError } from "@/lib/ui";
import { getErrorMessage } from "@/lib/utils";
import { config, databases } from "@/config/appwrite";
import { useUser } from "@/context/user/UserContext";
import { Permission, Role } from "appwrite";
import { usePostcards } from "@/context/postcards/PostcardsContext";

const formSchema = postcardSchema;

export function PostcardForm() {
  const { currentUser } = useUser();
  const { setPostcards, setSelectedPostcard } = usePostcards();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "DECISION",
      mood: "CASUAL",
      themeColor: "PASTEL",
      formatStyle: "MINIMALIST",
      senderVoice: "FRIENDLY",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) return;

    try {
      setIsCreating(true);
      const createdPostcard: Postcard = await databases.createDocument(
        config.dbId,
        config.postcardCollectionId,
        nanoid(6),
        {
          type: values.type,
          mood: values.mood,
          themeColor: values.themeColor,
          formatStyle: values.formatStyle,
          senderVoice: values.senderVoice,
          notes: values.notes || null,
          userId: currentUser.$id,
        },
        [
          Permission.read(Role.user(currentUser.$id)),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id)),
        ]
      );

      setPostcards((prev) => [...prev, createdPostcard]);
      setSelectedPostcard(createdPostcard);
    } catch (error) {
      toastError(getErrorMessage(error));
    } finally {
      setIsCreating(false);
      form.reset();
    }
  }

  const type = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Type */}

        <h1 className="font-bold text-xl">Create a Postcard</h1>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Postcard Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_INFO[type].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-8 text-muted-foreground">
          {TYPE_INFO[type].description}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mood */}
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOODS.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Theme Color */}
          <FormField
            control={form.control}
            name="themeColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {THEMES.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Format Style */}
          <FormField
            control={form.control}
            name="formatStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FORMATS.map((fmt) => (
                      <SelectItem key={fmt} value={fmt}>
                        {fmt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sender Voice */}
          <FormField
            control={form.control}
            name="senderVoice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender Voice</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SENDER_VOICES.map((voice) => (
                      <SelectItem key={voice} value={voice}>
                        {voice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Anything extra?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end mt-8">
          <Button
            disabled={isCreating}
            type="submit"
            className="text-2xl py-2 h-auto px-6 rotate-2 rounded-tl-none rounded-br-none"
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
