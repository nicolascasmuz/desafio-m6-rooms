customElements.define(
  "mymsg-comp",
  class extends HTMLElement {
    shadow: ShadowRoot;
    userName: string = "";
    message: string = "";
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      this.userName = this.getAttribute("user-name") || "";
      this.message = this.getAttribute("message") || "";

      console.log("this.message: ", this.message);

      const div = document.createElement("div");
      div.classList.add("mymsg");
      div.innerHTML = `
        <p class="mymsg__text"><span class="mymsg__span">${this.userName}</span>${this.message}</p>
      `;

      const style = document.createElement("style");
      style.innerHTML = `
        .mymsg {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          align-self: flex-end;
          width: fit-content;
          max-width: 250px;
          height: fit-content;
          background-color: #78e08f;
          border-radius: 4px;
          padding: 6px;
        }
        .mymsg__text {
            align-text: right;
            margin: 0;
        }
        .mymsg__span {
            display: block;
            font-size: 12px;
            font-weight: 600;
            text-align: right;
        }
        `;

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
