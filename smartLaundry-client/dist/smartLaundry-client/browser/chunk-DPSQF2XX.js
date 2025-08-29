import {
  CommonModule,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵtext
} from "./chunk-G6VDAKBQ.js";

// src/app/pages/auth/login/login.ts
var LoginComponent = class _LoginComponent {
  goToRegister() {
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 8, vars: 0, consts: [[1, "min-h-screen", "bg-gradient-hero", "flex", "items-center", "justify-center", "p-4"], [1, "bg-white", "p-8", "rounded-lg", "shadow-card"], [1, "text-2xl", "font-bold", "mb-4"], [1, "mt-4", "px-4", "py-2", "bg-blue-500", "text-white", "rounded", 3, "click"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Login");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "p");
      \u0275\u0275text(5, "Login component - Coming soon!");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "button", 3);
      \u0275\u0275domListener("click", function LoginComponent_Template_button_click_6_listener() {
        return ctx.goToRegister();
      });
      \u0275\u0275text(7, " Go to Register ");
      \u0275\u0275domElementEnd()()();
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{
      selector: "app-login",
      standalone: true,
      imports: [CommonModule],
      template: `
    <div class="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-card">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <p>Login component - Coming soon!</p>
        <button (click)="goToRegister()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Go to Register
        </button>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/pages/auth/login/login.ts", lineNumber: 20 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-DPSQF2XX.js.map
