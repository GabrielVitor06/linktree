"use client";

import { useState } from "react";
import { confirmPasswordReset, resetPassword } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Return from "@/components/return";

export default function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const obfuscatedUserId = await resetPassword(email);

      if (obfuscatedUserId) {
        setUserId(obfuscatedUserId);
        setStep(2);
        setSuccess("Código de segurança enviado para seu e-mail.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao enviar o código de segurança.");
      } else {
        setError("Erro desconhecido ao enviar o código de segurança.");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (userId) {
        await confirmPasswordReset(userId, securityCode, newPassword);
        setSuccess("Sua senha foi redefinida com sucesso!");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError("Erro interno: ID do usuário não encontrado.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao redefinir a senha.");
      } else {
        setError("Erro desconhecido ao redefinir a senha.");
      }
    }
  };

  return (
    <>
      <div className="m-12">
        <Return />
      </div>
      <div className="flex justify-center p-6 mt-36">
        <div className=" mx-auto bg-white shadow-md rounded w-full max-w-2xl p-4">
          <h2 className="text-xl font-bold mb-4">
            {step === 1 ? "Redefinir Senha" : "Confirme a Redefinição"}
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          {step === 1 ? (
            <form onSubmit={handleRequestCode}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Digite seu e-mail"
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Enviar
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label
                  htmlFor="securityCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Código de Segurança
                </label>
                <input
                  type="text"
                  id="securityCode"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  required
                  placeholder="Digite seu código"
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Digite seu nova senha"
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded"
              >
                Redefinir Senha
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
