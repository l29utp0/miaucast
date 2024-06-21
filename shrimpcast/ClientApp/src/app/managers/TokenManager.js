import axios from "axios";
import LocalStorageManager from "./LocalStorageManager";

class TokenManager {
  static async EnsureTokenExists(abortSignal) {
    let url = "/api/session/GetNewOrExisting?accessToken=" + LocalStorageManager.getToken();
    let response = await axios.get(url, { signal: abortSignal }).catch((ex) => {
      if (!abortSignal.aborted)
        return { data: { message: `Não foi possível carregar o site: ${ex.message}. Refresca para tentar outra vez.` } };
    });
    this.SaveData(response?.data?.sessionToken, response?.data?.name);
    return response?.data;
  }

  static async ChangeName(signalR, name) {
    const response = await signalR.invoke("ChangeName", name).catch((ex) => console.log(ex));
    return response;
  }

  static async Import(signalR, accessToken) {
    const response = await signalR.invoke("ImportToken", accessToken).catch((ex) => console.log(ex));
    if (response) {
      TokenManager.SaveData(accessToken, null);
      setTimeout(() => window.location.reload(), 100);
    }
    return response;
  }

  static async SaveData(token, name) {
    token && LocalStorageManager.saveToken(token);
    name && LocalStorageManager.saveName(name);
  }
}

export default TokenManager;
