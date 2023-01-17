const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import { map } from "lodash";

type EmailFullnameType = {
  email: string;
  fullname: string;
};

export const state = {
  data: {
    email: "",
    fullname: "",
    userId: "",
    roomId: "",
    existingRoom: "",
    rtdbRoomId: "",
    prueba: "",
    messages: [],
  },
  listeners: [],
  init() {
    const localData: any = localStorage.getItem("saved-state");
    if (!localData) {
      return;
    }
    this.setState(JSON.parse(localData));
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("saved-state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado: ", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  getRoom(roomId) {
    const currentState = this.getState();
    currentState.roomId = roomId;

    this.setState(currentState);

    fetch(API_BASE_URL + "/rooms/" + roomId, {
      method: "get",
    }).then((r) => {
      const contentLength = Number(r.headers.get("content-length"));
      if (contentLength != 0) {
        currentState.existingRoom = true;
      } else {
        currentState.existingRoom = false;
      }
      this.setState(currentState);
    });
  },
  getMessages(roomId) {
    const currentState = this.getState();

    fetch(API_BASE_URL + "/rooms/messages/" + roomId, {
      method: "get",
    }).then((messages) => {
      currentState.prueba = messages;
      this.setState(currentState);
    });
  },
  listenRoom() {
    const currentState = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + currentState.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const cs = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      cs.messages = messagesList;
      this.setState(cs);
    });
  },
  setNewRoom(longRoomId, shortRoomId) {
    const currentState = this.getState();
    currentState.rtdbRoomId = longRoomId;
    currentState.roomId = shortRoomId;

    this.setState(currentState);

    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        longRoomId: longRoomId,
        shortRoomId: shortRoomId,
      }),
    });
  },
  setEmailAndFullname(emailFullname: EmailFullnameType) {
    const currentState = this.getState();

    currentState.email = emailFullname.email;
    currentState.fullname = emailFullname.fullname;

    this.setState(currentState);
  },
  signIn() {
    const currentState = this.getState();

    if (currentState.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.userId = data.id;
          this.setState(currentState);
        });
    } else {
      console.error("No email");
    }
  },
  setNewUser(longUserId, shortUserId, EmailFullname: EmailFullnameType) {
    const currentState = this.getState();
    currentState.userId = shortUserId;
    currentState.email = EmailFullname.email;
    currentState.fullname = EmailFullname.fullname;

    this.setState(currentState);

    fetch(API_BASE_URL + "/users", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        longUserId: longUserId,
        shortUserId: shortUserId,
        userEmail: EmailFullname.email,
        userFullname: EmailFullname.fullname,
      }),
    });
  },
  pushMessage(message: string) {
    const currentState = this.getState();
    const roomId = currentState.roomId;
    const ownerName = currentState.fullname;

    currentState.messages.push(message);

    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        owner: ownerName,
        messages: message,
      }),
    });

    this.setState(currentState);
  },
};
