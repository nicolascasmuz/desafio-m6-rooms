customElements.define(
  "button-comp",
  class extends HTMLElement {
    shadow: ShadowRoot;
    text: string = "";
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      this.text = this.getAttribute("text") || "";

      const button = document.createElement("button");
      button.classList.add("button");
      button.innerText = this.text;

      const style = document.createElement("style");
      style.innerHTML = `
        .button {
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

      this.shadow.appendChild(button);
      this.shadow.appendChild(style);
    }
  }
);
