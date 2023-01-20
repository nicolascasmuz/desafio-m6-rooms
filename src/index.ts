import "./components/header";
import "./components/mymsg";
import "./components/othersmsg";

import "./pages/signin";
import "./pages/chatroom";

import "./router";
import { Router } from "@vaadin/router";

import { state } from "./state";

(function () {
  state.init();
  /* state.setEmailAndFullname("mastropiero@lesluthiers.com", "Maaastro");
  state.signIn((err) => {
    if (err) console.log("Hubo un error en el signIn");
    state.askNewRoom(() => {
      state.accessToRoom();
    });
  });

  const cs = state.getState();
  if (cs.rtdbRoomId && cs.userId) {
    Router.go("/chatroom");
  } */
})();
