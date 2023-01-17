customElements.define(
  "othersmsg-comp",
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

      const div = document.createElement("div");
      div.classList.add("othersmsg-div");
      div.innerHTML = `
        <p class="msg-div__text"><span class="msg-div__span">${this.userName}</span>${this.message}</p>
      `;

      const style = document.createElement("style");
      style.innerHTML = `
        .othersmsg-div {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          align-self: flex-start;
          width: fit-content;
          max-width: 250px;
          height: fit-content;
          background-color: #CAD3C8;
          border-radius: 4px;
          padding: 6px;
        }
        .othersmsg-div__text {
          align-text: right;
          margin: 0;
        }
        .othersmsg-div__span {
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
