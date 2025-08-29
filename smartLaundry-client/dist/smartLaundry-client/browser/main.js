import {
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  withInterceptorsFromDi
} from "./chunk-HB6TW7CH.js";
import {
  Component,
  provideZoneChangeDetection,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement
} from "./chunk-G6VDAKBQ.js";

// src/app/app.ts
var AppComponent = class _AppComponent {
  title = "Laundry-Smart";
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, imports: [RouterOutlet], template: "<router-outlet></router-outlet>" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.ts", lineNumber: 11 });
})();

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "/register", pathMatch: "full" },
  {
    path: "register",
    loadComponent: () => import("./chunk-62HBY3CK.js").then((m) => m.RegisterComponent)
  },
  {
    path: "login",
    loadComponent: () => import("./chunk-DPSQF2XX.js").then((m) => m.LoginComponent)
  }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi())
    // ← Add this line
  ]
};

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
