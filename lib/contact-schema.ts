import { z } from "zod";

/** Shared client/server validation for the contact ("Réservez une visite") form. */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]{8,20}$/),
  email: z.string().trim().email().max(200).or(z.literal("")),
  project: z.enum([
    "triple-towers",
    "les-villas-de-la-colline",
    "del-costa",
    "autre",
  ]),
  budget: z.enum(["lt1m", "1m-2m", "2m-4m", "gt4m", "nd"]),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — humans never fill this
  company: z.literal("").optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
