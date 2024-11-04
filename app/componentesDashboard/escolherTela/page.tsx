/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/navbar";

const TemplateSelector: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const userId = "123";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erro ao buscar templates");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setTemplates(data);
        } else {
          throw new Error("Os dados não estão no formato esperado.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelectTemplate = async (templateId: number) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, templateId }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.filePath) {
        alert(result.message);
        router.push("/Dashboard");
        // window.location.href = `/components/${result.filePath}`; // Redirecione para a rota do template selecionado
      } else {
        alert("Erro: Caminho do template não encontrado");
      }
    } else {
      alert("Erro ao salvar a escolha do template");
    }
  };

  return (
    <>
      <Menu />
      <br />
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <h1 className="text-center lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-gray-800 mb-6">
            Escolha um Template
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {templates.map((template) => (
              <li key={template.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleSelectTemplate(template.id)}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full text-center border border-gray-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <p className="lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-700">
                    {template.name}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TemplateSelector;
