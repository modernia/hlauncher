import { fs, shell, path } from "@tauri-apps/api";

import { useEffect, useState } from "react";

import { resourceDir } from '@tauri-apps/api/path';
import { ISearchResult } from "./ISearchResult";
import { searchMachedApps } from "./utils";


const PATHS = [
  "/usr/share/applications/",
  "/var/lib/flatpak/exports/share/applications/",
  "/var/lib/snapd/desktop/applications/",
  "/home/modernia/.local/share/applications/"
]


function App() {
  const [search, setSearch] = useState<ISearchResult[]>([]);
  const [name, setName] = useState("");

  const searchApps = () => {
    if(name === "") return;
    
    PATHS.forEach(async (p) => {
      const res = await searchMachedApps(name, search, p) as ISearchResult[];
      setSearch((prev) => [...prev, ...res]);
    });
  }

  useEffect(() => {
    console.log(search)
  }, [name, search]);
  

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button onClick={searchApps}>Search</button>
      <button onClick={() => setSearch([])}>Reset</button>

      <div>
        {search.map((i) => (
          <div 
            key={i.name}
            className="flex gap-2 items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => new shell.Command(i.exec).execute()}>
            <img src={`/src-tauri/target/debug/icons/${i.icon}`} className="w-16"/>
            <div className="text-left">
              <h1 className="text-lg font-semibold">{i.name}</h1>
              <p className="text-sm text-gray-900">{i.description}</p>
            </div>
          </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;


// asume que eres un experto en enseñar inglés a personas de latinoamérica para preparar para entrevistas de trabajo y apoyo en cargos a perfiles del área de la indusctrina de la tecnología.
// Te pido que simulemos una conversación y me corrijas si digo algo incorrecto en inglés, para así ayudarme a pronunciar mejor y/o como poder expresar mejor ciertas frases o palabras.
// La idea es que tu partas presentándote y me hagas primero un pregunta, y cuando yo te responda me des retroalimentacióñ de mi respuesta y me hagas otra pregunta (todo esto en inglés).
// Importante, ESPERA a que yo te responda cada pregunta y luego me das feedbacks y me haces la siguiente pregunta.