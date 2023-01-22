const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import { map } from "lodash";
import { Router } from "@vaadin/router";
import { json } from "body-parser";

const state = {
  data: {
    email: "",
    fullname: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    existingRoom: "",
    messages: [],
    from: "",
  },
  listeners: [],
  init() {
    const lastStorageState: any = localStorage.getItem("state");
    /* if (!lastStorageState) {
      return;
    }
    this.setState(JSON.parse(lastStorageState)); */
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado: ", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setEmailAndFullname(email: string, fullname: string) {
    const cs = this.getState();

    cs.email = email;
    cs.fullname = fullname;

    this.setState(cs);
  },
  signIn(callback) {
    const cs = this.getState();

    if (cs.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: cs.email }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un email en el state");
      callback(true);
    }
  },
  setExistingRoomProp(roomIdFromInput) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/rooms/" + roomIdFromInput).then((r) => {
      const contentLength = Number(r.headers.get("content-length"));
      if (contentLength != 0) {
        cs.roomId = roomIdFromInput;
        cs.existingRoom = true;
      } else {
        cs.existingRoom = false;
      }
      this.setState(cs);
    });
  },
  askNewRoom(callback?) {
    const cs = this.getState();

    if (cs.userId && cs.existingRoom == false) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else if (cs.userId && cs.existingRoom == true) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      });
      this.accessToRoom();
    } else {
      console.error("No hay userId");
    }
  },
  accessToRoom(callback?) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenToRoom();
        if (callback) {
          callback();
        }
      });

    /* if (cs.existingRoom == true) {
      fetch(API_BASE_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("accessToRoom: ", data);
          cs.rtdbRoomId = data.rtdbRoomId;
          this.setState(cs);
          this.listenToRoom();
          if (callback) {
            callback();
          }
        });
    } else if (cs.existingRoom == false) {
      fetch(API_BASE_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("accessToRoom: ", data);
          cs.rtdbRoomId = data.rtdbRoomId;
          this.setState(cs);
          this.listenToRoom();
          if (callback) {
            callback();
          }
        });
    } */
  },
  listenToRoom() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const currentState = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      currentState.messages = messagesList;
      this.setState(currentState);
    });
  },
  setFrom(fromWho: string) {
    const cs = this.getState();

    /* cs.from = "Fulano"; */
    cs.from = fromWho;

    this.setState(cs);
  },
  /*   getRoom(roomId) {
    const currentState = this.getState();

    fetch(API_BASE_URL + "/rooms/" + roomId).then((r) => {
      console.log("getRoom: ", r);
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
  }, */
  pushMessage(message: string) {
    const currentState = this.getState();
    const ownerName = currentState.fullname;

    /* currentState.messages.push(message); */

    fetch(API_BASE_URL + "/messages", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rtdbRoomId: currentState.rtdbRoomId,
        owner: ownerName,
        message: message,
        from: currentState.fullname,
      }),
    }).then((msg) => {
      console.log("msg: ", msg);
    });

    this.setState(currentState);
  },
};

export { state };
