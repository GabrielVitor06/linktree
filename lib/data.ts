import { z } from "zod";

export { z };

export function ensureValidData<Data>(
  data: Data,
  schema: z.ZodType<Data, z.ZodTypeDef>
) {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      "Os dados fornecidos são inválidos. Verifique os campos e tente novamente." +
        (process.env.NODE_ENV === "development"
          ? ` ${JSON.stringify(result.error.flatten())}`
          : "")
    );
  }
}
