"use client";
import React, { useEffect, useState } from "react";

const TemplateSelector: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [templates, setTemplates] = useState<any[]>([]); // Use qualquer tipo de dados se preferir
  const userId = "123"; // Substitua por uma maneira de obter o ID do usuário autenticado

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setTemplates(data);
    };

    fetchTemplates();
  }, []);

  const handleSelectTemplate = async (templateId: number) => {
    const response = await fetch("/api/rotas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, templateId }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message); // Notifique o usuário que a escolha foi salva
      window.location.href = `/components/${result.filePath}`; // Redirecione para a rota do template selecionado
    } else {
      alert("Erro ao salvar a escolha do template");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Escolha um Template
        </h1>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {templates.map((template) => (
            <li key={template.id} className="flex flex-col items-center">
              <button
                onClick={() => handleSelectTemplate(template.id)}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full text-center border border-gray-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <p className="text-lg font-semibold text-gray-700">
                  {template.name}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;
