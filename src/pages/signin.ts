import { state } from "../state";
import { Router } from "@vaadin/router";
import { nanoid } from "nanoid";

customElements.define(
  "signin-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    connectedCallback() {
      // DISPLAY DEL ROOM EXISTENTE
      const selectEl = this.shadow.querySelector(
        ".signin-form__select-room"
      ) as HTMLSelectElement;
      const roomExistenteEl = this.shadow.querySelector(
        ".signin-form__room-id"
      ) as HTMLElement;

      selectEl.addEventListener("change", () => {
        if (selectEl.value == "nuevo-room") {
          roomExistenteEl.style.display = "none";
        } else {
          roomExistenteEl.style.display = "flex";
        }
      });

      // LISTENER DEL FORM
      const formEl = this.shadow.querySelector(
        ".signin-form__form"
      ) as HTMLElement;
      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();

        // SETEA EL USER
        const userEmail = e.target["email"].value;
        const userName = e.target["fullname"].value;

        const longUserId = nanoid();
        const shortUserId = longUserId.slice(16);

        state.setNewUser(longUserId, shortUserId, {
          email: userEmail,
          fullname: userName,
        });

        // SETEA EL ROOMID
        const selectEl = e.target["room-select"].value;
        const inputRoomidEl = e.target["roomid"].value;

        const longRoomId = nanoid();
        const shortRoomId = longRoomId.slice(16);

        if (selectEl == "nuevo-room" && userEmail != "" && userName != "") {
          state.setNewRoom(longRoomId, shortRoomId);
        } else if (selectEl == "room-existente") {
          state.getRoom(inputRoomidEl);
          state.getMessages(inputRoomidEl);
        }

        // COLOREA EL BORDE DE ROJO Y RUTEA LA PÁGINA
        const inputEmailEl = this.shadow.querySelector(
          ".signin-form__input-email"
        ) as HTMLElement;
        const inputNameEl = this.shadow.querySelector(
          ".signin-form__input-nombre"
        ) as HTMLElement;
        const existingRoomInput = this.shadow.querySelector(
          ".signin-form__input-roomid"
        ) as HTMLElement;

        if (userEmail == "" && userName == "") {
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px red";
        } else if (userEmail == "" && userName != "") {
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (userEmail != "" && userName == "") {
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px red";
        } else if (
          selectEl == "room-existente" &&
          inputRoomidEl.length != 5 &&
          userEmail == "" &&
          userName == ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px red";
        } else if (
          selectEl == "room-existente" &&
          inputRoomidEl.length != 5 &&
          userEmail != "" &&
          userName == ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px red";
        } else if (
          selectEl == "room-existente" &&
          inputRoomidEl.length != 5 &&
          userEmail == "" &&
          userName != ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px red";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (
          selectEl == "room-existente" &&
          inputRoomidEl.length != 5 &&
          userEmail != "" &&
          userName != ""
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (
          selectEl == "room-existente" &&
          inputRoomidEl.length == 5 &&
          userEmail != "" &&
          userName != "" &&
          state.getState().existingRoom == false
        ) {
          existingRoomInput.style.border = "solid 2px red";
          inputEmailEl.style.border = "solid 2px #8c8c8c";
          inputNameEl.style.border = "solid 2px #8c8c8c";
        } else if (state.getState().existingRoom == true) {
          Router.go("/chatroom");
        } else if (selectEl == "nuevo-room") {
          Router.go("/chatroom");
        }
      });
    }
    render() {
      const section = document.createElement("section");
      section.classList.add("signin-section");
      section.innerHTML = `
            <header-comp></header-comp>
            <div class="signin-container">
              <h1 class="signin-title">Bienvenido</h1>
              <form class="signin-form__form">
                <label class="signin-form__email">Email
                  <input class="signin-form__input-email" type="email" name="email">
                </label>
                <label class="signin-form__nombre">Tu nombre
                  <input class="signin-form__input-nombre" type="text" name="fullname">
                </label>
                <label class="signin-form__room">Room
                  <select class="signin-form__select-room" name="room-select">
                    <option value="nuevo-room">Nuevo room</option>
                    <option value="room-existente">Room existente</option>
                  </select>
                </label>
                <label class="signin-form__room-id">Room id
                  <input class="signin-form__input-roomid" type="text" name="roomid" placeholder="ej: AxATR1">
                </label>
                <button text="Comenzar" class="signin-form__button">Comenzar</button>
              </form>
            </div>
          `;

      const style = document.createElement("style");
      style.innerHTML = `
            .signin-container {
              display: grid;
              justify-content: center;
              margin: 25px 0;
            }
            .signin-title {
              font-family: 'Roboto', cursive;
              font-size: 52px;
              font-weight: 700;
              margin: 0 0 25px 0;
            }
            .signin-form__form {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px
            }
            .signin-form__email {
              display: flex;
              flex-direction: column;
              color: #000000;
              font-family: 'Roboto', cursive;
              font-size: 24px;
              font-weight: 500;
              color: #000000;
            }
            .signin-form__nombre {
              display: flex;
              flex-direction: column;
              color: #000000;
              font-family: 'Roboto', cursive;
              font-size: 24px;
              font-weight: 500;
              color: #000000;
            }
            .signin-form__room {
              display: flex;
              flex-direction: column;
              color: #000000;
              font-family: 'Roboto', cursive;
              font-size: 24px;
              font-weight: 500;
              color: #000000;
            }
            .signin-form__room-id {
              display: none;
              flex-direction: column;
              color: #000000;
              font-family: 'Roboto', cursive;
              font-size: 24px;
              font-weight: 500;
              color: #000000;
              margin: 0;
            }
            .signin-form__input-email {
              background-color: #FFFFFF;
              border: solid 2px #8c8c8c;
              border-radius: 4px;
              min-width: 312px;
              min-height: 55px;
              border: solid 2px #000000
              border-radius: 4px;
              font-family: 'Roboto';
              font-size: 25px;
            }
            .signin-form__input-nombre {
              background-color: #FFFFFF;
              border: solid 2px #8c8c8c;
              border-radius: 4px;
              min-width: 312px;
              min-height: 55px;
              border: solid 2px #000000
              border-radius: 4px;
              font-family: 'Roboto';
              font-size: 25px;
            }
            .signin-form__select-room {
              background-color: #FFFFFF;
              border: solid 2px #8c8c8c;
              border-radius: 4px;
              min-width: 312px;
              min-height: 55px;
              border: solid 2px #000000
              border-radius: 4px;
              font-family: 'Roboto';
              font-size: 25px;
            }
            .signin-form__input-roomid {
              background-color: #FFFFFF;
              border: solid 2px #8c8c8c;
              border-radius: 4px;
              min-width: 312px;
              min-height: 55px;
              border: solid 2px #000000
              border-radius: 4px;
              font-family: 'Roboto';
              font-size: 25px;
            }
            .signin-form__button {
              background-color: #9CBBE9;
              border: none;
              border-radius: 4px;
              color: #000000;
              font-family: 'Roboto', cursive;
              font-size: 22px;
              min-width: 312px;
              min-height: 55px;
            }
            `;

      this.shadow.appendChild(section);
      this.shadow.appendChild(style);
    }
  }
);
