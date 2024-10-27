export class UnexpectedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    if (options?.cause) {
      console.error(message, options.cause);
    }
  }
}

export function parseError(error: unknown) {
  if (error instanceof UnexpectedError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido";
}
