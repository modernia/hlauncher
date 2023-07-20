import { fs, shell } from "@tauri-apps/api";

import { resourceDir } from "@tauri-apps/api/path";
import { ISearchResult } from "./ISearchResult";


export const searchMachedApps = async (name:string, search: ISearchResult[], dirPath:string) => {
  if(name === "") return;
  const files = await fs.readDir(dirPath);
  if(files.length === 0) return;
    const filteredResults = files.map(async (file) => {
      const includeFile = search.findIndex((i) => i.path === file.path)
      
      if((file.name !== undefined && file.name.includes(name) && file.name.endsWith(".desktop")) && includeFile === -1) {
        const username = await new shell.Command("whoami").execute()
        
        const app = await fs.readTextFile(file.path)
        const nameFile = app.substring(app.indexOf("Name=") + 5, app.indexOf("\n", app.indexOf("Name=")))
        const exec = app.substring(app.indexOf("Exec=") + 5, app.indexOf("\n", app.indexOf("Exec=")))
        let icon = app.substring(app.indexOf("Icon=") + 5, app.indexOf("\n", app.indexOf("Icon=")))
        const description = app.includes("Comment=") ? app.substring(app.indexOf("Comment=") + 8, app.indexOf("\n", app.indexOf("Comment="))) : app.substring(app.indexOf("Type=") + 5, app.indexOf("\n", app.indexOf("Type=")))
        

        const iconDir = [
          `/home/modernia/.icons/Win10Sur-blue-dark/apps/scalable`,
          '/usr/share/icons/hicolor/scalable/apps',
          '/usr/share/icons/hicolor/256x256/apps',
          '/usr/share/icons/hicolor/128x128/apps',
          '/usr/share/icons/hicolor/64x64/apps',
          '/home/modernia/.local/share/icons/hicolor/128x128/apps'
        ]
        icon = await searchIcon(icon, iconDir)

        return {
          name: nameFile.trim(),
          exec: exec,
          icon: icon,
          description: description,
          path: file.path
        }
      }
      
    });

    const results = await Promise.all(filteredResults)
    const filtered = results.filter((i) => i !== undefined)
    return filtered


}

const searchIcon = async (name:string, iconDir:string[]): Promise<string> => {
  if(name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".svg")) return name;
  if(name === "") return "unknown.jpg";
  if(iconDir.length === 0) return "unknown.jpg";

  const iconPath = (await fs.readDir(`${iconDir[0]}`, {recursive: true})).filter((i) => i.name?.split(".")[0].toString() === name)[0]
  if(iconPath === undefined) return searchIcon(name, iconDir.slice(1))

  if(await fs.exists(`${iconDir[0]}/${iconPath.name}`)){
    await fs.copyFile(iconPath.path, `${await resourceDir()}icons/${iconPath.name}`)
    if(await fs.exists(`${await resourceDir()}icons/${iconPath.name}`)){
      return `${iconPath.name}`
    }
  }
  return searchIcon(name, iconDir.slice(1))
}