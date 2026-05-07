import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

async function bootstrap() {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'warn'
    });
  }

  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
}

bootstrap();